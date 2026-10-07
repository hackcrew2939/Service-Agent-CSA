"""
agent/voice.py  –  Layer 3
Audio conversion and speech-to-text.
Primary: Whisper (local or API). Fallback: inform caller to use browser Web Speech API.
"""
from __future__ import annotations

import io
import os
import tempfile
from typing import Optional

from agent.config import settings


async def transcribe(audio_bytes: bytes, lang: str = "hi") -> dict:
    """
    Transcribe audio bytes to text.
    Returns {"text": str, "language": str, "fallback": bool}
    """
    mode = settings.whisper_mode

    if mode == "local":
        return await _transcribe_local(audio_bytes, lang)
    elif mode == "api":
        return await _transcribe_api(audio_bytes, lang)
    else:
        # browser mode: client handles STT; this endpoint just echoes back
        return {"text": "", "language": lang, "fallback": True,
                "message": "Use browser Web Speech API"}


async def _transcribe_local(audio_bytes: bytes, lang: str) -> dict:
    """Use faster-whisper (local) for STT."""
    try:
        import asyncio
        # Convert webm/opus to 16kHz mono WAV using ffmpeg
        wav_bytes = await _convert_audio(audio_bytes)

        def _run():
            from faster_whisper import WhisperModel  # type: ignore
            model = WhisperModel("tiny", device="cpu", compute_type="int8")
            segments, info = model.transcribe(
                io.BytesIO(wav_bytes),
                language=lang if lang != "en" else None,
            )
            return " ".join(s.text for s in segments), info.language

        text, detected_lang = await asyncio.get_event_loop().run_in_executor(None, _run)
        return {"text": text.strip(), "language": detected_lang, "fallback": False}
    except Exception as exc:
        return {"text": "", "language": lang, "fallback": True,
                "message": f"Whisper unavailable: {exc}"}


async def _transcribe_api(audio_bytes: bytes, lang: str) -> dict:
    """Use Anthropic or OpenAI Whisper API for STT (not implemented in this demo)."""
    return {"text": "", "language": lang, "fallback": True,
            "message": "Whisper API not configured; use browser"}


async def _convert_audio(audio_bytes: bytes) -> bytes:
    """Convert webm/opus to 16kHz mono WAV using ffmpeg subprocess."""
    import asyncio
    import subprocess

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tf:
        tf.write(audio_bytes)
        in_path = tf.name
    out_path = in_path.replace(".webm", ".wav")
    try:
        proc = await asyncio.create_subprocess_exec(
            "ffmpeg", "-y", "-i", in_path,
            "-ar", "16000", "-ac", "1", "-f", "wav", out_path,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        )
        await proc.communicate()
        with open(out_path, "rb") as f:
            return f.read()
    except FileNotFoundError:
        # ffmpeg not installed; return original bytes
        return audio_bytes
    finally:
        for p in (in_path, out_path):
            try:
                os.unlink(p)
            except OSError:
                pass
