"""
portal/main.py  –  Mock Government Portal (port 8001)
FastAPI app with all endpoints from PRD Section 16.
"""
from __future__ import annotations

import datetime
import json
import os
import random
import sys
import uuid
from typing import Optional

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from pydantic import BaseModel

# Adjust path so 'portal.db' is resolved correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import portal.db as db

# ── Synthetic citizen registry (read-only) ────────────────────────────────────
_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_CITIZENS_PATH = os.path.join(_BASE, "data", "citizens.json")
_UPLOADS_DIR = os.path.join(_BASE, "uploads")
os.makedirs(_UPLOADS_DIR, exist_ok=True)

with open(_CITIZENS_PATH, encoding="utf-8") as f:
    _CITIZENS: list[dict] = json.load(f)

_CITIZEN_BY_AADHAAR = {c["aadhaar"]: c for c in _CITIZENS}

# ── Failure simulation ────────────────────────────────────────────────────────
_fail_mode: str = os.getenv("PORTAL_FAIL_MODE", "none")
_portal_seed: int = int(os.getenv("PORTAL_SEED", "42"))
_rng = random.Random(_portal_seed)
_fail_n_counters: dict[str, int] = {}  # idempotency_key -> call count

_TEST_MODE: bool = os.getenv("TEST_MODE", "0") == "1"
_INCOME_LIMIT: int = 300000

# Timers (seconds from created_at)
_UNDER_REVIEW_AFTER = 1 if _TEST_MODE else 30
_DECISION_AFTER = 2 if _TEST_MODE else 60


def _should_fail(ikey: Optional[str] = None) -> Optional[tuple[int, str]]:
    """Return (status_code, detail) if the request should fail, else None."""
    global _fail_mode
    if _fail_mode == "none":
        return None
    if _fail_mode == "down":
        return (503, "Portal is down (simulated)")
    if _fail_mode == "slow":
        import time; time.sleep(16)  # exceeds agent 8s timeout
        return None
    if _fail_mode == "random":
        if _rng.random() < 0.30:
            return (500, "Random portal error (simulated)")
        return None
    if _fail_mode == "reject_income":
        return None  # handled at application level
    if _fail_mode.startswith("fail_n:"):
        k = int(_fail_mode.split(":")[1])
        count = _fail_n_counters.get(ikey or "", 0) + 1
        _fail_n_counters[ikey or ""] = count
        if count <= k:
            return (503, f"fail_n: call {count} of {k} (simulated)")
        return None
    return None


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Mock Government Portal", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

_TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")
templates = Jinja2Templates(directory=_TEMPLATES_DIR)


@app.on_event("startup")
async def startup():
    db.init_db()


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "mock-portal"}


# ── Document upload ────────────────────────────────────────────────────────────
@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    slot: str = Form(...),
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
):
    ikey = idempotency_key or str(uuid.uuid4())

    # Fail simulation
    fail = _should_fail(ikey)
    if fail:
        raise HTTPException(status_code=fail[0], detail=fail[1])

    # Idempotency: return existing doc if same key
    existing = db.fetchone(
        "SELECT ref FROM portal_documents WHERE idempotency_key=?", (ikey,)
    )
    if existing:
        return {"document_ref": existing["ref"]}

    # Validate file type by extension (demo-level)
    fname = file.filename or "upload"
    ext = os.path.splitext(fname)[1].lower()
    if ext not in (".jpg", ".jpeg", ".png", ".pdf"):
        raise HTTPException(status_code=400, detail="Only JPG, PNG, PDF accepted")

    # Save file
    doc_ref = str(uuid.uuid4())
    dest = os.path.join(_UPLOADS_DIR, f"portal_{doc_ref}{ext}")
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5 MB)")
    with open(dest, "wb") as f2:
        f2.write(contents)

    with db.transaction():
        db._get_conn().execute(
            "INSERT INTO portal_documents (ref, idempotency_key, file_path, created_at) VALUES (?,?,?,?)",
            (doc_ref, ikey, dest, datetime.datetime.utcnow().isoformat())
        )

    return {"document_ref": doc_ref}


# ── Application submission ────────────────────────────────────────────────────
class ApplyRequest(BaseModel):
    name: Optional[str] = None
    father_name: Optional[str] = None
    dob: Optional[str] = None
    address: Optional[str] = None
    aadhaar: Optional[str] = None
    annual_income: Optional[int] = None
    document_refs: list[str] = []


