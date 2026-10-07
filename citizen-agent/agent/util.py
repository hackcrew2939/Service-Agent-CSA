"""
agent/util.py  –  Layer 0
Canonical JSON, SHA-256 helpers, Aadhaar masking, idempotency keys.
No imports from higher layers.
"""
from __future__ import annotations

import hashlib
import json
import re
import uuid
from typing import Any


# ── JSON canonicalisation ─────────────────────────────────────────────────────

def canonical(obj: Any) -> str:
    """Deterministic, UTF-8-safe JSON with sorted keys and no extra whitespace."""
    return json.dumps(obj, sort_keys=True, separators=(",", ":"),
                      ensure_ascii=False, default=str)


# ── Hashing ───────────────────────────────────────────────────────────────────

def sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def payload_hash(payload: dict) -> str:
    """Stable hash of a payload dict (used to bind consent to payload)."""
    return sha256_hex(canonical(payload))


def idempotency_key(session_id: str, action: str, phash: str) -> str:
    """
    Deterministic idempotency key: sha256(session_id:action:payload_hash).
    Retries and crash-resume compute the same key and never create duplicates.
    """
    return sha256_hex(f"{session_id}:{action}:{phash}")


# ── UUID ──────────────────────────────────────────────────────────────────────

def new_uuid() -> str:
    return str(uuid.uuid4())


# ── Aadhaar helpers ───────────────────────────────────────────────────────────

_AADHAAR_RE = re.compile(r"^\d{4} \d{4} \d{4}$")


def normalize_aadhaar(raw: str | None) -> str | None:
    """Normalise Aadhaar to '#### #### ####' or return None if invalid."""
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) != 12:
        return None
    return f"{digits[:4]} {digits[4:8]} {digits[8:]}"


def mask_aadhaar(raw: str | None) -> str:
    """Return 'XXXX XXXX 9012' style masked string."""
    n = normalize_aadhaar(raw)
    if n is None:
        return "XXXX XXXX XXXX"
    return f"XXXX XXXX {n[-4:]}"


def mask(payload: dict) -> dict:
    """Return a copy of payload with Aadhaar numbers masked."""
    result = {}
    for k, v in payload.items():
        if isinstance(v, str) and normalize_aadhaar(v):
            result[k] = mask_aadhaar(v)
        elif isinstance(v, dict):
            result[k] = mask(v)
        else:
            result[k] = v
    return result
