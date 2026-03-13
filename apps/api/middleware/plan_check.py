from functools import wraps
from typing import Any, Callable

from fastapi import HTTPException, status

from db.client import get_db
from middleware.auth import AuthUser

# Features available per plan
PLAN_FEATURES: dict[str, set[str]] = {
    "free": {"basic_analysis", "nlp_edit", "export"},
    "pro": {"basic_analysis", "nlp_edit", "export", "collaboration", "auto_publish", "creator_dna"},
    "enterprise": {
        "basic_analysis", "nlp_edit", "export", "collaboration",
        "auto_publish", "creator_dna", "api_access", "priority_processing",
    },
}

PLAN_PRIORITY = {"free": 0, "pro": 1, "enterprise": 2}


def _as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def require_plan(minimum_plan: str):
    """
    FastAPI dependency factory — raises 403 if the user's plan is below
    the minimum required plan.
    """

    async def _check(user: AuthUser) -> AuthUser:
        db = get_db()
        result = db.table("users").select("plan").eq("id", user.id).single().execute()
        data = _as_dict(result.data)
        user_plan = str(data.get("plan", "free"))

        if PLAN_PRIORITY.get(user_plan, 0) < PLAN_PRIORITY.get(minimum_plan, 99):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "Plan upgrade required",
                    "code": "UPGRADE_REQUIRED",
                    "required_plan": minimum_plan,
                    "current_plan": user_plan,
                },
            )
        return user

    return _check


def check_video_quota(user: AuthUser) -> None:
    """
    Raises 403 if the user has reached their video upload limit.
    Call this before creating a new video record.
    """
    db = get_db()
    result = (
        db.table("users")
        .select("plan, videos_used, videos_limit")
        .eq("id", user.id)
        .single()
        .execute()
    )
    data = _as_dict(result.data)
    plan = str(data.get("plan", "free"))
    videos_used = int(data.get("videos_used", 0) or 0)
    videos_limit = int(data.get("videos_limit", 0) or 0)

    if plan == "free" and videos_used >= videos_limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Video limit reached. Upgrade to Pro for unlimited videos.",
                "code": "VIDEO_LIMIT_REACHED",
                "videos_used": videos_used,
                "videos_limit": videos_limit,
            },
        )
