"""
agent/portal_client.py  –  Layer 3
Async HTTP client for the mock government portal.
All mutating calls carry an Idempotency-Key header.
"""
from __future__ import annotations

import httpx
from typing import Any

from agent.config import settings

_TIMEOUT = 8.0  # seconds (PRD Section 22)


def _headers(idempotency_key: str | None = None) -> dict:
    h = {"Accept": "application/json"}
    if idempotency_key:
        h["Idempotency-Key"] = idempotency_key
    return h


async def health() -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{settings.portal_base_url}/api/health")
            return r.status_code == 200
    except Exception:
        return False


async def upload_document(
    slot: str,
    file_path: str,
    idempotency_key: str,
) -> dict:
    """Upload one document to the portal. Returns {document_ref}."""
    with open(file_path, "rb") as f:
        data = f.read()
    filename = file_path.split("/")[-1].split("\\")[-1]
    # detect content type by extension
    ct = "image/jpeg"
    if filename.lower().endswith(".png"):
        ct = "image/png"
    elif filename.lower().endswith(".pdf"):
        ct = "application/pdf"

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        r = await client.post(
            f"{settings.portal_base_url}/api/documents/upload",
            headers=_headers(idempotency_key),
            files={"file": (filename, data, ct)},
            data={"slot": slot},
        )
    r.raise_for_status()
    return r.json()


async def apply_income_certificate(
    form_data: dict,
    document_refs: list[str],
    idempotency_key: str,
) -> dict:
    """Submit the Income Certificate application. Returns {application_id, status}."""
    payload = {**form_data, "document_refs": document_refs}
    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        r = await client.post(
            f"{settings.portal_base_url}/api/apply/income_certificate",
            json=payload,
            headers=_headers(idempotency_key),
        )
    r.raise_for_status()
    return r.json()


async def check_status(application_id: str) -> dict:
    """Poll the application status. Returns {status, history, rejection_reason}."""
    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        r = await client.get(
            f"{settings.portal_base_url}/api/status/{application_id}",
        )
    r.raise_for_status()
    return r.json()


async def withdraw(application_id: str, idempotency_key: str) -> dict:
    """Withdraw a submitted application."""
    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        r = await client.post(
            f"{settings.portal_base_url}/api/applications/{application_id}/withdraw",
            headers=_headers(idempotency_key),
        )
    r.raise_for_status()
    return r.json()


async def set_fail_mode(mode: str) -> dict:
    """Set failure simulation mode (for testing and demo)."""
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.post(
            f"{settings.portal_base_url}/api/admin/set_fail_mode",
            json={"mode": mode},
        )
    r.raise_for_status()
    return r.json()