@app.post("/api/apply/income_certificate")
async def apply_income_certificate(
    body: ApplyRequest,
    request: Request,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
):
    ikey = idempotency_key or str(uuid.uuid4())

    # Fail simulation
    fail = _should_fail(ikey)
    if fail:
        raise HTTPException(status_code=fail[0], detail=fail[1])

    # Idempotency
    existing = db.fetchone("SELECT id FROM applications WHERE idempotency_key=?", (ikey,))
    if existing:
        return _status_response(existing["id"])

    # Validate required fields
    if not body.aadhaar:
        raise HTTPException(status_code=400, detail="Aadhaar is required")
    citizen = _CITIZEN_BY_AADHAAR.get(body.aadhaar.strip())
    if not citizen:
        raise HTTPException(status_code=400, detail="Aadhaar not found in registry")

    forced_outcome = None
    rejection_reason = None
    if _fail_mode == "reject_income":
        forced_outcome = "Rejected"
        rejection_reason = "Income proof expired"
    elif body.annual_income and body.annual_income > _INCOME_LIMIT:
        forced_outcome = "Rejected"
        rejection_reason = f"Annual income Rs {body.annual_income:,} exceeds limit Rs {_INCOME_LIMIT:,}"

    app_id = str(uuid.uuid4())
    now = datetime.datetime.utcnow().isoformat()
    with db.transaction():
        db._get_conn().execute(
            """INSERT INTO applications
               (id, idempotency_key, form_json, document_refs, created_at, forced_outcome, rejection_reason)
               VALUES (?,?,?,?,?,?,?)""",
            (app_id, ikey, json.dumps(body.model_dump(), ensure_ascii=False),
             json.dumps(body.document_refs), now, forced_outcome, rejection_reason)
        )

    return {"application_id": app_id, "status": "Submitted"}


# ── Status ─────────────────────────────────────────────────────────────────────
@app.get("/api/status/{application_id}")
async def get_status(application_id: str):
    row = db.fetchone("SELECT * FROM applications WHERE id=?", (application_id,))
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    return _status_response(application_id)


def _status_response(application_id: str) -> dict:
    row = db.fetchone("SELECT * FROM applications WHERE id=?", (application_id,))
    if not row:
        return {"status": "Not found", "application_id": application_id}

    if row["withdrawn_at"]:
        return {"status": "Withdrawn", "application_id": application_id,
                "history": ["Submitted", "Withdrawn"]}

    created = datetime.datetime.fromisoformat(row["created_at"])
    now = datetime.datetime.utcnow()
    elapsed = (now - created).total_seconds()

    if elapsed < _UNDER_REVIEW_AFTER:
        status = "Submitted"
        history = ["Submitted"]
    elif elapsed < _DECISION_AFTER:
        status = "Under Review"
        history = ["Submitted", "Under Review"]
    else:
        if row["forced_outcome"]:
            status = row["forced_outcome"]
        else:
            status = "Approved"
        history = ["Submitted", "Under Review", status]

    rejection_reason = row["rejection_reason"] if status == "Rejected" else None
    return {
        "application_id": application_id,
        "status": status,
        "history": history,
        "rejection_reason": rejection_reason,
        "created_at": row["created_at"],
    }


# ── Withdrawal ────────────────────────────────────────────────────────────────
@app.post("/api/applications/{application_id}/withdraw")
async def withdraw_application(
    application_id: str,
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
):
    row = db.fetchone("SELECT * FROM applications WHERE id=?", (application_id,))
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    if row["withdrawn_at"]:
        return {"status": "already_withdrawn", "application_id": application_id}

    now = datetime.datetime.utcnow().isoformat()
    with db.transaction():
        db._get_conn().execute(
            "UPDATE applications SET withdrawn_at=? WHERE id=?", (now, application_id)
        )
    return {"status": "withdrawn", "application_id": application_id}


# ── Fail mode control ─────────────────────────────────────────────────────────
class FailModeRequest(BaseModel):
    mode: str


@app.post("/api/admin/set_fail_mode")
async def set_fail_mode(body: FailModeRequest):
    global _fail_mode, _fail_n_counters
    _fail_mode = body.mode
    _fail_n_counters = {}  # reset counters
    return {"fail_mode": _fail_mode}


# ── HTML pages ─────────────────────────────────────────────────────────────────
@app.get("/portal/apply", response_class=HTMLResponse)
async def portal_apply_page(request: Request):
    return templates.TemplateResponse(request=request, name="apply.html")


@app.get("/portal/status", response_class=HTMLResponse)
async def portal_status_page(request: Request):
    return templates.TemplateResponse(request=request, name="status.html")
