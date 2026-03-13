"""
Platform optimizer utilities used for platform-specific export presets.
This module is intentionally lightweight so worker jobs can compose behavior.
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

PLATFORM_TARGETS: dict[str, dict[str, int | str]] = {
    "tiktok": {"width": 1080, "height": 1920, "fps": 30, "bitrate": "4M", "audio_bitrate": "128k"},
    "youtube": {"width": 1920, "height": 1080, "fps": 30, "bitrate": "8M", "audio_bitrate": "192k"},
    "instagram": {"width": 1080, "height": 1080, "fps": 30, "bitrate": "4M", "audio_bitrate": "128k"},
    "shorts": {"width": 1080, "height": 1920, "fps": 60, "bitrate": "6M", "audio_bitrate": "160k"},
    "linkedin": {"width": 1920, "height": 1080, "fps": 30, "bitrate": "4M", "audio_bitrate": "128k"},
    "twitter": {"width": 1280, "height": 720, "fps": 30, "bitrate": "3M", "audio_bitrate": "128k"},
    "facebook": {"width": 1280, "height": 720, "fps": 30, "bitrate": "4M", "audio_bitrate": "128k"},
}


def get_platform_target(platform: str) -> dict[str, int | str]:
    return PLATFORM_TARGETS.get(platform, PLATFORM_TARGETS["youtube"])


def build_platform_scale_filter(platform: str) -> str:
    target = get_platform_target(platform)
    width = int(target["width"])
    height = int(target["height"])
    return (
        f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2"
    )


def run_export(export_id: str) -> dict:
    """
    RQ export job entrypoint.
    Placeholder implementation until full export DB flow is wired.
    """
    logger.info("Export job requested for %s", export_id)
    return {"export_id": export_id, "status": "queued"}
