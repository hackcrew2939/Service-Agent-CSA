"""
agent/routes/cases.py – Case accountability report endpoint
"""
from __future__ import annotations

import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import HTMLResponse

from agent import audit, clock, db

router = APIRouter()


@router.get("/cases/{session_id}/report")
async def get_case_report(
    session_id: str,
    format: str = Query("json", description="'json' or 'html'"),
):
    session = db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get case details
    messages = [dict(m) for m in db.get_messages(session_id)]
    documents = [dict(d) for d in db.get_documents(session_id)]
    consents = [dict(c) for c in db.fetchall(
        "SELECT * FROM consents WHERE session_id=? ORDER BY created_at ASC", (session_id,)
    )]
    audit_entries = [dict(a) for a in db.fetchall(
        "SELECT * FROM audit_log WHERE session_id=? ORDER BY id ASC", (session_id,)
    )]
    
    # Audit verification
    chain_valid, broken_row = audit.verify_chain()
    head = db.get_chain_head()
    
    report_data = {
        "session_id": session_id,
        "service": session["service"],
        "state": session["state"],
        "language": session["language"],
        "created_at": session["created_at"],
        "updated_at": session["updated_at"],
        "chain_head_hash": head["hash"] if head else "GENESIS",
        "audit_chain_valid": chain_valid,
        "tamper_detected_row": broken_row,
        "consents": consents,
        "documents": documents,
        "messages": messages,
        "audit_log": audit_entries,
        "generated_at": clock.now_iso(),
    }

    if format == "html":
        # Generate clean HTML accountability report
        rows_html = "".join([
            f"<tr><td>{a['id']}</td><td>{a['timestamp']}</td><td>{a['actor']}</td>"
            f"<td><b>{a['action']}</b></td><td>{a['reason'] or ''}</td>"
            f"<td>{a['consent_status'] or ''}</td><td>{a['result'] or ''}</td>"
            f"<td><code>{a['row_hash'][:16]}...</code></td></tr>"
            for a in audit_entries
        ])

        consents_html = "".join([
            f"<tr><td>{c['id'][:8]}...</td><td>{c['action']}</td><td>{c['status']}</td>"
            f"<td>{c['method'] or ''}</td><td>{c['created_at']}</td><td>{c['destination'] or ''}</td></tr>"
            for c in consents
        ])

        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Case Accountability Report: {session_id}</title>
    <meta charset="utf-8">
    <style>
        body {{ font-family: system-ui, -apple-system, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }}
        h1, h2, h3 {{ color: #0f172a; }}
        .badge {{ display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }}
        .badge-valid {{ background: #dcfce7; color: #15803d; }}
        .badge-invalid {{ background: #fee2e2; color: #b91c1c; }}
        table {{ border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 13px; }}
        th, td {{ border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }}
        th {{ background: #f8fafc; font-weight: 600; }}
        .meta-box {{ background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px; }}
    </style>
</head>
<body>
    <h1>Citizen-Service Case Accountability Report</h1>
    <div class="meta-box">
        <p><strong>Session ID:</strong> {session_id}</p>
        <p><strong>Service:</strong> {session['service']} | <strong>Status:</strong> {session['state']} | <strong>Language:</strong> {session['language']}</p>
        <p><strong>Chain Head Hash:</strong> <code>{head['hash'] if head else 'GENESIS'}</code></p>
        <p><strong>Audit Log Integrity:</strong> <span class="badge {'badge-valid' if chain_valid else 'badge-invalid'}">{'VALID / TAMPER-FREE' if chain_valid else f'TAMPER DETECTED AT ROW {broken_row}'}</span></p>
        <p><strong>Generated UTC:</strong> {clock.now_iso()}</p>
    </div>

    <h2>Consent Receipts</h2>
    <table>
        <thead>
            <tr><th>Consent ID</th><th>Action</th><th>Status</th><th>Method</th><th>Created</th><th>Destination</th></tr>
        </thead>
        <tbody>{consents_html or '<tr><td colspan="6">No consent records</td></tr>'}</tbody>
    </table>

    <h2>Audit Trail (Hash Chained)</h2>
    <table>
        <thead>
            <tr><th>#</th><th>Timestamp</th><th>Actor</th><th>Action</th><th>Reason</th><th>Consent</th><th>Result</th><th>Row Hash</th></tr>
        </thead>
        <tbody>{rows_html or '<tr><td colspan="8">No audit logs</td></tr>'}</tbody>
    </table>
</body>
</html>"""
        return HTMLResponse(content=html_content)

    return report_data
