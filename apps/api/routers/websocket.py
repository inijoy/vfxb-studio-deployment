"""
WebSocket router for real-time edit status updates.
WS /ws/edit-status/{job_id}
"""
import asyncio
import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status

from db.client import get_db

logger = logging.getLogger(__name__)
router = APIRouter()

POLL_INTERVAL = 2.0      # seconds between status polls
MAX_WAIT_TIME = 3600.0   # 1 hour max connection


@router.websocket("/ws/edit-status/{job_id}")
async def edit_status_ws(websocket: WebSocket, job_id: str):
    """
    WebSocket endpoint that streams job progress to the client.
    The client authenticates by sending token as first message.
    Broadcasts:
      {"status": "queued",      "progress": 0}
      {"status": "processing",  "progress": 45}
      {"status": "done",        "progress": 100, "output_url": "...", "new_score": 89}
      {"status": "failed",      "message": "..."}
    """
    await websocket.accept()

    try:
        # Auth: expect JWT as first message
        auth_msg = await asyncio.wait_for(websocket.receive_text(), timeout=10.0)
        auth_data = json.loads(auth_msg)
        token = auth_data.get("token", "")

        if not token:
            await websocket.send_json({"error": "Authentication required"})
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # Validate token (re-use the auth middleware logic)
        from middleware.auth import _decode_supabase_jwt
        try:
            payload = _decode_supabase_jwt(token)
            user_id = payload.get("sub")
        except Exception:
            await websocket.send_json({"error": "Invalid token"})
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # Verify this job belongs to the user
        db = get_db()
        edit = (
            db.table("edits")
            .select("id, status, rq_job_id, video_id, output_url, after_score")
            .eq("id", job_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not edit.data:
            await websocket.send_json({"error": "Job not found"})
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        rq_job_id = edit.data.get("rq_job_id")
        elapsed = 0.0

        while elapsed < MAX_WAIT_TIME:
            # Poll RQ job status
            progress_data = {"status": "queued", "progress": 0}

            if rq_job_id:
                try:
                    import os, redis as redis_lib
                    from rq.job import Job
                    conn = redis_lib.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
                    job = Job.fetch(rq_job_id, connection=conn)
                    job_status = job.get_status().value
                    job_progress = job.meta.get("progress", 0)
                    job_message = job.meta.get("message", "")

                    progress_data = {
                        "status": job_status,
                        "progress": job_progress,
                        "message": job_message,
                    }

                    if job_status == "finished":
                        # Fetch updated edit from DB
                        updated = (
                            db.table("edits")
                            .select("output_url, after_score, status")
                            .eq("id", job_id)
                            .single()
                            .execute()
                        )
                        progress_data = {
                            "status": "done",
                            "progress": 100,
                            "output_url": updated.data.get("output_url"),
                            "new_score": updated.data.get("after_score"),
                        }

                    elif job_status == "failed":
                        progress_data = {
                            "status": "failed",
                            "progress": 0,
                            "message": str(job.exc_info)[:200] if job.exc_info else "Edit failed",
                        }

                except Exception as e:
                    logger.warning(f"Error fetching job status: {e}")
                    # Fall back to DB status
                    db_edit = (
                        db.table("edits")
                        .select("status, output_url, after_score")
                        .eq("id", job_id)
                        .single()
                        .execute()
                    )
                    if db_edit.data:
                        progress_data["status"] = db_edit.data["status"]
                        if db_edit.data["status"] == "done":
                            progress_data["output_url"] = db_edit.data.get("output_url")
                            progress_data["new_score"] = db_edit.data.get("after_score")

            await websocket.send_json(progress_data)

            # Terminal states — stop polling
            if progress_data["status"] in ("done", "failed", "finished"):
                break

            await asyncio.sleep(POLL_INTERVAL)
            elapsed += POLL_INTERVAL

    except WebSocketDisconnect:
        logger.info(f"Client disconnected from job {job_id}")
    except asyncio.TimeoutError:
        await websocket.send_json({"error": "Authentication timeout"})
    except Exception as e:
        logger.error(f"WebSocket error for job {job_id}: {e}", exc_info=True)
        try:
            await websocket.send_json({"error": "Internal error"})
        except Exception:
            pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
