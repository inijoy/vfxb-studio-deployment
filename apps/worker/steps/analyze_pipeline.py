"""
Full analysis pipeline — orchestrates all steps for a video.
This is the entry point called by the worker for 'analyze' jobs.
"""
import logging
import os

from db.client import get_db
from steps.transcribe import transcribe_video
from steps.visual_analysis import analyze_visual
from steps.audio_analysis import analyze_audio
from steps.virality_score import calculate_virality_score

logger = logging.getLogger(__name__)


def _set_status(video_id: str, status: str, error: str | None = None) -> None:
    db = get_db()
    update = {"status": status}
    if error:
        update["error_message"] = error
    db.table("videos").update(update).eq("id", video_id).execute()


def run(video_id: str) -> dict:
    """
    Full analysis pipeline:
      1. Download video from R2
      2. Transcribe audio (AssemblyAI)
      3. Visual analysis (GPT-4o)
      4. Audio analysis (librosa)
      5. Virality scoring (Claude)
    """
    from rq import get_current_job
    job = get_current_job()

    def progress(pct: int, msg: str) -> None:
        logger.info(f"[{video_id}] {pct}% — {msg}")
        if job:
            job.meta["progress"] = pct
            job.meta["message"] = msg
            job.save_meta()

    db = get_db()
    try:
        # ── Load video record ─────────────────────────────────────────────
        progress(2, "Loading video metadata")
        result = db.table("videos").select("*").eq("id", video_id).single().execute()
        if not result.data:
            raise ValueError(f"Video {video_id} not found in database")

        video = result.data
        r2_key = video.get("r2_key")
        if not r2_key:
            raise ValueError(f"Video {video_id} has no R2 key")

        # ── Download from R2 to temp dir ──────────────────────────────────
        progress(5, "Downloading video from storage")
        tmp_dir = f"/tmp/vfxb/{video_id}"
        os.makedirs(tmp_dir, exist_ok=True)
        video_path = f"{tmp_dir}/original.mp4"

        from services.storage import download_file
        download_file(r2_key, video_path)

        # ── Step 1: Transcription ─────────────────────────────────────────
        _set_status(video_id, "transcribing")
        progress(10, "Transcribing audio")
        transcript_data = transcribe_video(video_path)
        db.table("videos").update(
            {"transcript": transcript_data["transcript"]}
        ).eq("id", video_id).execute()
        progress(35, "Transcription complete")

        # ── Step 2: Visual analysis ───────────────────────────────────────
        _set_status(video_id, "analyzing")
        progress(40, "Analyzing visual frames")
        visual_data = analyze_visual(video_path, tmp_dir)
        progress(60, "Visual analysis complete")

        # ── Step 3: Audio analysis ────────────────────────────────────────
        progress(65, "Analyzing audio characteristics")
        audio_data = analyze_audio(video_path)
        progress(75, "Audio analysis complete")

        # Merge analysis data
        analysis = {
            "words": transcript_data.get("words", []),
            "sentences": transcript_data.get("sentences", []),
            "fillers": transcript_data.get("fillers", []),
            "sentiment": transcript_data.get("sentiment"),
            "visual_data": visual_data,
            "audio": audio_data,
        }
        db.table("videos").update({"analysis": analysis}).eq("id", video_id).execute()

        # ── Step 4: Virality scoring ──────────────────────────────────────
        _set_status(video_id, "scoring")
        progress(80, "Calculating virality score")

        platform = video.get("platform", "youtube")
        duration = video.get("duration")
        if not duration:
            # Infer from audio analysis
            duration = audio_data.get("duration_seconds", 0)

        score_result = calculate_virality_score(
            transcript=transcript_data["transcript"],
            visual_data=visual_data,
            audio_data=audio_data,
            platform=platform,
            duration=duration,
        )

        db.table("videos").update(
            {
                "virality_score": score_result["overall_score"],
                "score_breakdown": score_result,
                "status": "analyzed",
            }
        ).eq("id", video_id).execute()

        progress(100, "Analysis complete")
        logger.info(f"[{video_id}] Analysis complete. Score: {score_result['overall_score']}")

        return {
            "video_id": video_id,
            "score": score_result["overall_score"],
            "status": "analyzed",
        }

    except Exception as e:
        logger.error(f"[{video_id}] Analysis failed: {e}", exc_info=True)
        _set_status(video_id, "error", str(e))
        raise
    finally:
        # Clean up temp directory
        import shutil
        try:
            shutil.rmtree(f"/tmp/vfxb/{video_id}", ignore_errors=True)
        except Exception:
            pass
