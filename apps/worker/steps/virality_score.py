"""
Virality scoring step via Claude 3.5 Sonnet.
Sends all analysis data and returns a structured score breakdown.
"""
import json
import logging
import os
from typing import Any

import anthropic

logger = logging.getLogger(__name__)

_anthropic = None


def _get_client() -> anthropic.Anthropic:
    global _anthropic
    if _anthropic is None:
        _anthropic = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
    return _anthropic


def _extract_anthropic_text(message: Any) -> str:
    content_blocks = getattr(message, "content", []) or []
    parts: list[str] = []
    for block in content_blocks:
        text = getattr(block, "text", None)
        if isinstance(text, str) and text:
            parts.append(text)
    return "".join(parts).strip()


SYSTEM_PROMPT = """You are VFXB Engine — an elite video performance AI trained on analyzing 100M+ videos \
across YouTube, TikTok, Instagram, and LinkedIn.

Your job is to analyze video data and return a precise, actionable virality score.
You are brutally honest, specific, and data-driven — not generic.
You always identify the EXACT timestamps of problems, not vague descriptions.
You understand platform-specific optimal patterns deeply.

ALWAYS return valid JSON only. No markdown, no explanation outside the JSON structure.
Never truncate the JSON. Never add commentary before or after the JSON."""

SCORE_PROMPT_TEMPLATE = """Analyze this video and return a virality score.

Platform: {platform}
Duration: {duration} seconds ({duration_min:.1f} minutes)
Transcript (first 3000 chars): {transcript}

Audio Analysis:
- Silence count: {silence_count} silences
- Total silence: {total_silence}s ({silence_pct:.1f}% of video)
- Dead zones: {dead_zone_count}
- BPM: {bpm}
- Background noise: {noise_db} dB

Visual Analysis:
- Face on camera: {face_pct}% of frames
- Avg motion level: {motion_level}/10
- Avg engagement potential: {engagement}/10
- Text on screen: {text_pct}% of frames
- Scene types: {scene_types}
- Best segment: {best_segment}

Return this EXACT JSON structure:
{{
  "overall_score": <integer 0-100>,
  "grade": "<A+|A|A-|B+|B|B-|C+|C|D|F>",
  "percentile": "<e.g. Top 12% in niche>",
  "summary": "<2-3 sentence honest assessment>",
  "factors": {{
    "hook_strength": {{
      "score": <0-100>,
      "severity": "<critical|warning|good|excellent>",
      "timestamp": "<e.g. 0:00-0:05>",
      "issue": "<specific problem or what's working>",
      "fix": "<concrete actionable fix>"
    }},
    "pacing": {{
      "score": <0-100>,
      "severity": "<critical|warning|good|excellent>",
      "timestamp": "<worst section timestamp>",
      "issue": "<specific pacing problem>",
      "fix": "<exact fix>"
    }},
    "audio_quality": {{
      "score": <0-100>,
      "severity": "<critical|warning|good|excellent>",
      "timestamp": "N/A",
      "issue": "<audio issue or strength>",
      "fix": "<fix if needed>"
    }},
    "visual_quality": {{
      "score": <0-100>,
      "severity": "<critical|warning|good|excellent>",
      "timestamp": "N/A",
      "issue": "<visual issue>",
      "fix": "<fix if needed>"
    }},
    "retention_risk": {{
      "score": <0-100>,
      "severity": "<critical|warning|good|excellent>",
      "timestamp": "<highest risk timestamp>",
      "issue": "<why viewers will leave>",
      "fix": "<how to keep them>"
    }},
    "cta_strength": {{
      "score": <0-100>,
      "severity": "<critical|warning|good|excellent>",
      "timestamp": "<CTA timestamp or N/A>",
      "issue": "<CTA problem or strength>",
      "fix": "<improvement>"
    }}
  }},
  "top_issues": [
    {{
      "priority": 1,
      "title": "<short title>",
      "description": "<what is wrong, be specific>",
      "impact": "<e.g. costs you ~30% of viewers at the 2-min mark>",
      "fix": "<exactly what to do>"
    }},
    {{
      "priority": 2,
      "title": "<short title>",
      "description": "<specific problem>",
      "impact": "<quantified impact>",
      "fix": "<exact fix>"
    }},
    {{
      "priority": 3,
      "title": "<short title>",
      "description": "<specific problem>",
      "impact": "<quantified impact>",
      "fix": "<exact fix>"
    }}
  ],
  "predicted_retention_curve": [
    {{"timestamp_pct": 0, "retention_pct": 100, "reason": "start"}},
    {{"timestamp_pct": 10, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 20, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 30, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 40, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 50, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 60, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 70, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 80, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 90, "retention_pct": <int>, "reason": "<why>"}},
    {{"timestamp_pct": 100, "retention_pct": <int>, "reason": "end"}}
  ]
}}"""


def _build_visual_summary(visual_data: dict) -> tuple:
    """Extract key metrics from visual analysis for the prompt."""
    face_pct = visual_data.get("face_camera_pct", 0)
    motion = visual_data.get("avg_motion_level", 5)
    engagement = visual_data.get("avg_engagement_potential", 5)
    text_pct = visual_data.get("text_on_screen_pct", 0)
    scene_types = visual_data.get("scene_types", {})
    best_segment = visual_data.get("best_segment")
    return face_pct, motion, engagement, text_pct, scene_types, best_segment


def calculate_virality_score(
    transcript: str,
    visual_data: dict,
    audio_data: dict,
    platform: str,
    duration: int | float,
) -> dict:
    """
    Send all analysis data to Claude 3.5 Sonnet and return structured score.
    """
    client = _get_client()

    face_pct, motion, engagement, text_pct, scene_types, best_segment = _build_visual_summary(
        visual_data
    )

    silence_count = audio_data.get("silence_count", 0)
    total_silence = audio_data.get("total_silence_seconds", 0)
    silence_pct = (total_silence / duration * 100) if duration > 0 else 0
    dead_zone_count = len(audio_data.get("dead_zones", []))
    bpm = audio_data.get("bpm", "unknown")
    noise_db = audio_data.get("background_noise_db", 0)

    prompt = SCORE_PROMPT_TEMPLATE.format(
        platform=platform,
        duration=int(duration),
        duration_min=duration / 60,
        transcript=transcript[:3000],
        silence_count=silence_count,
        total_silence=round(total_silence, 1),
        silence_pct=round(silence_pct, 1),
        dead_zone_count=dead_zone_count,
        bpm=bpm,
        noise_db=noise_db,
        face_pct=round(face_pct, 1),
        motion_level=round(motion, 1),
        engagement=round(engagement, 1),
        text_pct=round(text_pct, 1),
        scene_types=json.dumps(scene_types),
        best_segment=json.dumps(best_segment),
    )

    logger.info("Requesting virality score from Claude")

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = _extract_anthropic_text(message)

    # Handle markdown code fences if Claude wraps in them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response: {e}\nRaw: {raw[:500]}")
        # Return a safe fallback structure
        result = {
            "overall_score": 50,
            "grade": "C",
            "percentile": "Average",
            "summary": "Analysis could not be completed. Please retry.",
            "factors": {},
            "top_issues": [],
            "predicted_retention_curve": [
                {"timestamp_pct": i * 10, "retention_pct": max(40, 100 - i * 6), "reason": ""}
                for i in range(11)
            ],
        }

    # Validate score range
    result["overall_score"] = max(0, min(100, int(result.get("overall_score", 50))))

    return result
