"""
agent/audit.py  –  Layer 1
Hash-chained, append-only audit log.
IMPORTANT: This module MUST NOT import llm.py (enforced by test_architecture.py).
"""
from __future__ import annotations

from typing import Any, Optional

import agent.clock as clock
import agent.db as db
import agent.util as util

# ── Fields included in the hash chain ─────────────────────────────────────────
HASHED_FIELDS = [
    "timestamp", "session_id", "application_id", "actor", "action",
    "reason", "consent_status", "result", "payload_summary", "prev_hash",
]


def compute_hash(row: dict) -> str:
    """SHA-256 of the canonical JSON of the HASHED_FIELDS (id is NOT hashed)."""
    data = {k: row.get(k) for k in HASHED_FIELDS}
    return util.sha256_hex(util.canonical(data))


def append(row: dict) -> int:
    """
    Append one row to the audit log with a hash chain.
    Uses BEGIN IMMEDIATE so only one writer can update the chain at a time.
    Returns the row id assigned by the database.
    """
    with db.transaction(immediate=True):
        prev = db.last_row_hash()
        row["timestamp"] = clock.now_iso()
        row["prev_hash"] = prev
        row["row_hash"] = compute_hash(row)
        row_id = db.insert_audit_row(row)
        db.set_chain_head(row["row_hash"])
    return row_id


def log(
    session_id: str,
    actor: str,
    action: str,
    *,
    application_id: str | None = None,
    reason: str | None = None,
    consent_status: str | None = None,
    result: str | None = None,
    payload_summary: Any = None,
) -> int:
    """Convenience wrapper for the most common call pattern."""
    if isinstance(payload_summary, dict):
        payload_summary = util.canonical(util.mask(payload_summary))
    row = {
        "session_id": session_id,
        "application_id": application_id,
        "actor": actor,
        "action": action,
        "reason": reason,
        "consent_status": consent_status,
        "result": result,
        "payload_summary": payload_summary,
    }
    return append(row)


def verify_chain() -> tuple[bool, Any]:
    """
    Walk every audit_log row in id order, recompute hashes, check continuity.
    Also checks the anchor (detects deleted tail rows).
    Returns (ok: bool, detail: None | int | str).
    """
    prev = "GENESIS"
    count = 0
    for row in db.all_audit_rows():
        row_dict = dict(row)
        expected_hash = compute_hash(row_dict)
        if row_dict["prev_hash"] != prev or expected_hash != row_dict["row_hash"]:
            return False, row_dict["id"]
        prev = row_dict["row_hash"]
        count += 1
    head = db.get_chain_head()
    if head is None:
        return count == 0, None
    if head["hash"] != prev or head["count"] != count:
        return False, "log truncated or head mismatch"
    return True, None
