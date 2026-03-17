from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone

from db.client import get_db
from middleware.auth import CurrentUser

router = APIRouter()


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _normalize_user_doc(doc: dict, fallback_email: str = "") -> dict:
    out = dict(doc)
    out.setdefault("email", fallback_email)
    out.setdefault("full_name", out.get("name"))
    out.setdefault("avatar_url", out.get("profilePicture"))
    out.setdefault("plan", "free")
    out.setdefault("creator_mode", "longform")
    out.setdefault("videos_used", 0)
    out.setdefault("videos_limit", 3)
    out.setdefault("created_at", _now_iso())
    return out


class UserUpdateRequest(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    creator_mode: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str | None
    avatar_url: str | None
    plan: str
    creator_mode: str
    videos_used: int
    videos_limit: int
    created_at: str


@router.get("/users/me", response_model=UserResponse)
async def get_me(user: CurrentUser):
    """Return the authenticated user's profile."""
    db = get_db()
    result = db.table("users").select("*").eq("id", user.id).single().execute()

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return _normalize_user_doc(result.data, user.email)


@router.patch("/users/me", response_model=UserResponse)
async def update_me(user: CurrentUser, body: UserUpdateRequest):
    """Update the authenticated user's profile."""
    db = get_db()

    updates: dict = {}
    if body.full_name is not None:
        updates["full_name"] = body.full_name
    if body.avatar_url is not None:
        updates["avatar_url"] = body.avatar_url
    if body.creator_mode is not None:
        allowed_modes = {"longform", "shortform", "agency"}
        if body.creator_mode not in allowed_modes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"creator_mode must be one of {allowed_modes}",
            )
        updates["creator_mode"] = body.creator_mode

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    db.table("users").update(updates).eq("id", user.id).execute()
    result = db.table("users").select("*").eq("id", user.id).single().execute()
    return _normalize_user_doc(result.data or {}, user.email)


@router.post("/users/ensure", status_code=status.HTTP_201_CREATED)
async def ensure_user(user: CurrentUser):
    """
    Called on first sign-in to upsert the user profile.
    The frontend calls this immediately after auth succeeds.
    """
    db = get_db()

    existing = db.table("users").select("*").eq("id", user.id).single().execute()
    if existing.data:
        normalized = _normalize_user_doc(existing.data, user.email)
        patch: dict = {}
        for key in ("email", "full_name", "avatar_url", "plan", "creator_mode", "videos_used", "videos_limit", "created_at"):
            if existing.data.get(key) is None:
                patch[key] = normalized[key]
        if patch:
            db.table("users").update(patch).eq("id", user.id).execute()
        return {"created": False}

    # If auth-server already created the user in Mongo (by email), attach app fields.
    existing_by_email = db.table("users").select("id, email").eq("email", user.email).single().execute()
    if existing_by_email.data:
        db.table("users").update(
            {
                "id": user.id,
                "full_name": existing_by_email.data.get("name"),
                "avatar_url": existing_by_email.data.get("profilePicture"),
                "plan": "free",
                "creator_mode": "longform",
                "videos_used": 0,
                "videos_limit": 3,
                "created_at": existing_by_email.data.get("created_at") or _now_iso(),
            }
        ).eq("email", user.email).execute()
        return {"created": False}

    db.table("users").insert(
        {
            "id": user.id,
            "email": user.email,
            "full_name": None,
            "avatar_url": None,
            "plan": "free",
            "creator_mode": "longform",
            "videos_used": 0,
            "videos_limit": 3,
            "created_at": _now_iso(),
        }
    ).execute()

    return {"created": True}
