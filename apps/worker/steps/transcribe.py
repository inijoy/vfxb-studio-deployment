"""
Transcription step via AssemblyAI.
Returns full transcript with word-level timestamps, speakers, fillers, and sentiment.
"""
import logging
import os
import time

import assemblyai as aai

logger = logging.getLogger(__name__)

aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY", "")

POLL_INTERVAL = 5  # seconds
MAX_WAIT = 30 * 60  # 30 minutes


def transcribe_video(video_path: str) -> dict:
    """
    Submit video to AssemblyAI for transcription.
    Returns structured dict with transcript, words, sentences, fillers, sentiment.
    """
    transcriber = aai.Transcriber()

    config = aai.TranscriptionConfig(
        speech_model=aai.SpeechModel.best,
        language_detection=True,
        punctuate=True,
        format_text=True,
        word_boost=[],
        disfluencies=True,           # detect fillers (um, uh, like)
        sentiment_analysis=True,
        speaker_labels=True,
        speakers_expected=2,
    )

    logger.info(f"Submitting {video_path} to AssemblyAI")

    transcript = transcriber.transcribe(video_path, config=config)

    if transcript.status == aai.TranscriptStatus.error:
        raise RuntimeError(f"AssemblyAI transcription failed: {transcript.error}")

    # Extract word-level data
    words = []
    if transcript.words:
        for w in transcript.words:
            words.append(
                {
                    "text": w.text,
                    "start": w.start / 1000.0,  # ms → seconds
                    "end": w.end / 1000.0,
                    "confidence": w.confidence,
                    "speaker": getattr(w, "speaker", None),
                }
            )

    # Extract sentences
    sentences = []
    if transcript.get_sentences():
        for s in transcript.get_sentences():
            sentences.append(
                {
                    "text": s.text,
                    "start": s.start / 1000.0,
                    "end": s.end / 1000.0,
                }
            )

    # Extract filler words
    fillers = [w for w in words if w["text"].lower() in {"um", "uh", "like", "you know", "so"}]

    # Sentiment summary
    sentiment_summary = None
    if transcript.sentiment_analysis:
        positive = sum(1 for s in transcript.sentiment_analysis if "POSITIVE" in str(s.sentiment))
        negative = sum(1 for s in transcript.sentiment_analysis if "NEGATIVE" in str(s.sentiment))
        neutral = sum(1 for s in transcript.sentiment_analysis if "NEUTRAL" in str(s.sentiment))
        total = len(transcript.sentiment_analysis)
        sentiment_summary = {
            "positive_pct": round(positive / total * 100) if total else 0,
            "negative_pct": round(negative / total * 100) if total else 0,
            "neutral_pct": round(neutral / total * 100) if total else 0,
        }

    return {
        "transcript": transcript.text or "",
        "words": words,
        "sentences": sentences,
        "fillers": fillers,
        "filler_count": len(fillers),
        "sentiment": sentiment_summary,
        "duration_ms": transcript.audio_duration,
        "confidence": transcript.confidence,
    }
