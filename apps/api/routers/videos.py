import logging
from typing import Literal

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from db.client import get_db
from db.storage import VIDEOS_DB

logger = logging.getLogger(__name__)

router = APIRouter()


class VideoListItem(BaseModel):
    id: str
    title: str
    status: str
    virality_score: int | None = None
    thumbnail_url: str | None = None
    duration: int | None = None
    platform: str
    created_at: str | None = None
    updated_at: str | None = None


class VideoDetail(VideoListItem):
    original_url: str | None = None
    processed_url: str | None = None
    score_breakdown: dict | None = None
    analysis: dict | None = None
    transcript: str | None = None
    file_size: int | None = None
    resolution: str | None = None
    fps: int | None = None


# =========================
# LIST VIDEOS
# =========================
@router.get("/videos", response_model=list[VideoListItem])
async def list_videos(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    sort: Literal["created_at", "updated_at", "virality_score"] = "updated_at",
):
    db = get_db()

    try:
        result = (
            db.table("videos")
            .select(
                "id, title, status, virality_score, thumbnail_url, "
                "duration, platform, created_at, updated_at"
            )
            .order(sort, desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return result.data or []

    except Exception as e:
        logger.error(f"List videos failed: {e}")
        return []


# =========================
# GET SINGLE VIDEO (FIXED)
# =========================
@router.get("/videos/{video_id}", response_model=VideoDetail)
async def get_video(video_id: str):
    db = get_db()
    video = None

    # 1. Try Supabase safely
    try:
        result = (
            db.table("videos")
            .select("*")
            .eq("id", video_id)
            .maybe_single()
            .execute()
        )
        if result:
            video = result.data
    except Exception as e:
        logger.warning(f"Supabase error, using fallback: {e}")

    # 2. Fallback to in-memory store
    if not video:
        video = VIDEOS_DB.get(video_id)

    # 3. Not found → clean 404 (NO MORE 500s)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Video not found", "code": "VIDEO_NOT_FOUND"},
        )

    return video


# =========================
# DELETE VIDEO (SAFE)
# =========================
@router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(video_id: str):
    db = get_db()

    try:
        db.table("edits").delete().eq("video_id", video_id).execute()
        db.table("chat_messages").delete().eq("video_id", video_id).execute()
        db.table("exports").delete().eq("video_id", video_id).execute()
        db.table("videos").delete().eq("id", video_id).execute()

    except Exception as e:
        logger.error(f"Delete failed: {e}")


# =========================
# EDITS
# =========================
@router.get("/videos/{video_id}/edits")
async def get_video_edits(video_id: str, limit: int = Query(default=50, le=200)):
    db = get_db()

    try:
        video = (
            db.table("videos")
            .select("id")
            .eq("id", video_id)
            .maybe_single()
            .execute()
        )

        if not video or not video.data:
            raise HTTPException(status_code=404, detail="Video not found")

        result = (
            db.table("edits")
            .select("*")
            .eq("video_id", video_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        return result.data or []

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get edits failed: {e}")
        return []


# =========================
# ANALYSIS
# =========================
@router.get("/videos/{video_id}/analysis")
async def get_video_analysis(video_id: str):
    db = get_db()

    try:
        result = (
            db.table("videos")
            .select("id, status, virality_score, score_breakdown, analysis, transcript, updated_at")
            .eq("id", video_id)
            .maybe_single()
            .execute()
        )

        if not result or not result.data:
            raise HTTPException(status_code=404, detail="Video not found")

        return result.data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Analysis error")


# =========================
# STATS
# =========================
@router.get("/stats")
async def get_stats():
    db = get_db()

    try:
        videos = db.table("videos").select("virality_score, status").execute()

        total = len(videos.data or [])
        scored = [v for v in (videos.data or []) if v.get("virality_score") is not None]

        avg_score = (
            round(sum(v["virality_score"] for v in scored) / len(scored))
            if scored else 0
        )

        user_data = db.table("users").select("videos_used, videos_limit, plan").limit(1).execute()
        user_row = user_data.data[0] if user_data.data else {}

        return {
            "total_videos": total,
            "avg_virality_score": avg_score,
            "videos_used": user_row.get("videos_used", 0),
            "videos_limit": user_row.get("videos_limit", 0),
            "plan": user_row.get("plan", "free"),
        }

    except Exception as e:
        logger.error(f"Stats error: {e}")
        return {
            "total_videos": 0,
            "avg_virality_score": 0,
            "videos_used": 0,
            "videos_limit": 0,
            "plan": "free",
        }