"""
NLP Intent Parser — the heart of the VFXB edit engine.
Takes a user message + video context, returns a structured edit plan via Claude.
"""
import json
import logging
import os
from typing import Any

import anthropic

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - handled at runtime when Gemini is requested
    genai = None

logger = logging.getLogger(__name__)

_anthropic = None
_gemini_model = None


def _get_client() -> anthropic.Anthropic:
    global _anthropic
    if _anthropic is None:
        _anthropic = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
    return _anthropic


def _get_gemini_model():
    global _gemini_model
    if _gemini_model is None:
        api_key = os.getenv("GOOGLE_AI_API_KEY", "")
        if not api_key:
            raise ValueError("GOOGLE_AI_API_KEY is not set")
        if genai is None:
            raise ValueError("google-generativeai is not installed")
        configure = getattr(genai, "configure", None)
        model_cls = getattr(genai, "GenerativeModel", None)
        if not callable(configure) or model_cls is None:
            raise ValueError("google-generativeai package does not expose required APIs")
        configure(api_key=api_key)
        _gemini_model = model_cls("gemini-1.5-flash")
    return _gemini_model


def _extract_anthropic_text(response: Any) -> str:
    content_blocks = getattr(response, "content", []) or []
    parts: list[str] = []
    for block in content_blocks:
        text = getattr(block, "text", None)
        if isinstance(text, str) and text:
            parts.append(text)
    return "".join(parts).strip()


SYSTEM_PROMPT = """You are VFXB Engine — the world's most advanced AI video editor.
You edit full-length videos through natural language conversation.
You always understand the user's intent even when it's vague or conversational.

You have access to:
- Full transcript with timestamps
- Audio analysis (silence gaps, dead zones, energy)
- Visual analysis (motion, faces, engagement)  
- Current virality score and breakdown
- Edit history

When the user asks you to edit something, respond with a structured edit plan.
When the user asks questions, answer them based on the video data.
When the user wants to chat, engage naturally but always bring insight.

CRITICAL RULES:
1. ALWAYS return valid JSON. Never return plain text.
2. Be specific with timestamps — never say "around the beginning".
3. Estimate and state the score improvement from each edit.
4. Only include edits you can actually execute with FFmpeg.
5. If the user's request is ambiguous, ask one clarifying question.
6. Never hallucinate timestamps — only use data from the video context.

Available edit types:
- cut_silence: remove silence gaps (params: min_silence_duration, timestamps[])
- trim_range: remove a time range (params: start, end, reason)
- change_speed: speed up/slow down section (params: start, end, factor)
- add_captions: burn subtitles (params: style: "tiktok"|"youtube"|"minimal")
- color_grade: apply color filter (params: preset: "cinematic"|"warm"|"cold"|"bw"|"vivid")
- platform_export: reformat for platform (params: platform)
- extract_clip: extract best N seconds (params: duration_seconds, start?, end?)
- audio_replace: add/replace background audio (params: track_url, volume)

JSON response format:
{
  "understood_intent": "brief description of what you understood",
  "edits": [
    {
      "type": "edit_type",
      "params": { ... },
      "description": "human-readable description of this specific edit",
      "estimated_score_improvement": 0-20
    }
  ],
  "response_message": "Your conversational reply to the user — explain what you found and what you will do. Be specific about timestamps and numbers.",
  "needs_confirmation": true/false,
  "is_question": false,
  "question_response": null
}

If the user is asking a question (not requesting an edit), return:
{
  "understood_intent": "user question",
  "edits": [],
  "response_message": "Your answer to their question based on the video data",
  "needs_confirmation": false,
  "is_question": true,
  "question_response": "detailed answer"
}"""


def _build_video_context(video: dict) -> dict:
    """Build a compact video context object for the prompt."""
    analysis = video.get("analysis") or {}
    score_breakdown = video.get("score_breakdown") or {}

    audio = analysis.get("audio") or {}
    visual = analysis.get("visual_data") or {}

    silences = audio.get("silences", [])
    total_silence = audio.get("total_silence_seconds", 0)

    top_issues = score_breakdown.get("top_issues", [])
    factors = score_breakdown.get("factors", {})

    return {
        "video_id": video.get("id"),
        "duration": video.get("duration", 0),
        "platform": video.get("platform", "youtube"),
        "current_score": video.get("virality_score"),
        "score_grade": score_breakdown.get("grade"),
        "transcript_summary": (video.get("transcript") or "")[:3000],
        "silences": silences[:20],  # max 20 for prompt length
        "silence_count": len(silences),
        "total_silence_seconds": total_silence,
        "dead_zones": audio.get("dead_zones", [])[:10],
        "avg_energy_db": audio.get("avg_energy_db"),
        "face_camera_pct": visual.get("face_camera_pct"),
        "avg_motion_level": visual.get("avg_motion_level"),
        "best_segment": visual.get("best_segment"),
        "top_issues": top_issues,
        "pacing_factor": factors.get("pacing", {}),
        "hook_factor": factors.get("hook_strength", {}),
    }


