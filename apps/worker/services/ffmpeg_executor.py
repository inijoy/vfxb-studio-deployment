"""
FFmpeg Executor — applies structured edit plans to videos.
Each function: downloads from R2 → runs FFmpeg → uploads output to R2.
"""
import json
import logging
import os
import re
import shutil
import subprocess
import tempfile
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

PLATFORM_SPECS = {
    "tiktok":    {"w": 1080, "h": 1920, "fps": 30, "br": "4M"},
    "youtube":   {"w": 1920, "h": 1080, "fps": 30, "br": "8M"},
    "instagram": {"w": 1080, "h": 1080, "fps": 30, "br": "4M"},
    "shorts":    {"w": 1080, "h": 1920, "fps": 60, "br": "6M"},
    "linkedin":  {"w": 1920, "h": 1080, "fps": 30, "br": "4M"},
    "twitter":   {"w": 1280, "h": 720,  "fps": 30, "br": "3M"},
    "facebook":  {"w": 1280, "h": 720,  "fps": 30, "br": "4M"},
}

COLOR_PRESETS = {
    "cinematic": "curves=vintage,hue=s=0.8",
    "warm":      "colortemperature=warmth=0.3",
    "cold":      "colortemperature=warmth=-0.3",
    "bw":        "hue=s=0",
    "vivid":     "eq=saturation=1.4:contrast=1.1",
}


def _sanitize_path(path: str) -> str:
    """Ensure the path is safe — no shell metacharacters."""
    if re.search(r"[;&|`$<>]", path):
        raise ValueError(f"Unsafe path characters detected: {path}")
    return path


def _run_ffmpeg(args: list[str], timeout: int = 3600) -> None:
    """Run an FFmpeg command. Raises RuntimeError on failure."""
    safe_args = [_sanitize_path(arg) if i > 0 and os.path.sep in arg else arg
                 for i, arg in enumerate(args)]

    logger.info(f"FFmpeg: {' '.join(safe_args[:8])} ...")
    result = subprocess.run(
        safe_args,
        capture_output=True,
        timeout=timeout,
    )
    if result.returncode != 0:
        stderr = result.stderr.decode("utf-8", errors="replace")[-1000:]
        raise RuntimeError(f"FFmpeg failed (exit {result.returncode}): {stderr}")


def cut_silence(input_path: str, output_path: str, silence_timestamps: list[dict]) -> None:
    """
    Remove silence gaps from a video using FFmpeg trim + concat.
    silence_timestamps: [{"start": float, "end": float}, ...]
    """
    if not silence_timestamps:
        shutil.copy2(input_path, output_path)
        return

    # Build list of segments to KEEP (inverse of silences)
    all_silences = sorted(silence_timestamps, key=lambda x: x["start"])

    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as cf:
        concat_file = cf.name

    tmp_dir = os.path.dirname(output_path)
    segment_files = []

    try:
        current_time = 0.0
        seg_idx = 0

        for silence in all_silences:
            seg_start = current_time
            seg_end = silence["start"]

            if seg_end > seg_start + 0.1:  # skip hairline segments
                seg_path = os.path.join(tmp_dir, f"seg_{seg_idx:04d}.mp4")
                _run_ffmpeg([
                    "ffmpeg", "-y",
                    "-ss", str(seg_start),
                    "-to", str(seg_end),
                    "-i", input_path,
                    "-c", "copy",
                    "-avoid_negative_ts", "1",
                    seg_path,
                ])
                segment_files.append(seg_path)
                seg_idx += 1

            current_time = silence["end"]

        # Handle tail segment after last silence
        seg_path = os.path.join(tmp_dir, f"seg_{seg_idx:04d}.mp4")
        _run_ffmpeg([
            "ffmpeg", "-y",
            "-ss", str(current_time),
            "-i", input_path,
            "-c", "copy",
            seg_path,
        ])
        if os.path.getsize(seg_path) > 1000:
            segment_files.append(seg_path)

        if not segment_files:
            shutil.copy2(input_path, output_path)
            return

        # Write concat manifest
        with open(concat_file, "w") as f:
            for seg in segment_files:
                f.write(f"file '{seg}'\n")

        _run_ffmpeg([
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", concat_file,
            "-c", "copy",
            output_path,
        ])

    finally:
        os.unlink(concat_file)
        for seg in segment_files:
            try:
                os.unlink(seg)
            except OSError:
                pass


