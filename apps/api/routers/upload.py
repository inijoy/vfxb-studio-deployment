import logging
import uuid

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, field_validator

from db.client import get_db
from services.storage import generate_presigned_upload_url, make_video_key

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/quicktime",
    "video/webm",
    "video/x-msvideo",
    "video/x-matroska",
}

MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024  # 10 GB


class PresignedUploadRequest(BaseModel):
    filename: str
    filesize: int
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


# ✅ NEW: Request model for completion
class CompleteUploadRequest(BaseModel):
    video_id: str


@router.post(
    "/upload/presigned",
    response_model=PresignedUploadResponse,
)
async def request_presigned_upload(
    body: PresignedUploadRequest,
):
    """
    TEMP VERSION (no auth) for testing upload pipeline.
    """

    db = get_db()
    video_id = str(uuid.uuid4())

    dummy_user_id = "test-user"

    r2_key = make_video_key(dummy_user_id, body.filename)

    try:
        upload_url = "https://httpbin.org/put"
    except Exception as e:
        logger.error(f"Failed to generate presigned URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"error": "Storage service unavailable", "code": "STORAGE_ERROR"},
        )

    db.table("videos").insert(
        {
            "id": video_id,
            "user_id": dummy_user_id,
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


# ✅ NEW: Upload completion endpoint
@router.post("/upload/complete")
async def complete_upload(body: CompleteUploadRequest):
    """
    TEMP endpoint to finalize upload.
    Marks video as completed.
    """

    db = get_db()

    try:
        logger.info(f"Completing upload for video_id={body.video_id}")

        # Update video status in DB
        db.table("videos").update(
            {"status": "completed"}
        ).eq("id", body.video_id).execute()

        return {
            "status": "success",
            "video_id": body.video_id,
        }

    except Exception as e:
        logger.error(f"Upload completion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Upload completion failed",
        )