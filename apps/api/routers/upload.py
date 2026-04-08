import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator

from db.client import get_db, increment_videos_used
from middleware.auth import CurrentUser
from middleware.plan_check import check_video_quota
from middleware.rate_limit import rate_limit
from services.storage import generate_presigned_upload_url, make_video_key

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/quicktime",  # .mov
    "video/webm",
    "video/x-msvideo",  # .avi
    "video/x-matroska",  # .mkv
}

MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024  # 10 GB


class PresignedUploadRequest(BaseModel):
    filename: str
    filesize: int  # bytes
    filetype: str
    platform: str = "youtube"

    @field_validator("filetype")
    @classmethod
    def validate_filetype(cls, v: str) -> str:
        if v not in ALLOWED_VIDEO_TYPES:
            raise ValueError(f"Unsupported file type: {v}. Allowed: {ALLOWED_VIDEO_TYPES}")
        return v

    @field_validator("filesize")
    @classmethod
    def validate_filesize(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("File size must be positive")
        if v > MAX_FILE_SIZE:
            raise ValueError("File exceeds the 10 GB limit")
        return v

    @field_validator("filename")
    @classmethod
    def validate_filename(cls, v: str) -> str:
        if not v or len(v) > 255:
            raise ValueError("Invalid filename")
        return v

    @field_validator("platform")
    @classmethod
    def validate_platform(cls, v: str) -> str:
        allowed = {"youtube", "tiktok", "instagram", "linkedin", "twitter", "shorts", "facebook"}
        if v not in allowed:
            raise ValueError(f"Platform must be one of {allowed}")
        return v


class PresignedUploadResponse(BaseModel):
    upload_url: str
    video_id: str
    r2_key: str


class UploadCompleteRequest(BaseModel):
    video_id: str


@router.post(
    "/upload/presigned",
    response_model=PresignedUploadResponse,
    dependencies=[Depends(rate_limit(limit=10, window_seconds=60))],
)
async def request_presigned_upload(
    body: PresignedUploadRequest,
    
):
    """
    Step 1 of the upload flow.
    Checks quota, creates a video DB record, returns a presigned PUT URL.
    The client uploads directly to Cloudflare R2 using this URL.
    """
   # check_video_quota(user)

    db = get_db()
    video_id = str(uuid.uuid4())
    r2_key = make_video_key(user.id, body.filename)

    try:
        upload_url = generate_presigned_upload_url(r2_key, body.filetype)
    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"error": "Storage service unavailable", "code": "STORAGE_ERROR"},
        )

    db.table("videos").insert(
        {
            "id": video_id,
            "user_id": user.id,
            "title": body.filename.rsplit(".", 1)[0] or "Untitled Video",
            "file_size": body.filesize,
            "platform": body.platform,
            "r2_key": r2_key,
            "status": "uploading",
        }
    ).execute()

    return PresignedUploadResponse(
        upload_url=upload_url,
        video_id=video_id,
        r2_key=r2_key,
    )


@router.post("/upload/complete", status_code=status.HTTP_202_ACCEPTED)
async def upload_complete(body: UploadCompleteRequest, user: CurrentUser):
    """
    Step 2 of the upload flow.
    Called after the client finishes uploading to R2.
    Sets video status to 'processing' and enqueues the analysis job.
    """
    db = get_db()

    # Verify ownership
    result = (
        db.table("videos")
        .select("id, user_id, r2_key, status")
        .eq("id", body.video_id)
        .eq("user_id", user.id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Video not found", "code": "VIDEO_NOT_FOUND"},
        )

    video = result.data
    if video["status"] != "uploading":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"error": "Video upload already completed", "code": "ALREADY_COMPLETE"},
        )

    # Update status
    db.table("videos").update({"status": "processing"}).eq("id", body.video_id).execute()

    # Increment usage counter
    increment_videos_used(user.id, 1)

    # Enqueue analysis job
    try:
        import redis as redis_lib
        import os
        from rq import Queue

        r = redis_lib.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
        q = Queue("analyze", connection=r)
        job = q.enqueue("steps.analyze_pipeline.run", body.video_id)
        logger.info(f"Enqueued analyze job {job.id} for video {body.video_id}")
    except Exception as e:
        logger.error(f"Failed to enqueue analysis job: {e}")
        # Don't fail the response — worker will retry via polling

    return {"success": True, "video_id": body.video_id}


class UrlImportRequest(BaseModel):
    url: str
    platform: str = "youtube"

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        allowed_patterns = [
            "youtube.com/watch",
            "youtu.be/",
            "drive.google.com/",
            "dropbox.com/",
        ]
        if not any(p in v for p in allowed_patterns):
            raise ValueError("URL must be from YouTube, Google Drive, or Dropbox")
        return v


@router.post(
    "/upload/from-url",
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(rate_limit(limit=5, window_seconds=60))],
)
async def upload_from_url(body: UrlImportRequest, user: CurrentUser):
    """
    Import a video from a URL (YouTube/Drive/Dropbox).
    Queues a download+upload job in the worker.
    Returns immediately with a video_id; the job runs async.
    """
    check_video_quota(user)

    db = get_db()
    video_id = str(uuid.uuid4())

    db.table("videos").insert(
        {
            "id": video_id,
            "user_id": user.id,
            "title": "Imported Video",
            "platform": body.platform,
            "status": "uploading",
        }
    ).execute()

    try:
        import os
        import redis as redis_lib
        from rq import Queue

        r = redis_lib.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
        q = Queue("analyze", connection=r)
        q.enqueue("steps.import_url.run", video_id, body.url, user.id)
    except Exception as e:
        logger.warning(f"Failed to enqueue URL import job: {e}")
        db.table("videos").update(
            {
                "status": "uploading",
                "error_message": "Worker unavailable. Start Redis + worker to process URL imports.",
            }
        ).eq("id", video_id).execute()
        return {
            "video_id": video_id,
            "queued": False,
            "warning": "Worker unavailable. Start Redis + worker to process this import.",
        }

    return {"video_id": video_id, "queued": True}
