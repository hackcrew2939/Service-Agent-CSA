"""
agent/tools.py  –  Layer 4
Tool implementations that execute behind execute_action().
All sensitive tools MUST be called through consent.execute_action().
"""
from __future__ import annotations

import json
import os
from typing import Any, Optional

import agent.audit as audit
import agent.clock as clock
import agent.db as db
import agent.portal_client as portal_client
import agent.util as util
from agent.validation import get_citizen_for_session, CITIZENS

_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_SERVICES_PATH = os.path.join(_BASE, "data", "services.json")


def _load_service_cfg(service: str = "income_certificate") -> dict:
    with open(_SERVICES_PATH, encoding="utf-8") as f:
        return json.load(f)[service]


# ── Non-sensitive tools ───────────────────────────────────────────────────────

def build_form_payload(session_id: str, service: str = "income_certificate") -> dict:
    """
    Build the form submission payload FROM DATABASE DATA (never from LLM text).
    Uses the citizen record identified by the validated Aadhaar document.
    """
    docs = db.get_documents(session_id)
    # Build extracted dict per slot
    extracted: dict[str, dict] = {}
    for doc in docs:
        if doc["status"] == "OK" and doc["extracted_json"]:
            try:
                extracted[doc["slot"]] = json.loads(doc["extracted_json"])
            except Exception:
                pass

    citizen = get_citizen_for_session(extracted)
    if citizen is None:
        raise ValueError("Cannot build form: no valid Aadhaar document found.")

    cfg = _load_service_cfg(service)
    payload = {}
    for field in cfg["form_fields"]:
        payload[field] = citizen.get(field)

    return payload


def build_document_share_payload(session_id: str) -> dict:
    """
    Build the payload for share_document from DB data.
    Returns {slot: file_path} for all OK documents.
    """
    docs = db.get_documents(session_id)
    result = {}
    for doc in docs:
        if doc["status"] == "OK":
            result[doc["slot"]] = doc["file_path"]
    return result


async def tool_fill_form(payload: dict) -> dict:
    """Fill the portal form with validated data (non-sensitive, no consent needed)."""
    # In the mock, filling just means the data is ready — no actual portal call
    return {"status": "filled", "fields": payload}


async def tool_share_document(payload: dict) -> dict:
    """Upload documents to the portal. Called via execute_action (sensitive)."""
    document_refs = []
    for slot, file_path in payload.items():
        if not file_path or not os.path.exists(str(file_path)):
            continue
        ikey = util.idempotency_key(
            payload.get("_session_id", ""), f"share_{slot}", util.payload_hash({slot: file_path})
        )
        result = await portal_client.upload_document(slot, str(file_path), ikey)
        document_refs.append(result.get("document_ref", ""))
    return {"document_refs": document_refs}


async def tool_submit_form(payload: dict) -> dict:
    """Submit the application. Called via execute_action (sensitive)."""
    form_data = {k: v for k, v in payload.items()
                 if k not in ("document_refs", "_session_id", "_idempotency_key")}
    document_refs = payload.get("document_refs", [])
    ikey = payload.get("_idempotency_key", util.new_uuid())
    result = await portal_client.apply_income_certificate(form_data, document_refs, ikey)
    return result


async def tool_check_status(payload: dict) -> dict:
    """Poll the application status (non-sensitive)."""
    application_id = payload.get("application_id", "")
    return await portal_client.check_status(application_id)


async def tool_withdraw_application(payload: dict) -> dict:
    """Withdraw the application. Called via execute_action (sensitive)."""
    application_id = payload.get("application_id", "")
    ikey = payload.get("_idempotency_key", util.new_uuid())
    return await portal_client.withdraw(application_id, ikey)


def get_required_slots(service: str = "income_certificate") -> list[str]:
    cfg = _load_service_cfg(service)
    return cfg["required_documents"]


def all_docs_ok(session_id: str, service: str = "income_certificate") -> bool:
    """Return True if all required document slots have status=OK."""
    required = set(get_required_slots(service))
    docs = db.get_documents(session_id)
    ok_slots = {d["slot"] for d in docs if d["status"] == "OK"}
    return required.issubset(ok_slots)
