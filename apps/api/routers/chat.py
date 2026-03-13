"""
Chat router with Server-Sent Events (SSE) streaming.
- POST /api/chat/message      → stream AI response
- POST /api/chat/confirm-edit → queue confirmed edit
- GET  /api/chat/history/{video_id}
"""
import json
import logging
import uuid
from typing import Any, AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from db.client import get_db
from middleware.auth import CurrentUser
from middleware.rate_limit import rate_limit
from services.nlp_parser import parse_edit_intent_streaming

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_AGENTS = {"vfxb", "gpt4o", "claude", "gemini", "suno"}


def _as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _as_list_of_dicts(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, dict)]


class ChatMessageRequest(BaseModel):
    video_id: str
    message: str = Field(..., min_length=1, max_length=2000)
    agent: str = "vfxb"


class ConfirmEditRequest(BaseModel):
    edit_id: str
    confirmed: bool


def _verify_video_ownership(video_id: str, user_id: str) -> dict:
    """Load video and verify the user owns it. Raises 404 if not found."""
    db = get_db()
    result = (
        db.table("videos")
        .select("*")
        .eq("id", video_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    data = _as_dict(result.data)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "Video not found", "code": "VIDEO_NOT_FOUND"},
        )
    return data


def _get_conversation_history(video_id: str, limit: int = 10) -> list[dict]:
    db = get_db()
    result = (
        db.table("chat_messages")
        .select("role, content, agent")
        .eq("video_id", video_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    # Return in chronological order
    return list(reversed(_as_list_of_dicts(result.data)))


def _save_message(
    video_id: str,
    user_id: str,
    role: str,
    content: str,
    agent: str = "vfxb",
    edit_id: str | None = None,
    metadata: dict | None = None,
) -> str:
    db = get_db()
    msg_id = str(uuid.uuid4())
    db.table("chat_messages").insert(
        {
            "id": msg_id,
            "video_id": video_id,
            "user_id": user_id,
            "role": role,
            "content": content,
            "agent": agent,
            "edit_id": edit_id,
            "metadata": metadata,
        }
    ).execute()
    return msg_id


def _create_edit_record(
    video_id: str, user_id: str, edit_plan: dict, instruction: str, agent: str
) -> str:
    """Create a pending edit record from an edit plan item."""
    db = get_db()
    edit_id = str(uuid.uuid4())

    edits = edit_plan.get("edits", [])
    first_edit = edits[0] if edits else {}

    db.table("edits").insert(
        {
            "id": edit_id,
            "video_id": video_id,
            "user_id": user_id,
            "type": first_edit.get("type", "trim"),
            "instruction": instruction,
            "ai_response": edit_plan.get("response_message", ""),
            "agent_used": agent,
            "params": {"edits": edits},
            "status": "pending",
        }
    ).execute()
    return edit_id


async def _sse_stream(
    user_message: str,
    video: dict,
    user_id: str,
    agent: str,
    history: list[dict],
) -> AsyncGenerator[str, None]:
    """
    Stream SSE events with AI response.
    Yields:
      data: {"type": "text", "content": "..."}    ← token chunks
      data: {"type": "edit_plan", "plan": {...}}   ← if edit detected
      data: {"type": "done"}                       ← end of stream
    """
    db = get_db()
    video_id = video["id"]
    accumulated = ""

    try:
        # Get creator DNA for context injection
        user_record = db.table("users").select("creator_dna").eq("id", user_id).single().execute()
        user_data = _as_dict(user_record.data)
        creator_dna = user_data.get("creator_dna") if isinstance(user_data.get("creator_dna"), dict) else None

        # Stream text tokens from the NLP parser
        for token in parse_edit_intent_streaming(user_message, video, history, creator_dna, agent):
            accumulated += token
            yield f"data: {json.dumps({'type': 'text', 'content': token})}\n\n"

        # Parse the full accumulated JSON response
        raw = accumulated.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            # Fallback: treat as plain text response
            parsed = {
                "understood_intent": "conversation",
                "edits": [],
                "response_message": accumulated,
                "needs_confirmation": False,
                "is_question": True,
            }

        response_text = parsed.get("response_message", accumulated)
        edits = parsed.get("edits", [])
        needs_confirmation = parsed.get("needs_confirmation", False) and bool(edits)

        # Save both messages to DB
        _save_message(video_id, user_id, "user", user_message, agent)

        edit_id = None
        if edits and needs_confirmation:
            edit_id = _create_edit_record(video_id, user_id, parsed, user_message, agent)
            _save_message(
                video_id, user_id, "assistant", response_text, agent,
                edit_id=edit_id,
                metadata={"edit_plan": parsed, "edit_id": edit_id},
            )
            # Send the edit plan card to the frontend
            yield f"data: {json.dumps({'type': 'edit_plan', 'plan': parsed, 'edit_id': edit_id})}\n\n"
        else:
            _save_message(video_id, user_id, "assistant", response_text, agent)

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception as e:
        logger.error(f"SSE stream error: {e}", exc_info=True)
        yield f"data: {json.dumps({'type': 'error', 'message': 'Something went wrong. Please try again.'})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"


@router.post(
    "/chat/message",
    # SSE response — not a JSON model
    response_class=StreamingResponse,
    dependencies=[Depends(rate_limit(limit=20, window_seconds=60))],
)
async def send_chat_message(body: ChatMessageRequest, user: CurrentUser):
    """
    Send a message to the AI. Returns an SSE stream.
    Connect with: EventSource or fetch with ReadableStream.
    """
    if body.agent not in ALLOWED_AGENTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"agent must be one of {ALLOWED_AGENTS}",
        )

    video = _verify_video_ownership(body.video_id, user.id)

    if video["status"] not in ("analyzed", "editing", "done", "processing"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "Video analysis not yet complete",
                "status": video["status"],
                "code": "ANALYSIS_PENDING",
            },
        )

    history = _get_conversation_history(body.video_id)

    return StreamingResponse(
        _sse_stream(body.message, video, user.id, body.agent, history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable nginx buffering
        },
    )


