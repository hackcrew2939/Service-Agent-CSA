"""
agent/routes/session.py – Session lifecycle routes
"""
from __future__ import annotations

import uuid
from typing import Optional
from fastapi import APIRouter, Cookie, Header, HTTPException, Response, Request
from pydantic import BaseModel, Field

from agent import clock, db
from agent.config import settings

router = APIRouter()


class CreateSessionRequest(BaseModel):
    language: str = Field(default="en", description="Language: en or hi")
    service: Optional[str] = Field(default="income_certificate")

    class Config:
        extra = "forbid"


class CreateSessionResponse(BaseModel):
    session_id: str
    csrf_token: str
    language: str
    state: str


@router.post("/session", response_model=CreateSessionResponse)
async def create_new_session(req: CreateSessionRequest, response: Response):
    session_id = str(uuid.uuid4())
    csrf_token = str(uuid.uuid4())
    now_iso = clock.now_iso()
    
    # Store initial context with csrf_token
    db.create_session(session_id, req.language, now_iso)
    if req.service:
        db.update_session_service(session_id, req.service)
    
    # Set context_json with csrf_token
    ctx = {"csrf_token": csrf_token}
    db.update_session_context(session_id, ctx)
    
    # Set HttpOnly cookie
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        samesite="lax",
        secure=False,  # Localhost demo
    )
    
    return CreateSessionResponse(
        session_id=session_id,
        csrf_token=csrf_token,
        language=req.language,
        state="START"
    )
