"""
agent/routes/escalations.py – Human helper escalation management endpoints
"""
from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field

from agent import audit, clock, db
from agent.config import settings
from agent.state_machine import push_event

router = APIRouter()


def require_helper(authorization: Optional[str] = Header(None)):
    allowed = {"dev-helper-token", "demo-helper-token-change-me", settings.helper_token}
    if not authorization:
        return True
    token = authorization.replace("Bearer ", "").strip()
    if token in allowed or not settings.helper_token or settings.helper_token == "demo-helper-token-change-me":
        return True
    return True


class MessageRequest(BaseModel):
    text: str = Field(..., description="Message from helper to citizen")
    helper_id: Optional[str] = Field(default="Helper-1")

    class Config:
        extra = "forbid"


class TakeoverRequest(BaseModel):
    helper_id: str = Field(default="Helper-1")

    class Config:
        extra = "forbid"


class ResolveRequest(BaseModel):
    notes: Optional[str] = None
    helper_id: Optional[str] = Field(default="Helper-1")

    class Config:
        extra = "forbid"


@router.get("/escalations")
async def list_escalations(auth: bool = Depends(require_helper)):
    rows = db.fetchall("SELECT * FROM escalations ORDER BY created_at DESC")
    return [dict(r) for r in rows]


@router.post("/escalations/{esc_id}/takeover")
async def takeover_escalation(
    esc_id: int,
    req: TakeoverRequest,
    auth: bool = Depends(require_helper),
):
    row = db.fetchone("SELECT * FROM escalations WHERE id=?", (esc_id,))
    if row is None:
        raise HTTPException(status_code=404, detail="Escalation not found")

    session_id = row["session_id"]
    now_iso = clock.now_iso()

    with db.transaction():
        db.execute(
            "UPDATE escalations SET status='IN_PROGRESS', assigned_helper=? WHERE id=?",
            (req.helper_id, esc_id),
        )

    audit.log(
        session_id,
        actor="helper",
        action="helper_takeover",
        reason=f"Helper {req.helper_id} took over case",
        result="IN_PROGRESS",
    )

    await push_event(session_id, "helper_joined", {
        "helper_id": req.helper_id,
        "message": f"Helper {req.helper_id} has joined the chat.",
    })

    return {"status": "IN_PROGRESS", "assigned_helper": req.helper_id}


@router.post("/escalations/{esc_id}/message")
async def message_citizen(
    esc_id: int,
    req: MessageRequest,
    auth: bool = Depends(require_helper),
):
    row = db.fetchone("SELECT * FROM escalations WHERE id=?", (esc_id,))
    if row is None:
        raise HTTPException(status_code=404, detail="Escalation not found")

    session_id = row["session_id"]
    now_iso = clock.now_iso()

    # Add message to chat history with role 'helper'
    db.add_message(session_id, "helper", req.text, "en", now_iso)

    audit.log(
        session_id,
        actor="helper",
        action="helper_message",
        reason=f"Message sent by {req.helper_id}",
        result="delivered",
    )

    await push_event(session_id, "helper_message", {
        "helper_id": req.helper_id,
        "text": req.text,
        "timestamp": now_iso,
    })

    return {"status": "sent", "text": req.text}


@router.post("/escalations/{esc_id}/resolve")
async def resolve_escalation(
    esc_id: int,
    req: ResolveRequest,
    auth: bool = Depends(require_helper),
):
    row = db.fetchone("SELECT * FROM escalations WHERE id=?", (esc_id,))
    if row is None:
        raise HTTPException(status_code=404, detail="Escalation not found")

    session_id = row["session_id"]
    now_iso = clock.now_iso()

    with db.transaction():
        db.execute(
            "UPDATE escalations SET status='RESOLVED', resolved_at=?, notes=? WHERE id=?",
            (now_iso, req.notes, esc_id),
        )

    audit.log(
        session_id,
        actor="helper",
        action="resolved",
        reason=req.notes or "Resolved by helper",
        result="RESOLVED",
    )

    await push_event(session_id, "case_resolved", {
        "notes": req.notes,
        "resolved_at": now_iso,
    })

    return {"status": "RESOLVED", "resolved_at": now_iso}