def trim_range(input_path: str, output_path: str, start: float, end: float) -> None:
    """Remove a time range [start, end] from the video."""
    duration = _get_duration(input_path)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as cf:
        concat_file = cf.name

    tmp_dir = os.path.dirname(output_path)
    seg_before = os.path.join(tmp_dir, "trim_before.mp4")
    seg_after = os.path.join(tmp_dir, "trim_after.mp4")

    try:
        _run_ffmpeg([
            "ffmpeg", "-y",
            "-ss", "0", "-to", str(start),
            "-i", input_path,
            "-c", "copy", seg_before,
        ])

        _run_ffmpeg([
            "ffmpeg", "-y",
            "-ss", str(end),
            "-i", input_path,
            "-c", "copy", seg_after,
        ])

        with open(concat_file, "w") as f:
            if os.path.getsize(seg_before) > 1000:
                f.write(f"file '{seg_before}'\n")
            if os.path.getsize(seg_after) > 1000:
                f.write(f"file '{seg_after}'\n")

        _run_ffmpeg([
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", concat_file,
            "-c", "copy",
            output_path,
        ])

    finally:
        os.unlink(concat_file)
        for p in (seg_before, seg_after):
            try:
                os.unlink(p)
            except OSError:
                pass


def change_speed(
    input_path: str, output_path: str, start: float, end: float, factor: float
) -> None:
    """Speed up or slow down a segment. factor > 1 = faster, factor < 1 = slower."""
    factor = max(0.25, min(4.0, factor))  # clamp to safe range
    duration = _get_duration(input_path)

    # Clamp audio atempo to 0.5–2.0 (chain filters for extreme values)
    def atempo_chain(f: float) -> str:
        filters = []
        while f > 2.0:
            filters.append("atempo=2.0")
            f /= 2.0
        while f < 0.5:
            filters.append("atempo=0.5")
            f /= 0.5
        filters.append(f"atempo={f:.3f}")
        return ",".join(filters)

    tmp_dir = os.path.dirname(output_path)
    before = os.path.join(tmp_dir, "speed_before.mp4")
    segment = os.path.join(tmp_dir, "speed_segment.mp4")
    after = os.path.join(tmp_dir, "speed_after.mp4")
    concat_file = os.path.join(tmp_dir, "speed_concat.txt")

    try:
        if start > 0:
            _run_ffmpeg(["ffmpeg", "-y", "-ss", "0", "-to", str(start), "-i", input_path, "-c", "copy", before])

        _run_ffmpeg([
            "ffmpeg", "-y",
            "-ss", str(start), "-to", str(end),
            "-i", input_path,
            "-filter_complex",
            f"[0:v]setpts={1/factor:.4f}*PTS[v];[0:a]{atempo_chain(factor)}[a]",
            "-map", "[v]", "-map", "[a]",
            segment,
        ])

        if end < duration:
            _run_ffmpeg(["ffmpeg", "-y", "-ss", str(end), "-i", input_path, "-c", "copy", after])

        with open(concat_file, "w") as f:
            for p, label in [(before, "before"), (segment, "segment"), (after, "after")]:
                if os.path.exists(p) and os.path.getsize(p) > 1000:
                    f.write(f"file '{p}'\n")

        _run_ffmpeg([
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", concat_file, "-c", "copy", output_path,
        ])

    finally:
        for p in (before, segment, after, concat_file):
            try:
                os.unlink(p)
            except OSError:
                pass


