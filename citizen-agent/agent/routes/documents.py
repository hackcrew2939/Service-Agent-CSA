"""
agent/routes/documents.py – Document upload, extraction, and listing routes
"""
from __future__ import annotations

import os
import shutil
import uuid
from typing import Optional
from fastapi import APIRouter, Cookie, File, Form, Header, HTTPException, UploadFile
from pydantic import BaseModel

from agent import clock, db, extraction, state_machine
from agent.config import settings

router = APIRouter()

UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "uploads",
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/documents/{session_id}")
async def upload_document(
    session_id: str,
    slot: str = Form(...),
    file: UploadFile = File(...),
    session_id_cookie: Optional[str] = Cookie(None, alias="session_id"),
    x_csrf_token: Optional[str] = Header(None, alias="X-CSRF-Token"),
):
    if session_id_cookie and session_id_cookie != session_id:
        raise HTTPException(status_code=403, detail="Session cookie mismatch")

    session = db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Save file with random uuid
    file_ext = os.path.splitext(file.filename or "")[1].lower() or ".jpg"
    safe_filename = f"{session_id}_{slot}_{uuid.uuid4().hex[:8]}{file_ext}"
    dest_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(dest_path, "wb") as f_out:
        shutil.copyfileobj(file.file, f_out)

    # Run extraction (vision or sidecar)
    extracted = await extraction.extract(dest_path, slot)

    # Process extraction in state machine
    lang = session["language"] or "en"
    result = await state_machine.handle_document_upload(
        session_id=session_id,
        slot=slot,
        file_path=dest_path,
        extracted=extracted,
        lang=lang,
    )

    return {
        "slot": slot,
        "extracted": extracted,
        "validation": result,
        "file_path": dest_path,
    }


@router.get("/documents/{session_id}")
async def list_documents(session_id: str):
    session = db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    docs = db.get_documents(session_id)
    return [dict(d) for d in docs]
