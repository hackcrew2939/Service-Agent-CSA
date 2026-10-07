"""
agent/db.py  –  Layer 1
SQLite connection management, schema creation, and repository functions.
WAL mode, busy timeout, one connection per thread.
"""
from __future__ import annotations

import sqlite3
import os
import threading
from contextlib import contextmanager
from typing import Any, Generator, Optional

# ── Path ──────────────────────────────────────────────────────────────────────
_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(_BASE, "agent.db")

# One connection per thread (SQLite is not thread-safe by default)
_local = threading.local()


def _get_conn() -> sqlite3.Connection:
    if not hasattr(_local, "conn") or _local.conn is None:
        conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=10)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA busy_timeout=5000")
        conn.execute("PRAGMA foreign_keys=ON")
        _local.conn = conn
    return _local.conn


@contextmanager
def transaction(immediate: bool = False) -> Generator[sqlite3.Connection, None, None]:
    conn = _get_conn()
    if immediate:
        conn.execute("BEGIN IMMEDIATE")
    else:
        conn.execute("BEGIN")
    try:
        yield conn
        conn.execute("COMMIT")
    except Exception:
        conn.execute("ROLLBACK")
        raise


def execute(sql: str, params: tuple = ()) -> sqlite3.Cursor:
    return _get_conn().execute(sql, params)


def fetchone(sql: str, params: tuple = ()) -> Optional[sqlite3.Row]:
    return _get_conn().execute(sql, params).fetchone()


def fetchall(sql: str, params: tuple = ()) -> list[sqlite3.Row]:
    return _get_conn().execute(sql, params).fetchall()


# ── Schema ────────────────────────────────────────────────────────────────────

_SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    language TEXT NOT NULL DEFAULT 'en',
    state TEXT NOT NULL DEFAULT 'START',
    service TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    context_json TEXT
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user','agent','helper','system')),
    text TEXT NOT NULL,
    lang TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    slot TEXT NOT NULL,
    file_path TEXT NOT NULL,
    extracted_json TEXT,
    status TEXT,
    reason_code TEXT,
    attempt_no INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consents (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    action TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    data_fields TEXT,
    destination TEXT,
    purpose TEXT,
    language TEXT,
    method TEXT CHECK (method IN ('button','voice',NULL)),
    transcript TEXT,
    confidence REAL,
    status TEXT NOT NULL CHECK (status IN
        ('pending','granted','in_use','denied','revoked','expired','used')),
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    decided_at TEXT,
    audit_row_hash TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    session_id TEXT,
    application_id TEXT,
    actor TEXT NOT NULL CHECK (actor IN ('agent','user','helper','system')),
    action TEXT NOT NULL,
    reason TEXT,
    consent_status TEXT,
    result TEXT,
    payload_summary TEXT,
    prev_hash TEXT NOT NULL,
    row_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_anchor (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hash TEXT NOT NULL,
    count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS escalations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_ref TEXT,
    reason TEXT NOT NULL,
    retry_count INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('OPEN','IN_PROGRESS','RESOLVED')),
    created_at TEXT NOT NULL,
    assigned_helper TEXT,
    resolved_at TEXT,
    notes TEXT,
    detail_shared INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    application_id TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    service TEXT NOT NULL,
    version INTEGER NOT NULL,
    reason TEXT,
    diff_json TEXT,
    created_at TEXT NOT NULL,
    UNIQUE (session_id, version)
);

CREATE TABLE IF NOT EXISTS plan_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    seq INTEGER NOT NULL,
    type TEXT NOT NULL,
    slot TEXT,
    action TEXT,
    status TEXT NOT NULL CHECK (status IN
        ('pending','in_progress','done','failed','blocked','skipped')),
    attempt INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    service_title TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    state TEXT,
    district TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'EXPIRED')),
    txn_ref_id TEXT UNIQUE,
    payment_method TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    paid_at TEXT,
    verification_source TEXT,
    metadata_json TEXT
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    txn_ref_id TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    payer_vpa TEXT,
    status TEXT NOT NULL,
    raw_payload_json TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    phone_verified INTEGER NOT NULL DEFAULT 0,
    full_name TEXT,
    created_at TEXT NOT NULL,
    last_login TEXT
);

