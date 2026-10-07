"""
agent/consent.py  –  Layer 2
Consent gate: execute_action() is the ONLY path to sensitive tools.
IMPORTANT: This module MUST NOT import llm.py (enforced by test_architecture.py).
"""
from __future__ import annotations

import datetime
import json
from typing import Any, Callable

import agent.audit as audit
import agent.clock as clock
import agent.db as db
import agent.util as util
from agent.config import settings

# ── Sensitive action registry ──────────────────────────────────────────────────
SENSITIVE_ACTIONS: set[str] = {
    "share_document",
    "submit_form",
    "make_payment",
    "reapply",
    "share_with_helper",
    "withdraw_application",
}

ALLOWED_ACTIONS: set[str] = SENSITIVE_ACTIONS | {
    "validate_document",
    "fill_form",
    "check_status",
    "list_my_consents",
}

# Consent TTL (seconds)
CONSENT_TTL = 600


class ConsentRequired(Exception):
    """Raised when a sensitive action has no valid granted consent."""
    def __init__(self, request: dict):
        self.request = request
        super().__init__(f"Consent required for: {request.get('action')}")


class ActionNotAllowed(Exception):
    """Raised for unknown or disallowed action names."""


def _destination(action: str) -> str:
    if action in ("submit_form", "share_document", "reapply"):
        return "Government of Jharkhand mock portal – Income Certificate service"
    if action == "share_with_helper":
        return "Human helper (service centre staff)"
    if action == "make_payment":
        return "Payment gateway (mock, Rs 0)"
    if action == "withdraw_application":
        return "Government of Jharkhand mock portal – withdraw application"
    return "Internal system"


def _purpose(action: str) -> str:
    if action == "share_document":
        return "Required for Income Certificate application"
    if action == "submit_form":
        return "Submit the Income Certificate application"
    if action == "make_payment":
        return "Pay the application fee (Rs 0 for income certificate)"
    if action == "reapply":
        return "Resubmit after correction"
    if action == "share_with_helper":
        return "Allow a human helper to assist with your case"
    if action == "withdraw_application":
        return "Withdraw the submitted application"
    return "Process your request"


def _data_fields(payload: dict) -> str:
    """Human-readable list of data fields in the payload (masked)."""
    masked = util.mask(payload)
    parts = []
    for k, v in masked.items():
        if v is not None and v != "":
            parts.append(f"{k}: {v}")
    return "; ".join(parts) if parts else "No data fields"


def execute_action(
    session_id: str,
    action: str,
    payload: dict,
    tool_fn: Callable[[dict], Any],
    language: str = "en",
) -> Any:
    """
    The single execution path for all agent actions.
    - Non-sensitive actions: run directly.
    - Sensitive actions: require a granted, unexpired, payload-bound consent.
    ABLATE_CODE_CONSENT=1 (benchmark only) skips the code gate to demonstrate violations.
    """
    if action not in ALLOWED_ACTIONS:
        raise ActionNotAllowed(f"Unknown action: {action}")

    # Benchmark ablation: skip the code gate (demonstrates consent violations)
    skip_gate = (
        settings.benchmark_mode
        and settings.ablate_code_consent
        and action in SENSITIVE_ACTIONS
    )

    consent_row = None
    if action in SENSITIVE_ACTIONS and not skip_gate:
        phash = util.payload_hash(payload)
        now_iso = clock.now_iso()

        # Atomic reserve: granted -> in_use
        with db.transaction(immediate=True):
            consent_row = db.reserve_consent(session_id, action, phash, now_iso)

        if consent_row is None:
            # No granted consent exists → create a request and raise
            consent_id = util.new_uuid()
            expiry = (
                clock.now() + datetime.timedelta(seconds=CONSENT_TTL)
            ).isoformat()
            masked_payload = util.mask(payload)
            db.create_consent_request(
                consent_id=consent_id,
                session_id=session_id,
                action=action,
                payload_json=util.canonical(masked_payload),
                payload_hash=phash,
                data_fields=_data_fields(payload),
                destination=_destination(action),
                purpose=_purpose(action),
                language=language,
                expires_at=expiry,
                created_at=clock.now_iso(),
            )
            audit.log(
                session_id, actor="agent", action="consent_requested",
                reason=f"{action} is a sensitive action",
                consent_status="pending", result="waiting",
            )
            req = dict(db.get_consent(consent_id))
            raise ConsentRequired(req)

    # Run the tool (with the recovery wrapper from the caller's side)
    idempotency_key = util.idempotency_key(
        session_id, action, util.payload_hash(payload)
    )
    try:
        result = tool_fn(payload)
    except Exception as exc:
        # Release the consent so a retry can reuse it
        if consent_row is not None:
            db.release_consent(consent_row["id"])
        audit.log(
            session_id, actor="agent", action=action,
            reason=f"Tool raised exception: {type(exc).__name__}",
            consent_status="yes" if (consent_row and not skip_gate) else "not_needed",
            result=f"fail: {exc}",
            payload_summary=util.mask(payload),
        )
        raise

    # Mark consent used
    if consent_row is not None:
        db.mark_consent_used(consent_row["id"])

    consent_status = "not_needed" if action not in SENSITIVE_ACTIONS else (
        "bypassed_ablation" if skip_gate else "yes"
    )
    audit.log(
        session_id, actor="agent", action=action,
        reason=f"Executed {action}",
        consent_status=consent_status,
        result="success",
        payload_summary=util.mask(payload),
    )
    return result


def record_consent_decision(
    consent_id: str,
    session_id: str,
    decision: str,   # "yes" | "no" | "human"
    method: str,     # "button" | "voice"
    transcript: str | None = None,
    confidence: float | None = None,
) -> bool:
    """
    Record a citizen's consent decision.
    Returns True if the decision was recorded (atomic compare-and-set prevents double-clicks).
    'human' decision is treated as 'no' for the consent (but triggers escalation upstream).
    """
    effective = "yes" if decision == "yes" else "no"
    decided_at = clock.now_iso()
    ok = db.decide_consent(
        consent_id=consent_id,
        decision=effective,
        method=method,
        decided_at=decided_at,
        transcript=transcript,
        confidence=confidence,
    )
    if ok:
        action_str = "consent_granted" if effective == "yes" else "consent_denied"
        row = db.get_consent(consent_id)
        audit.log(
            session_id, actor="user", action=action_str,
            reason=f"Citizen decided: {decision} via {method}",
            consent_status=effective,
            result="recorded",
            payload_summary=row["payload_json"] if row else None,
        )
    return ok
