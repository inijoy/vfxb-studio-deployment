import logging
from typing import Literal

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from db.client import get_db, increment_videos_used
from middleware.auth import CurrentUser

logger = logging.getLogger(__name__)
router = APIRouter()


class VideoListItem(BaseModel):
    id: str
    title: str
    status: str
    virality_score: int | None
    thumbnail_url: str | None
    duration: int | None
    platform: str
    created_at: str
    updated_at: str


class VideoDetail(VideoListItem):
    original_url: str | None
    processed_url: str | None
    score_breakdown: dict | None
    analysis: dict | None
    transcript: str | None
    file_size: int | None
    resolution: str | None
    fps: int | None


@router.get("/videos", response_model=list[VideoListItem])
async def list_videos(
    user: CurrentUser,
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    sort: Literal["created_at", "updated_at", "virality_score"] = "updated_at",
):
    """List videos owned by the authenticated user."""
    db = get_db()
    result = (
        db.table("videos")
        .select(
            "id, title, status, virality_score, thumbnail_url, "
            "duration, platform, created_at, updated_at"
        )
        .eq("user_id", user.id)
        .order(sort, desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return result.data or []


@router.get("/videos/{video_id}", response_model=VideoDetail)
async def get_video(video_id: str, user: CurrentUser):
    """Get full video details including analysis and score breakdown."""
    db = get_db()
    result = (
        db.table("videos")
        .select("*")
        .eq("id", video_id)
        .eq("user_id", user.id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Video not found", "code": "VIDEO_NOT_FOUND"},
        )

    return result.data


@router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(video_id: str, user: CurrentUser):
    """Delete a video and all associated edits/chats."""
    db = get_db()

    # Check ownership
    result = (
        db.table("videos")
        .select("id, r2_key")
        .eq("id", video_id)
        .eq("user_id", user.id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    # Delete related docs explicitly (Mongo has no FK cascade)
    db.table("edits").delete().eq("video_id", video_id).execute()
    db.table("chat_messages").delete().eq("video_id", video_id).execute()
    db.table("exports").delete().eq("video_id", video_id).execute()

    # Delete video document
    db.table("videos").delete().eq("id", video_id).execute()

    # Decrement usage counter
    increment_videos_used(user.id, -1)


@router.get("/videos/{video_id}/edits")
async def get_video_edits(
    video_id: str,
    user: CurrentUser,
    limit: int = Query(default=50, le=200),
):
    """List all edits for a video."""
    db = get_db()

    # Verify ownership
    video = (
        db.table("videos")
        .select("id")
        .eq("id", video_id)
        .eq("user_id", user.id)
        .single()
        .execute()
    )
    if not video.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    result = (
        db.table("edits")
        .select("*")
        .eq("video_id", video_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []


@router.get("/videos/{video_id}/analysis")
async def get_video_analysis(video_id: str, user: CurrentUser):
    """Return the full AI analysis for a video (convenience endpoint)."""
    db = get_db()
    result = (
        db.table("videos")
        .select(
            "id, status, virality_score, score_breakdown, analysis, transcript, updated_at"
        )
        .eq("id", video_id)
        .eq("user_id", user.id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    if result.data["status"] not in ("analyzed", "editing", "done"):
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail={
                "message": "Analysis still in progress",
                "status": result.data["status"],
            },
        )

    return result.data


@router.get("/stats")
async def get_stats(user: CurrentUser):
    """Return aggregate stats for the dashboard."""
    db = get_db()

    videos = (
        db.table("videos")
        .select("virality_score, status")
        .eq("user_id", user.id)
        .execute()
    )

    total = len(videos.data)
    scored = [v for v in videos.data if v["virality_score"] is not None]
    avg_score = round(sum(v["virality_score"] for v in scored) / len(scored)) if scored else 0

    user_data = (
        db.table("users")
        .select("videos_used, videos_limit, plan")
        .eq("id", user.id)
        .single()
        .execute()
    )

    return {
        "total_videos": total,
        "avg_virality_score": avg_score,
        "videos_used": user_data.data["videos_used"],
        "videos_limit": user_data.data["videos_limit"],
        "plan": user_data.data["plan"],
    }