CREATE TABLE IF NOT EXISTS otp_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'phone_verify',
    attempts INTEGER NOT NULL DEFAULT 0,
    used INTEGER NOT NULL DEFAULT 0,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""


def init_db() -> None:
    """Create all tables if they don't exist.  Called once at startup."""
    conn = _get_conn()
    conn.executescript(_SCHEMA)
    conn.commit()
    # Ensure the anchor row exists (genesis row for hash chain)
    row = fetchone("SELECT id FROM audit_anchor WHERE id=1")
    if row is None:
        with transaction(immediate=True):
            _get_conn().execute(
                "INSERT INTO audit_anchor (id, hash, count) VALUES (1, 'GENESIS', 0)"
            )


# ── Audit helpers (used only by audit.py) ────────────────────────────────────

def last_row_hash() -> str:
    row = fetchone("SELECT hash FROM audit_anchor WHERE id=1")
    return row["hash"] if row else "GENESIS"


def set_chain_head(new_hash: str) -> None:
    """Update the anchor row.  Must be called inside a BEGIN IMMEDIATE block."""
    _get_conn().execute(
        "UPDATE audit_anchor SET hash=?, count=count+1 WHERE id=1",
        (new_hash,)
    )


def insert_audit_row(row: dict) -> int:
    cur = _get_conn().execute(
        """INSERT INTO audit_log
           (timestamp, session_id, application_id, actor, action, reason,
            consent_status, result, payload_summary, prev_hash, row_hash)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (
            row.get("timestamp"), row.get("session_id"), row.get("application_id"),
            row.get("actor"), row.get("action"), row.get("reason"),
            row.get("consent_status"), row.get("result"), row.get("payload_summary"),
            row.get("prev_hash"), row.get("row_hash"),
        )
    )
    return cur.lastrowid


def all_audit_rows() -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM audit_log ORDER BY id")


def get_chain_head() -> sqlite3.Row:
    return fetchone("SELECT hash, count FROM audit_anchor WHERE id=1")


# ── Session helpers ───────────────────────────────────────────────────────────

def create_session(session_id: str, language: str, created_at: str, service: str | None = None) -> None:
    with transaction():
        _get_conn().execute(
            "INSERT INTO sessions (id, language, state, service, created_at, updated_at) VALUES (?,?,?,?,?,?)",
            (session_id, language, "START", service, created_at, created_at)
        )


def update_session_service(session_id: str, service: str) -> None:
    with transaction():
        _get_conn().execute("UPDATE sessions SET service=? WHERE id=?", (service, session_id))


def update_session_context(session_id: str, ctx: dict) -> None:
    import json
    with transaction():
        _get_conn().execute("UPDATE sessions SET context_json=? WHERE id=?", (json.dumps(ctx, ensure_ascii=False), session_id))


def get_session(session_id: str) -> Optional[sqlite3.Row]:
    return fetchone("SELECT * FROM sessions WHERE id=?", (session_id,))


def update_session_state(session_id: str, state: str, updated_at: str,
                          context_json: str | None = None,
                          service: str | None = None) -> None:
    with transaction():
        if context_json is not None and service is not None:
            _get_conn().execute(
                "UPDATE sessions SET state=?, updated_at=?, context_json=?, service=? WHERE id=?",
                (state, updated_at, context_json, service, session_id)
            )
        elif context_json is not None:
            _get_conn().execute(
                "UPDATE sessions SET state=?, updated_at=?, context_json=? WHERE id=?",
                (state, updated_at, context_json, session_id)
            )
        else:
            _get_conn().execute(
                "UPDATE sessions SET state=?, updated_at=? WHERE id=?",
                (state, updated_at, session_id)
            )


# ── Message helpers ───────────────────────────────────────────────────────────

def add_message(session_id: str, role: str, text: str, lang: str, created_at: str) -> None:
    with transaction():
        _get_conn().execute(
            "INSERT INTO messages (session_id, role, text, lang, created_at) VALUES (?,?,?,?,?)",
            (session_id, role, text, lang, created_at)
        )


def get_messages(session_id: str) -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM messages WHERE session_id=? ORDER BY id", (session_id,))


# ── Document helpers ──────────────────────────────────────────────────────────

def upsert_document(session_id: str, slot: str, file_path: str,
                    extracted_json: str, status: str, reason_code: str,
                    attempt_no: int, created_at: str) -> int:
    with transaction():
        cur = _get_conn().execute(
            """INSERT INTO documents
               (session_id, slot, file_path, extracted_json, status, reason_code, attempt_no, created_at)
               VALUES (?,?,?,?,?,?,?,?)""",
            (session_id, slot, file_path, extracted_json, status, reason_code, attempt_no, created_at)
        )
        return cur.lastrowid


def get_documents(session_id: str) -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM documents WHERE session_id=? ORDER BY id", (session_id,))


def get_latest_document(session_id: str, slot: str) -> Optional[sqlite3.Row]:
    return fetchone(
        "SELECT * FROM documents WHERE session_id=? AND slot=? ORDER BY attempt_no DESC LIMIT 1",
        (session_id, slot)
    )


def count_document_attempts(session_id: str, slot: str) -> int:
    row = fetchone(
        "SELECT COUNT(*) as cnt FROM documents WHERE session_id=? AND slot=?",
        (session_id, slot)
    )
    return row["cnt"] if row else 0


# ── Consent helpers ───────────────────────────────────────────────────────────

def create_consent_request(consent_id: str, session_id: str, action: str,
                            payload_json: str, payload_hash: str,
                            data_fields: str, destination: str, purpose: str,
                            language: str, expires_at: str, created_at: str) -> None:
    with transaction():
        _get_conn().execute(
            """INSERT INTO consents
               (id, session_id, action, payload_json, payload_hash, data_fields,
                destination, purpose, language, status, expires_at, created_at)
               VALUES (?,?,?,?,?,?,?,?,?,'pending',?,?)""",
            (consent_id, session_id, action, payload_json, payload_hash,
             data_fields, destination, purpose, language, expires_at, created_at)
        )


def reserve_consent(session_id: str, action: str, phash: str, now_iso: str) -> Optional[sqlite3.Row]:
    """
    Atomic compare-and-set: granted -> in_use.
    Returns the consent row if reserved, else None.
    """
    conn = _get_conn()
    # Must be inside a BEGIN IMMEDIATE block for true atomicity
    cur = conn.execute(
        """UPDATE consents SET status='in_use'
           WHERE session_id=? AND action=? AND payload_hash=?
             AND status='granted' AND expires_at > ?""",
        (session_id, action, phash, now_iso)
    )
    if cur.rowcount == 0:
        return None
    return fetchone(
        "SELECT * FROM consents WHERE session_id=? AND action=? AND payload_hash=? AND status='in_use'",
        (session_id, action, phash)
    )


def decide_consent(consent_id: str, decision: str, method: str,
                   decided_at: str, transcript: str | None = None,
                   confidence: float | None = None) -> bool:
    """
    Atomic compare-and-set: pending -> granted|denied.
    Returns True if the update succeeded (no double-click possible).
    """
    new_status = "granted" if decision == "yes" else "denied"
    conn = _get_conn()
    with transaction(immediate=True):
        cur = conn.execute(
            """UPDATE consents SET status=?, method=?, decided_at=?,
                   transcript=?, confidence=?
               WHERE id=? AND status='pending'""",
            (new_status, method, decided_at, transcript, confidence, consent_id)
        )
        return cur.rowcount > 0


def mark_consent_used(consent_id: str) -> None:
    with transaction():
        _get_conn().execute(
            "UPDATE consents SET status='used' WHERE id=?", (consent_id,)
        )


def release_consent(consent_id: str) -> None:
    with transaction():
        _get_conn().execute(
            "UPDATE consents SET status='granted' WHERE id=? AND status='in_use'",
            (consent_id,)
        )


def revoke_consent(consent_id: str, session_id: str, decided_at: str) -> bool:
    conn = _get_conn()
    with transaction(immediate=True):
        cur = conn.execute(
            """UPDATE consents SET status='revoked', decided_at=?
               WHERE id=? AND session_id=? AND status IN ('pending','granted')""",
            (decided_at, consent_id, session_id)
        )
        return cur.rowcount > 0


def get_pending_consent(session_id: str) -> Optional[sqlite3.Row]:
    return fetchone(
        "SELECT * FROM consents WHERE session_id=? AND status='pending' ORDER BY created_at DESC LIMIT 1",
        (session_id,)
    )


def get_consent(consent_id: str) -> Optional[sqlite3.Row]:
    return fetchone("SELECT * FROM consents WHERE id=?", (consent_id,))


def get_consents(session_id: str) -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM consents WHERE session_id=? ORDER BY created_at", (session_id,))


def sweep_stale_in_use_consents(threshold_iso: str) -> int:
    """Release consents stuck in 'in_use' for more than 2 minutes.  Called at startup."""
    with transaction(immediate=True):
        cur = _get_conn().execute(
            "UPDATE consents SET status='granted' WHERE status='in_use' AND created_at < ?",
            (threshold_iso,)
        )
        return cur.rowcount


# ── Submission (write-ahead) helpers ──────────────────────────────────────────

def write_ahead_submission(session_id: str, idempotency_key: str, created_at: str) -> None:
    with transaction():
        _get_conn().execute(
            """INSERT OR IGNORE INTO submissions
               (session_id, idempotency_key, status, created_at)
               VALUES (?,?,'pending',?)""",
            (session_id, idempotency_key, created_at)
        )


def update_submission(idempotency_key: str, application_id: str, status: str) -> None:
    with transaction():
        _get_conn().execute(
            "UPDATE submissions SET application_id=?, status=? WHERE idempotency_key=?",
            (application_id, status, idempotency_key)
        )


def get_submission(idempotency_key: str) -> Optional[sqlite3.Row]:
    return fetchone("SELECT * FROM submissions WHERE idempotency_key=?", (idempotency_key,))


# ── Escalation helpers ────────────────────────────────────────────────────────

def create_escalation(session_id: str, user_ref: str, reason: str,
                       retry_count: int, created_at: str,
                       detail_shared: int = 0) -> int:
    with transaction():
        cur = _get_conn().execute(
            """INSERT INTO escalations
               (session_id, user_ref, reason, retry_count, status, created_at, detail_shared)
               VALUES (?,?,?,?,'OPEN',?,?)""",
            (session_id, user_ref, reason, retry_count, created_at, detail_shared)
        )
        return cur.lastrowid


def get_escalation(escalation_id: int) -> Optional[sqlite3.Row]:
    return fetchone("SELECT * FROM escalations WHERE id=?", (escalation_id,))


def get_all_escalations() -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM escalations ORDER BY created_at DESC")


def update_escalation(escalation_id: int, status: str, assigned_helper: str | None = None,
                       resolved_at: str | None = None, notes: str | None = None) -> None:
    with transaction():
        _get_conn().execute(
            """UPDATE escalations SET status=?, assigned_helper=COALESCE(?,assigned_helper),
               resolved_at=COALESCE(?,resolved_at), notes=COALESCE(?,notes) WHERE id=?""",
            (status, assigned_helper, resolved_at, notes, escalation_id)
        )


# ── Plan helpers ──────────────────────────────────────────────────────────────

def create_plan(session_id: str, service: str, version: int,
                reason: str, diff_json: str, created_at: str) -> int:
    with transaction():
        cur = _get_conn().execute(
            """INSERT INTO plans (session_id, service, version, reason, diff_json, created_at)
               VALUES (?,?,?,?,?,?)""",
            (session_id, service, version, reason, diff_json, created_at)
        )
        return cur.lastrowid


def add_plan_steps(plan_id: int, steps: list[dict], updated_at: str) -> None:
    with transaction():
        for step in steps:
            _get_conn().execute(
                """INSERT INTO plan_steps (plan_id, seq, type, slot, action, status, attempt, updated_at)
                   VALUES (?,?,?,?,?,?,0,?)""",
                (plan_id, step["seq"], step["type"], step.get("slot"),
                 step.get("action"), step.get("status", "pending"), updated_at)
            )


def get_plan_steps(plan_id: int) -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM plan_steps WHERE plan_id=? ORDER BY seq", (plan_id,))


def get_latest_plan(session_id: str) -> Optional[sqlite3.Row]:
    return fetchone(
        "SELECT * FROM plans WHERE session_id=? ORDER BY version DESC LIMIT 1",
        (session_id,)
    )


def update_plan_step_status(step_id: int, status: str, updated_at: str) -> None:
    with transaction():
        _get_conn().execute(
            "UPDATE plan_steps SET status=?, updated_at=?, attempt=attempt+1 WHERE id=?",
            (status, updated_at, step_id)
        )


# ── Payment & Order helpers ───────────────────────────────────────────────────

def create_order(
    order_id: str,
    service_id: str,
    service_title: str,
    amount: float,
    customer_name: str | None,
    customer_email: str | None,
    customer_phone: str | None,
    state: str | None,
    district: str | None,
    created_at: str,
    payment_method: str = "UPI_QR",
    metadata_json: str | None = None,
) -> None:
    with transaction():
        _get_conn().execute(
            """INSERT INTO orders
               (id, service_id, service_title, amount, currency, customer_name,
                customer_email, customer_phone, state, district, status, payment_method,
                created_at, updated_at, metadata_json)
               VALUES (?, ?, ?, ?, 'INR', ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?)""",
            (
                order_id, service_id, service_title, amount, customer_name,
                customer_email, customer_phone, state, district, payment_method,
                created_at, created_at, metadata_json
            )
        )


def get_order(order_id: str) -> Optional[sqlite3.Row]:
    return fetchone("SELECT * FROM orders WHERE id=?", (order_id,))


def get_order_by_txn_ref(txn_ref_id: str) -> Optional[sqlite3.Row]:
    return fetchone("SELECT * FROM orders WHERE txn_ref_id=?", (txn_ref_id,))


def update_order_payment_status(
    order_id: str,
    status: str,
    txn_ref_id: str | None = None,
    paid_at: str | None = None,
    verification_source: str | None = None,
    updated_at: str | None = None,
) -> bool:
    with transaction():
        cur = _get_conn().execute(
            """UPDATE orders
               SET status=?,
                   txn_ref_id=COALESCE(?, txn_ref_id),
                   paid_at=COALESCE(?, paid_at),
                   verification_source=COALESCE(?, verification_source),
                   updated_at=?
               WHERE id=?""",
            (status, txn_ref_id, paid_at, verification_source, updated_at, order_id)
        )
        return cur.rowcount > 0


def record_payment_transaction(
    order_id: str,
    txn_ref_id: str,
    amount: float,
    payer_vpa: str | None,
    status: str,
    raw_payload_json: str | None,
    created_at: str,
) -> int:
    with transaction():
        cur = _get_conn().execute(
            """INSERT INTO payment_transactions
               (order_id, txn_ref_id, amount, payer_vpa, status, raw_payload_json, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (order_id, txn_ref_id, amount, payer_vpa, status, raw_payload_json, created_at)
        )
        return cur.lastrowid


def list_recent_orders(limit: int = 20) -> list[sqlite3.Row]:
    return fetchall("SELECT * FROM orders ORDER BY created_at DESC LIMIT ?", (limit,))

