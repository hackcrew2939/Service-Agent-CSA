"""
agent/routes/consent.py – Consent API endpoints
"""
from __future__ import annotations

import asyncio
from typing import Optional
from fastapi import APIRouter, Cookie, Header, HTTPException
from pydantic import BaseModel, Field

from agent import clock, db
from agent.consent import record_consent_decision
from agent.state_machine import handle_message, push_event

router = APIRouter()


class ConsentDecisionRequest(BaseModel):
    decision: str = Field(..., description="'yes', 'no', or 'human'")
    method: str = Field(default="button", description="'button' or 'voice'")
    transcript: Optional[str] = None
    confidence: Optional[float] = None

    class Config:
        extra = "forbid"


@router.get("/consent/pending/{session_id}")
async def get_pending_consent(
    session_id: str,
    session_id_cookie: Optional[str] = Cookie(None, alias="session_id"),
):
    if session_id_cookie and session_id_cookie != session_id:
        raise HTTPException(status_code=403, detail="Session cookie mismatch")

    session = db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    pending = db.get_pending_consent(session_id)
    if pending is None:
        return {"pending": False, "consent": None}
    return {"pending": True, "consent": dict(pending)}


@router.post("/consent/{consent_id}")
async def decide_consent(
    consent_id: str,
    req: ConsentDecisionRequest,
    session_id_cookie: Optional[str] = Cookie(None, alias="session_id"),
    x_csrf_token: Optional[str] = Header(None, alias="X-CSRF-Token"),
):
    consent = db.get_consent(consent_id)
    if consent is None:
        raise HTTPException(status_code=404, detail="Consent request not found")

    session_id = consent["session_id"]
    if session_id_cookie and session_id_cookie != session_id:
        raise HTTPException(status_code=403, detail="Session cookie mismatch")

    # Record decision in DB (atomic compare-and-set)
    recorded = record_consent_decision(
        consent_id=consent_id,
        session_id=session_id,
        decision=req.decision,
        method=req.method,
        transcript=req.transcript,
        confidence=req.confidence,
    )

    if not recorded:
        return {
            "status": "already_decided",
            "consent_id": consent_id,
            "decision": consent["status"],
        }

    # Notify UI via SSE
    await push_event(session_id, "consent_decided", {
        "consent_id": consent_id,
        "decision": req.decision,
        "status": "granted" if req.decision == "yes" else "denied"
    })

    # If decision was 'human', trigger human escalation
    if req.decision == "human":
        res = await handle_message(session_id, "I want to talk to a human")
        return {
            "status": "recorded",
            "decision": req.decision,
            "next_step": res,
        }

    # Automatically advance state machine after decision
    action_text = "yes" if req.decision == "yes" else "no"
    res = await handle_message(session_id, f"I selected {action_text} for consent")

    return {
        "status": "recorded",
        "decision": req.decision,
        "next_step": res,
    }


@router.get("/consents/{session_id}")
async def list_consents(
    session_id: str,
    session_id_cookie: Optional[str] = Cookie(None, alias="session_id"),
):
    if session_id_cookie and session_id_cookie != session_id:
        raise HTTPException(status_code=403, detail="Session cookie mismatch")

    rows = db.fetchall(
        "SELECT * FROM consents WHERE session_id=? ORDER BY created_at DESC",
        (session_id,)
    )
    return [dict(r) for r in rows]


@router.post("/consent/{consent_id}/revoke")
async def revoke_consent(
    consent_id: str,
    session_id_cookie: Optional[str] = Cookie(None, alias="session_id"),
    x_csrf_token: Optional[str] = Header(None, alias="X-CSRF-Token"),
):
    consent = db.get_consent(consent_id)
    if consent is None:
        raise HTTPException(status_code=404, detail="Consent request not found")

    session_id = consent["session_id"]
    if session_id_cookie and session_id_cookie != session_id:
        raise HTTPException(status_code=403, detail="Session cookie mismatch")

    ok = db.revoke_consent(consent_id)
    if not ok:
        raise HTTPException(status_code=400, detail="Cannot revoke consent in its current state")

    return {"status": "revoked", "consent_id": consent_id}
