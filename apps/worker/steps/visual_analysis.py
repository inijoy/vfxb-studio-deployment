"""
Visual analysis step.
Extracts frames at 1fps, samples every 5th, sends to GPT-4o Vision.
"""
import base64
import logging
import os
from pathlib import Path

import ffmpeg
from openai import OpenAI

logger = logging.getLogger(__name__)

_openai = None


def _get_openai() -> OpenAI:
    global _openai
    if _openai is None:
        _openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
    return _openai


FRAME_ANALYSIS_PROMPT = """
Analyze this video frame and return ONLY valid JSON (no markdown, no explanation):
{
  "has_face": true/false,
  "face_position": "center" | "left" | "right" | "none",
  "face_count": 0–10,
  "motion_level": 0–10,
  "text_on_screen": true/false,
  "scene_description": "brief one-line description",
  "engagement_potential": 0–10,
  "lighting_quality": "poor" | "fair" | "good" | "excellent",
  "is_transition": true/false,
  "scene_type": "talking_head" | "b_roll" | "screen_share" | "title_card" | "other"
}
"""


def _encode_image(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def _analyze_frame(image_path: str) -> dict:
    """Send a single frame to GPT-4o Vision and return structured analysis."""
    client = _get_openai()
    b64 = _encode_image(image_path)

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64}",
                                "detail": "low",  # lower cost for batch analysis
                            },
                        },
                        {"type": "text", "text": FRAME_ANALYSIS_PROMPT},
                    ],
                }
            ],
        )
        import json
        content = response.choices[0].message.content
        return json.loads(content or "{}")
    except Exception as e:
        logger.warning(f"Frame analysis failed for {image_path}: {e}")
        return {
            "has_face": False,
            "face_position": "none",
            "motion_level": 5,
            "text_on_screen": False,
            "scene_description": "unknown",
            "engagement_potential": 5,
            "lighting_quality": "fair",
            "is_transition": False,
            "scene_type": "other",
        }


def analyze_visual(video_path: str, tmp_dir: str) -> dict:
    """
    1. Extract 1 frame per second using FFmpeg
    2. Sample every 5th frame (20% analysis for cost control)
    3. Analyze each sampled frame with GPT-4o
    4. Aggregate and return summary
    """
    frames_dir = Path(tmp_dir) / "frames"
    frames_dir.mkdir(exist_ok=True)

    # Extract frames at 1fps
    logger.info(f"Extracting frames from {video_path}")
    try:
        (
            ffmpeg
            .input(video_path)
            .filter("fps", fps=1)
            .output(str(frames_dir / "frame_%04d.jpg"), **{"qscale:v": 2})
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True, quiet=True)
        )
    except ffmpeg.Error as e:
        logger.error(f"FFmpeg frame extraction failed: {e.stderr.decode()}")
        return {"error": "frame_extraction_failed", "frames_analyzed": 0}

    frame_files = sorted(frames_dir.glob("frame_*.jpg"))
    total_frames = len(frame_files)
    logger.info(f"Extracted {total_frames} frames")

    if total_frames == 0:
        return {"error": "no_frames_extracted", "frames_analyzed": 0}

    # Sample every 5th frame
    sampled_frames = frame_files[::5]
    logger.info(f"Analyzing {len(sampled_frames)} sampled frames")

    frame_results = []
    for i, frame_path in enumerate(sampled_frames):
        result = _analyze_frame(str(frame_path))
        result["timestamp_seconds"] = (i * 5)  # approximate
        frame_results.append(result)

    if not frame_results:
        return {"frames_analyzed": 0}

    # ── Aggregate results ─────────────────────────────────────────────────────
    has_face_pct = sum(1 for r in frame_results if r["has_face"]) / len(frame_results) * 100
    avg_motion = sum(r["motion_level"] for r in frame_results) / len(frame_results)
    avg_engagement = sum(r["engagement_potential"] for r in frame_results) / len(frame_results)
    text_on_screen_pct = sum(1 for r in frame_results if r["text_on_screen"]) / len(frame_results) * 100

    scene_types: dict[str, int] = {}
    for r in frame_results:
        st = r.get("scene_type", "other")
        scene_types[st] = scene_types.get(st, 0) + 1

    # Detect talking_head percentage
    talking_head_count = scene_types.get("talking_head", 0)
    face_camera_pct = talking_head_count / len(frame_results) * 100

    # Find highest-engagement window (for extract_best_clip)
    if len(frame_results) >= 5:
        window_size = min(5, len(frame_results))
        best_window_start = 0
        best_window_score = 0
        for i in range(len(frame_results) - window_size + 1):
            window = frame_results[i:i + window_size]
            score = sum(r["engagement_potential"] for r in window)
            if score > best_window_score:
                best_window_score = score
                best_window_start = i
        best_segment = {
            "start_second": best_window_start * 5,
            "end_second": (best_window_start + window_size) * 5,
            "engagement_score": round(best_window_score / window_size, 1),
        }
    else:
        best_segment = None

    return {
        "total_frames": total_frames,
        "frames_analyzed": len(frame_results),
        "has_face_pct": round(has_face_pct, 1),
        "avg_motion_level": round(avg_motion, 1),
        "avg_engagement_potential": round(avg_engagement, 1),
        "text_on_screen_pct": round(text_on_screen_pct, 1),
        "face_camera_pct": round(face_camera_pct, 1),
        "scene_types": scene_types,
        "best_segment": best_segment,
        "frames": frame_results,
    }
