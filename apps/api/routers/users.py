from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from db.client import get_db
from middleware.auth import CurrentUser

router = APIRouter()


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

    return result.data


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
    return result.data


@router.post("/users/ensure", status_code=status.HTTP_201_CREATED)
async def ensure_user(user: CurrentUser):
    """
    Called on first sign-in to upsert the user profile.
    The frontend calls this immediately after Supabase auth succeeds.
    """
    db = get_db()

    existing = db.table("users").select("id").eq("id", user.id).execute()
    if existing.data:
        return {"created": False}

    db.table("users").insert(
        {
            "id": user.id,
            "email": user.email,
            "plan": "free",
            "creator_mode": "longform",
            "videos_used": 0,
            "videos_limit": 3,
        }
    ).execute()

    return {"created": True}
