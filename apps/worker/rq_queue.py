"""
Queue helpers — enqueue jobs from the API process.
Import this in the API routers to enqueue work.
"""

import logging
import os

import redis as redis_lib
from rq import Queue

logger = logging.getLogger(__name__)

_conn: redis_lib.Redis | None = None


def get_connection() -> redis_lib.Redis:
    global _conn
    if _conn is None:
        _conn = redis_lib.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379"),
            decode_responses=False,
        )
    return _conn


def enqueue_analyze(video_id: str) -> str:
    """Enqueue the full analysis pipeline for a video. Returns job ID."""
    from steps.analyze_pipeline import run

    conn = get_connection()
    q = Queue("analyze", connection=conn)
    job = q.enqueue(run, video_id, job_timeout="30m")
    logger.info(f"Enqueued analyze:{job.id} for video {video_id}")
    return job.id


def enqueue_edit(edit_id: str) -> str:
    """Enqueue an FFmpeg edit job. Returns job ID."""
    from services.ffmpeg_executor import run_edit

    conn = get_connection()
    q = Queue("edit", connection=conn)
    job = q.enqueue(run_edit, edit_id, job_timeout="60m")
    logger.info(f"Enqueued edit:{job.id} for edit {edit_id}")
    return job.id


def enqueue_export(export_id: str) -> str:
    """Enqueue a platform export job. Returns job ID."""
    from services.platform_optimizer import run_export

    conn = get_connection()
    q = Queue("export", connection=conn)
    job = q.enqueue(run_export, export_id, job_timeout="60m")
    logger.info(f"Enqueued export:{job.id} for export {export_id}")
    return job.id


def get_job_status(job_id: str) -> dict:
    """Return current status and metadata for a job."""
    from rq.job import Job

    conn = get_connection()
    try:
        job = Job.fetch(job_id, connection=conn)
        result: dict = {
            "job_id": job_id,
            "status": job.get_status().value,
            "progress": job.meta.get("progress", 0),
            "message": job.meta.get("message", ""),
        }
        if job.result:
            result["result"] = job.result
        if job.exc_info:
            result["error"] = str(job.exc_info)
        return result
    except Exception:
        return {"job_id": job_id, "status": "not_found", "progress": 0}
