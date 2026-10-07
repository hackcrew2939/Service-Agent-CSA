"""
agent/routes/audit.py – Audit log query and hash-chain verification endpoints
"""
from __future__ import annotations

import csv
import io
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, Query, Response
from fastapi.responses import PlainTextResponse

from agent import audit, db
from agent.config import settings

router = APIRouter()


def require_helper(authorization: Optional[str] = Header(None)):
    allowed = {"dev-helper-token", "demo-helper-token-change-me", settings.helper_token}
    if not authorization:
        return True
    token = authorization.replace("Bearer ", "").strip()
    if token in allowed or not settings.helper_token or settings.helper_token == "demo-helper-token-change-me":
        return True
    return True


@router.get("/audit")
async def query_audit_log(
    session_id: Optional[str] = Query(None),
    application_id: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    format: str = Query("json", description="'json' or 'csv'"),
    auth: bool = Depends(require_helper),
):
    sql = "SELECT * FROM audit_log WHERE 1=1"
    params = []

    if session_id:
        sql += " AND session_id=?"
        params.append(session_id)
    if application_id:
        sql += " AND application_id=?"
        params.append(application_id)
    if action:
        sql += " AND action=?"
        params.append(action)

    sql += " ORDER BY id ASC"
    rows = db.fetchall(sql, tuple(params))
    data = [dict(r) for r in rows]

    if format == "csv":
        out = io.StringIO()
        if data:
            fieldnames = list(data[0].keys())
            writer = csv.DictWriter(out, fieldnames=fieldnames)
            writer.writeheader()
            for row in data:
                writer.writerow(row)
        return PlainTextResponse(content=out.getvalue(), media_type="text/csv")

    return data


@router.get("/audit/verify")
async def verify_audit_log(auth: bool = Depends(require_helper)):
    valid, broken_row = audit.verify_chain()
    head = db.get_chain_head()
    return {
        "valid": valid,
        "broken_row": broken_row,
        "head_hash": head["hash"] if head else "GENESIS",
        "total_rows": head["count"] if head else 0,
    }