@router.post("/chat/confirm-edit", status_code=status.HTTP_202_ACCEPTED)
async def confirm_edit(body: ConfirmEditRequest, user: CurrentUser):
    """
    Confirm or cancel a pending edit plan.
    If confirmed, queues the FFmpeg job and returns a job_id.
    """
    db = get_db()

    edit = (
        db.table("edits")
        .select("*")
        .eq("id", body.edit_id)
        .eq("user_id", user.id)
        .single()
        .execute()
    )

    if not edit.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Edit not found")

    edit_data = _as_dict(edit.data)
    edit_status = str(edit_data.get("status", ""))

    if edit_status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Edit is already in status: {edit_status}",
        )

    if not body.confirmed:
        db.table("edits").update({"status": "failed"}).eq("id", body.edit_id).execute()
        return {"confirmed": False, "edit_id": body.edit_id}

    # Mark as queued
    db.table("edits").update({"status": "queued"}).eq("id", body.edit_id).execute()

    # Enqueue the FFmpeg job
    try:
        import os
        import redis as redis_lib
        from rq import Queue

        r = redis_lib.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
        q = Queue("edit", connection=r)
        job = q.enqueue("services.ffmpeg_executor.run_edit", body.edit_id, job_timeout="60m")

        db.table("edits").update({"rq_job_id": job.id}).eq("id", body.edit_id).execute()

        logger.info(f"Queued edit job {job.id} for edit {body.edit_id}")
        return {"confirmed": True, "edit_id": body.edit_id, "job_id": job.id}
    except Exception as e:
        logger.warning(f"Worker unavailable; keeping edit queued without job id: {e}")
        return {
            "confirmed": True,
            "edit_id": body.edit_id,
            "job_id": None,
            "queued": False,
            "warning": "Worker unavailable. Start Redis + worker to process this edit.",
        }


@router.get("/chat/history/{video_id}")
async def get_chat_history(video_id: str, user: CurrentUser):
    """Return last 50 chat messages for a video."""
    _verify_video_ownership(video_id, user.id)
    db = get_db()

    result = (
        db.table("chat_messages")
        .select("*")
        .eq("video_id", video_id)
        .order("created_at", desc=False)
        .limit(50)
        .execute()
    )
    return result.data or []