def add_captions(input_path: str, output_path: str, srt_content: str, style: str = "youtube") -> None:
    """Burn subtitles into video from SRT content string."""
    tmp_dir = os.path.dirname(output_path)
    srt_path = os.path.join(tmp_dir, "captions.srt")

    styles = {
        "tiktok": "FontSize=20,FontName=Impact,PrimaryColour=&HFFFFFF,Bold=1,Outline=2,Shadow=1,MarginV=40",
        "youtube": "FontSize=14,FontName=Arial,PrimaryColour=&HFFFFFF,BackColour=&H80000000,MarginV=20",
        "minimal": "FontSize=12,FontName=Helvetica,PrimaryColour=&HFFFFFF,MarginV=15",
    }
    force_style = styles.get(style, styles["youtube"])

    with open(srt_path, "w", encoding="utf-8") as f:
        f.write(srt_content)

    try:
        _run_ffmpeg([
            "ffmpeg", "-y",
            "-i", input_path,
            "-vf", f"subtitles='{srt_path}':force_style='{force_style}'",
            "-c:a", "copy",
            output_path,
        ])
    finally:
        try:
            os.unlink(srt_path)
        except OSError:
            pass


def platform_export(input_path: str, output_path: str, platform: str) -> None:
    """Reformat video for a specific platform."""
    spec = PLATFORM_SPECS.get(platform, PLATFORM_SPECS["youtube"])
    w, h, fps, br = spec["w"], spec["h"], spec["fps"], spec["br"]

    _run_ffmpeg([
        "ffmpeg", "-y",
        "-i", input_path,
        "-vf", f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
               f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={fps}",
        "-c:v", "libx264",
        "-preset", "medium",
        "-b:v", br,
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        output_path,
    ])


def color_grade(input_path: str, output_path: str, preset: str = "cinematic") -> None:
    """Apply a color filter preset."""
    vf = COLOR_PRESETS.get(preset, COLOR_PRESETS["cinematic"])
    _run_ffmpeg([
        "ffmpeg", "-y",
        "-i", input_path,
        "-vf", vf,
        "-c:a", "copy",
        output_path,
    ])


def extract_best_clip(
    input_path: str, output_path: str, duration_seconds: int, best_segment: dict | None = None
) -> None:
    """Extract the highest-engagement clip of requested duration."""
    if best_segment:
        seg_start = best_segment.get("start_second", 0)
        # Center the requested duration within the best segment
        seg_mid = (best_segment.get("start_second", 0) + best_segment.get("end_second", duration_seconds)) / 2
        extract_start = max(0, seg_mid - duration_seconds / 2)
    else:
        extract_start = 0

    _run_ffmpeg([
        "ffmpeg", "-y",
        "-ss", str(extract_start),
        "-t", str(duration_seconds),
        "-i", input_path,
        "-c", "copy",
        output_path,
    ])


def _get_duration(video_path: str) -> float:
    """Get video duration in seconds using FFprobe."""
    result = subprocess.run(
        [
            "ffprobe", "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            video_path,
        ],
        capture_output=True,
    )
    data = json.loads(result.stdout)
    return float(data.get("format", {}).get("duration", 0))


# ── Main job entry point ──────────────────────────────────────────────────────