def parse_edit_intent(
    user_message: str,
    video: dict,
    conversation_history: list[dict],
    creator_dna: object | None = None,
    agent: str = "vfxb",
) -> dict:
    """
    Parse user message into a structured edit plan.
    Returns the parsed plan dict from Claude.
    """
    video_context = _build_video_context(video)

    # Build conversation history for Claude
    messages = []
    for msg in conversation_history[-10:]:  # last 10 messages
        messages.append(
            {
                "role": msg["role"],
                "content": msg["content"],
            }
        )

    # Build the current user message with context
    context_header = f"""
VIDEO CONTEXT:
{json.dumps(video_context, indent=2)}
"""

    if creator_dna:
        context_header += f"""
CREATOR DNA (apply this creator's style):
{json.dumps(creator_dna, indent=2)}
"""

    full_message = f"{context_header}\n\nUSER MESSAGE: {user_message}"
    messages.append({"role": "user", "content": full_message})

    logger.info(f"Parsing edit intent for video {video.get('id')} with agent={agent}: '{user_message[:100]}'")

    use_gemini = agent == "gemini"
    if not use_gemini:
        # Fallback to Gemini when Anthropic key is unavailable.
        use_gemini = not bool(os.getenv("ANTHROPIC_API_KEY", "").strip()) and bool(
            os.getenv("GOOGLE_AI_API_KEY", "").strip()
        )

    if use_gemini:
        model = _get_gemini_model()
        prompt = (
            f"SYSTEM INSTRUCTIONS:\n{SYSTEM_PROMPT}\n\n"
            f"CONVERSATION MESSAGES:\n{json.dumps(messages, ensure_ascii=False)}"
        )
        response = model.generate_content(prompt)
        raw = (response.text or "").strip()
    else:
        client = _get_client()
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        raw = _extract_anthropic_text(response)

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse NLP response JSON: {e}\nRaw: {raw[:500]}")
        return {
            "understood_intent": "unknown",
            "edits": [],
            "response_message": "I had trouble understanding that request. Could you rephrase it?",
            "needs_confirmation": False,
            "is_question": True,
        }

    return result


def parse_edit_intent_streaming(
    user_message: str,
    video: dict,
    conversation_history: list[dict],
    creator_dna: object | None = None,
    agent: str = "vfxb",
):
    """
    Streaming version — yields text tokens as they arrive from Claude.
    At the end, also returns the full accumulated content for JSON parsing.
    """
    video_context = _build_video_context(video)

    messages = []
    for msg in conversation_history[-10:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    context_header = f"VIDEO CONTEXT:\n{json.dumps(video_context, indent=2)}"
    if creator_dna:
        context_header += f"\n\nCREATOR DNA:\n{json.dumps(creator_dna, indent=2)}"

    full_message = f"{context_header}\n\nUSER MESSAGE: {user_message}"
    messages.append({"role": "user", "content": full_message})

    use_gemini = agent == "gemini"
    if not use_gemini:
        use_gemini = not bool(os.getenv("ANTHROPIC_API_KEY", "").strip()) and bool(
            os.getenv("GOOGLE_AI_API_KEY", "").strip()
        )

    if use_gemini:
        model = _get_gemini_model()
        prompt = (
            f"SYSTEM INSTRUCTIONS:\n{SYSTEM_PROMPT}\n\n"
            f"CONVERSATION MESSAGES:\n{json.dumps(messages, ensure_ascii=False)}"
        )
        response = model.generate_content(prompt)
        text = (response.text or "").strip()
        if text:
            yield text
        return text

    client = _get_client()
    with client.messages.stream(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages,
    ) as stream:
        full_text = ""
        for text in stream.text_stream:
            full_text += text
            yield text

    return full_text
