"""
agent/main.py – Citizen-Service Agent FastAPI backend (port 8000)
"""
from __future__ import annotations

import datetime
import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import httpx

from agent import clock, db
from agent.config import settings
from agent.routes import (
    audit as audit_router,
    auth as auth_router,
    cases as cases_router,
    chat as chat_router,
    consent as consent_router,
    documents as documents_router,
    escalations as escalations_router,
    payments as payments_router,
    session as session_router,
    stt as stt_router,
)

logger = logging.getLogger("agent")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB_DIR = os.path.join(_BASE, "web")
DASHBOARD_DIR = os.path.join(_BASE, "dashboard")


async def run_recovery_sweep():
    """Startup sweep: release consents stuck in in_use for > 2 min back to granted."""
    try:
        now_dt = clock.now()
        threshold = (now_dt - datetime.timedelta(minutes=2)).isoformat()
        with db.transaction():
            db.execute(
                "UPDATE consents SET status='granted' WHERE status='in_use' AND created_at < ?",
                (threshold,),
            )
        logger.info("Startup recovery sweep completed successfully.")
    except Exception as exc:
        logger.error(f"Recovery sweep error: {exc}")


async def check_portal_health():
    """Verify portal connection if TEST_MODE is not 1."""
    if settings.test_mode:
        return
    url = f"{settings.portal_base_url}/api/health"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                logger.info(f"Connected to mock portal at {settings.portal_base_url}")
                return
    except Exception as exc:
        logger.warning(
            f"Portal at {settings.portal_base_url} is unreachable ({exc}). Agent starting in standalone mode."
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.init_db()
    await run_recovery_sweep()
    await check_portal_health()
    yield
    # Shutdown
    logger.info("Agent backend shutting down.")


app = FastAPI(
    title="Citizen-Service Agent Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(auth_router.router, prefix="/api", tags=["Auth"])
app.include_router(session_router.router, prefix="/api", tags=["Session"])
app.include_router(chat_router.router, prefix="/api", tags=["Chat"])
app.include_router(documents_router.router, prefix="/api", tags=["Documents"])
app.include_router(consent_router.router, prefix="/api", tags=["Consent"])
app.include_router(cases_router.router, prefix="/api", tags=["Cases"])
app.include_router(audit_router.router, prefix="/api", tags=["Audit"])
app.include_router(escalations_router.router, prefix="/api", tags=["Escalations"])
app.include_router(stt_router.router, prefix="/api", tags=["STT"])
app.include_router(payments_router.router, prefix="/api", tags=["Payments"])


# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": clock.now_iso(), "version": "1.0.0"}


# Mount Document page explicitly
@app.get("/documents")
async def documents_page():
    doc_path = os.path.join(WEB_DIR, "documents.html")
    if os.path.exists(doc_path):
        return FileResponse(doc_path)
    return JSONResponse(status_code=404, content={"error": "Documents page not found"})


# Mount Dashboard explicitly
@app.get("/dashboard")
async def dashboard_page():
    dash_path = os.path.join(DASHBOARD_DIR, "index.html")
    if os.path.exists(dash_path):
        return FileResponse(dash_path)
    return JSONResponse(status_code=404, content={"error": "Dashboard page not found"})


# Mount static assets
if os.path.exists(DASHBOARD_DIR):
    app.mount("/dashboard-static", StaticFiles(directory=DASHBOARD_DIR), name="dashboard-static")

if os.path.exists(WEB_DIR):
    app.mount("/", StaticFiles(directory=WEB_DIR, html=True), name="web")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("agent.main:app", host="0.0.0.0", port=8000, reload=True)
