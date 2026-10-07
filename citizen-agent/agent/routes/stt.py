"""
agent/routes/stt.py – Speech-to-text API endpoint
"""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from agent import voice

router = APIRouter()


@router.post("/stt")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: Optional[str] = Form("hi"),
):
    try:
        content = await audio.read()
        res = await voice.transcribe(content, lang=language or "hi")
        return res
    except Exception as exc:
        return {
            "text": "",
            "language": language or "hi",
            "fallback": True,
            "message": f"Speech-to-text error: {exc}",
        }