def run_edit(edit_id: str) -> dict:
    """
    RQ job entry point.
    Loads the edit record, executes the FFmpeg edit plan,
    uploads result to R2, updates the edit + video records.
    """
    from rq import get_current_job
    from db.client import get_db
    from services.storage import download_file, upload_file, get_public_url, make_export_key, BUCKET_EXPORTS

    job = get_current_job()

    def progress(pct: int, msg: str) -> None:
        logger.info(f"[edit:{edit_id}] {pct}% — {msg}")
        if job:
            job.meta["progress"] = pct
            job.meta["message"] = msg
            job.save_meta()

    db = get_db()
    tmp_dir = f"/tmp/vfxb/edit_{edit_id}"
    os.makedirs(tmp_dir, exist_ok=True)
    video_id: str | None = None

    try:
        # Load edit record
        progress(2, "Loading edit plan")
        edit_result = db.table("edits").select("*").eq("id", edit_id).single().execute()
        if not edit_result.data:
            raise ValueError(f"Edit {edit_id} not found")

        edit = edit_result.data
        video_id = str(edit["video_id"])
        user_id = str(edit["user_id"])
        params = edit.get("params") or {}
        edits_list = params.get("edits", [])

        # Load video
        video_result = db.table("videos").select("*").eq("id", video_id).single().execute()
        if not video_result.data:
            raise ValueError(f"Video {video_id} not found")

        video = video_result.data
        before_score = video.get("virality_score", 0)
        r2_key = video.get("r2_key")
        if not r2_key:
            raise ValueError("Video has no R2 key")

        # Mark edit as processing
        db.table("edits").update({"status": "processing", "before_score": before_score}).eq("id", edit_id).execute()
        db.table("videos").update({"status": "editing"}).eq("id", video_id).execute()

        # Download source from R2
        progress(10, "Downloading source video")
        source_path = f"{tmp_dir}/source.mp4"
        download_file(r2_key, source_path)

        current_path = source_path

        # Apply each edit in sequence
        total_edits = len(edits_list)
        for i, edit_item in enumerate(edits_list):
            edit_type = edit_item.get("type")
            edit_params = edit_item.get("params", {})
            out_path = f"{tmp_dir}/step_{i:02d}.mp4"

            progress(
                20 + int((i / max(total_edits, 1)) * 60),
                f"Applying: {edit_item.get('description', edit_type)}",
            )

            if edit_type == "cut_silence":
                cut_silence(current_path, out_path, edit_params.get("timestamps", []))

            elif edit_type == "trim_range":
                trim_range(current_path, out_path, edit_params["start"], edit_params["end"])

            elif edit_type == "change_speed":
                change_speed(
                    current_path, out_path,
                    edit_params["start"], edit_params["end"], edit_params["factor"]
                )

            elif edit_type == "add_captions":
                srt = edit_params.get("srt_content", "")
                add_captions(current_path, out_path, srt, edit_params.get("style", "youtube"))

            elif edit_type == "platform_export":
                platform_export(current_path, out_path, edit_params["platform"])

            elif edit_type == "color_grade":
                color_grade(current_path, out_path, edit_params.get("preset", "cinematic"))

            elif edit_type == "extract_clip":
                extract_best_clip(
                    current_path, out_path,
                    edit_params.get("duration_seconds", 60),
                    video.get("analysis", {}).get("visual_data", {}).get("best_segment"),
                )

            else:
                logger.warning(f"Unknown edit type '{edit_type}' — skipping")
                shutil.copy2(current_path, out_path)

            current_path = out_path

        # Upload result to R2
        progress(85, "Uploading edited video")
        output_key = make_export_key(user_id, video_id, "edited", "mp4")
        output_url = upload_file(current_path, output_key, bucket=BUCKET_EXPORTS)

        # Estimate new score (simplified heuristic until re-analysis runs)
        total_improvement = sum(
            e.get("estimated_score_improvement", 0) for e in edits_list
        )
        after_score = min(100, before_score + total_improvement)

        # Update records
        progress(95, "Saving results")
        db.table("edits").update(
            {
                "status": "done",
                "output_url": output_url,
                "output_r2_key": output_key,
                "after_score": after_score,
            }
        ).eq("id", edit_id).execute()

        db.table("videos").update(
            {
                "processed_url": output_url,
                "virality_score": after_score,
                "status": "done",
            }
        ).eq("id", video_id).execute()

        progress(100, "Edit complete")
        logger.info(f"[edit:{edit_id}] Done. Score: {before_score} → {after_score}")

        return {"edit_id": edit_id, "output_url": output_url, "new_score": after_score}

    except Exception as e:
        logger.error(f"[edit:{edit_id}] Failed: {e}", exc_info=True)
        db = get_db()
        db.table("edits").update({"status": "failed"}).eq("id", edit_id).execute()
        if video_id:
            db.table("videos").update({"status": "error"}).eq("id", video_id).execute()
        raise

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
