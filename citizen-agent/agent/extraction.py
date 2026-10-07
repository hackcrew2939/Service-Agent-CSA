"""
agent/extraction.py  –  Layer 3
Document field extraction: vision (Claude) or sidecar JSON fallback.
The LLM extraction call is isolated — no tools, fixed system prompt,
output treated as data only, parsed by pydantic, never pasted into the agent prompt.
"""
from __future__ import annotations

import base64
import json
import os
from typing import Any, Optional

from pydantic import BaseModel, field_validator

from agent.config import settings


# ── Pydantic schema for extracted fields ───────────────────────────────────────
class ExtractedDocument(BaseModel):
    readable: bool = True
    document_type: Optional[str] = None
    name: Optional[str] = None
    father_name: Optional[str] = None
    aadhaar_number: Optional[str] = None
    ration_card_no: Optional[str] = None
    dob: Optional[str] = None
    address: Optional[str] = None
    annual_income: Optional[int] = None
    issue_date: Optional[str] = None

    class Config:
        extra = "ignore"


_EXTRACTION_PROMPT = """\
You are a document field extractor. From the attached image extract ONLY the following fields and return them as valid JSON:
  document_type (one of: aadhaar | ration_card | income_proof | photo | unknown),
  name, father_name, aadhaar_number (format: #### #### ####),
  ration_card_no, dob (ISO YYYY-MM-DD), address,
  annual_income (integer, rupees), issue_date (ISO YYYY-MM-DD).

If the image is too blurry or unreadable, return ONLY: {"readable": false}
Do NOT guess missing values — use null for anything you cannot read clearly.
Return ONLY valid JSON. No explanation, no markdown fences.
"""

_MAX_IMAGE_PX = 1568  # long edge limit (PRD Section 9.2)


def _resize_image_bytes(raw: bytes, max_px: int = _MAX_IMAGE_PX) -> bytes:
    """Resize image so that the long edge is at most max_px px."""
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(raw))
        w, h = img.size
        long_edge = max(w, h)
        if long_edge > max_px:
            scale = max_px / long_edge
            img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        return buf.getvalue()
    except Exception:
        return raw  # return original if PIL unavailable


def _load_sidecar(file_path: str) -> Optional[dict]:
    """Load the sidecar JSON for a document file."""
    sidecar_path = os.path.splitext(file_path)[0] + ".json"
    if os.path.exists(sidecar_path):
        with open(sidecar_path, encoding="utf-8") as f:
            return json.load(f)
    return None


def _parse_llm_json(text: str) -> Optional[dict]:
    """Strip code fences and parse as JSON. Returns None on failure."""
    text = text.strip()
    # strip markdown fences
    if text.startswith("```"):
        lines = text.splitlines()
        text = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


async def _extract_via_vision(file_path: str, expected_type: str) -> dict:
    """Call Claude vision to extract document fields."""
    import anthropic

    with open(file_path, "rb") as f:
        raw = f.read()

    ext = os.path.splitext(file_path)[1].lower()
    if ext in (".jpg", ".jpeg", ".png"):
        raw = _resize_image_bytes(raw)
        media_type = "image/jpeg"
        b64_data = base64.standard_b64encode(raw).decode("utf-8")
        source = {"type": "base64", "media_type": media_type, "data": b64_data}
        content_block = {"type": "image", "source": source}
    else:
        # PDF: send as document
        b64_data = base64.standard_b64encode(raw).decode("utf-8")
        source = {"type": "base64", "media_type": "application/pdf", "data": b64_data}
        content_block = {"type": "document", "source": source}

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    for attempt in range(2):
        try:
            response = await client.messages.create(
                model=settings.claude_model,
                max_tokens=512,
                system=_EXTRACTION_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            content_block,
                            {"type": "text", "text": f"Extract fields for a '{expected_type}' document."},
                        ],
                    }
                ],
            )
            text = response.content[0].text
            parsed = _parse_llm_json(text)
            if parsed is not None:
                # Validate with pydantic
                try:
                    doc = ExtractedDocument(**parsed)
                    return doc.model_dump()
                except Exception:
                    pass  # retry
        except Exception:
            if attempt == 0:
                continue
            break

    # Both attempts failed — signal manual entry needed
    return {"readable": False, "_error": "vision_failed"}


async def extract(file_path: str, expected_type: str) -> dict:
    """
    Main extraction entry point.
    Mode: 'sidecar' (test/fallback) or 'vision' (production).
    Always falls back to sidecar if vision fails, then returns unreadable.
    """
    if settings.extraction_mode == "sidecar":
        sidecar = _load_sidecar(file_path)
        if sidecar is not None:
            return sidecar
        return {"readable": False, "_error": "no_sidecar"}

    # vision mode: try vision, fall back to sidecar
    try:
        result = await _extract_via_vision(file_path, expected_type)
        if result.get("_error") == "vision_failed":
            sidecar = _load_sidecar(file_path)
            return sidecar if sidecar is not None else {"readable": False}
        return result
    except Exception:
        sidecar = _load_sidecar(file_path)
        return sidecar if sidecar is not None else {"readable": False}
