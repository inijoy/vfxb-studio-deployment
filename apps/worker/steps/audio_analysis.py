"""
Audio analysis step using librosa.
Detects silences, dead zones, BPM, and audio energy characteristics.
"""
import logging
import os
import subprocess
import tempfile
from pathlib import Path

import librosa
import numpy as np

logger = logging.getLogger(__name__)

# Thresholds
SILENCE_DB_THRESHOLD = -40     # dB below which we consider silence
MIN_SILENCE_DURATION = 1.5     # seconds — shorter gaps are not "silences"
DEAD_ZONE_DB_THRESHOLD = -25   # broader threshold for "low energy" segments
HOP_LENGTH = 512


def _extract_audio(video_path: str, audio_path: str) -> bool:
    """Extract audio track from video to a WAV file using FFmpeg."""
    try:
        result = subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", video_path,
                "-vn",                  # no video
                "-ar", "22050",         # 22kHz sample rate (faster librosa load)
                "-ac", "1",             # mono
                "-f", "wav",
                audio_path,
            ],
            capture_output=True,
            check=True,
            timeout=120,
        )
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Audio extraction failed: {e.stderr.decode()}")
        return False
    except subprocess.TimeoutExpired:
        logger.error("Audio extraction timed out")
        return False


def analyze_audio(video_path: str) -> dict:
    """
    Analyze audio characteristics:
      - Silence gaps (timestamps + durations)
      - Dead zones (low-energy segments)
      - Average energy
      - Background noise level
      - BPM estimate (if music present)
      - Total duration
    """
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        audio_path = f.name

    try:
        if not _extract_audio(video_path, audio_path):
            return {"error": "audio_extraction_failed"}

        logger.info(f"Loading audio from {audio_path}")
        y, sr = librosa.load(audio_path, sr=None, mono=True)
        duration = librosa.get_duration(y=y, sr=sr)

        # ── RMS energy per frame ───────────────────────────────────────────
        rms = librosa.feature.rms(y=y, hop_length=HOP_LENGTH)[0]
        times = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=HOP_LENGTH)

        rms_db = librosa.amplitude_to_db(rms, ref=np.max)
        avg_energy_db = float(np.mean(rms_db))

        # ── Detect silence gaps ────────────────────────────────────────────
        silences = []
        in_silence = False
        silence_start = 0.0

        for i, (t, level) in enumerate(zip(times, rms_db)):
            if level < SILENCE_DB_THRESHOLD and not in_silence:
                in_silence = True
                silence_start = float(t)
            elif level >= SILENCE_DB_THRESHOLD and in_silence:
                in_silence = False
                gap_dur = float(t) - silence_start
                if gap_dur >= MIN_SILENCE_DURATION:
                    silences.append(
                        {
                            "start": round(silence_start, 2),
                            "end": round(float(t), 2),
                            "duration": round(gap_dur, 2),
                        }
                    )

        # Close any trailing silence
        if in_silence:
            gap_dur = duration - silence_start
            if gap_dur >= MIN_SILENCE_DURATION:
                silences.append(
                    {
                        "start": round(silence_start, 2),
                        "end": round(duration, 2),
                        "duration": round(gap_dur, 2),
                    }
                )

        # ── Detect "dead zones" (broad low energy) ─────────────────────────
        dead_zones = []
        in_dead = False
        dead_start = 0.0
        DEAD_ZONE_MIN_DURATION = 3.0

        for t, level in zip(times, rms_db):
            if level < DEAD_ZONE_DB_THRESHOLD and not in_dead:
                in_dead = True
                dead_start = float(t)
            elif level >= DEAD_ZONE_DB_THRESHOLD and in_dead:
                in_dead = False
                dz_dur = float(t) - dead_start
                if dz_dur >= DEAD_ZONE_MIN_DURATION:
                    dead_zones.append(
                        {
                            "start": round(dead_start, 2),
                            "end": round(float(t), 2),
                            "duration": round(dz_dur, 2),
                        }
                    )

        # ── BPM estimation ─────────────────────────────────────────────────
        bpm = None
        try:
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            bpm = round(float(np.mean(tempo)), 1) if tempo is not None else None
        except Exception:
            pass

        # ── Background noise level ─────────────────────────────────────────
        # Estimate from the quietest 10% of frames
        sorted_rms = np.sort(rms_db)
        noise_floor_db = float(np.mean(sorted_rms[: max(1, len(sorted_rms) // 10)]))

        total_silence_duration = sum(s["duration"] for s in silences)

        return {
            "duration_seconds": round(duration, 2),
            "silences": silences,
            "silence_count": len(silences),
            "total_silence_seconds": round(total_silence_duration, 2),
            "dead_zones": dead_zones,
            "avg_energy_db": round(avg_energy_db, 2),
            "background_noise_db": round(noise_floor_db, 2),
            "bpm": bpm,
            "sample_rate": int(sr),
        }

    except Exception as e:
        logger.error(f"Audio analysis failed: {e}", exc_info=True)
        return {"error": str(e)}

    finally:
        try:
            os.unlink(audio_path)
        except OSError:
            pass
