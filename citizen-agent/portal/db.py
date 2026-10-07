"""
portal/db.py  –  Portal database (separate from agent.db)
"""
from __future__ import annotations

import os
import sqlite3
import threading
from contextlib import contextmanager
from typing import Optional

_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(_BASE, "portal.db")

_local = threading.local()


def _get_conn() -> sqlite3.Connection:
    if not hasattr(_local, "conn") or _local.conn is None:
        conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=10)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA busy_timeout=5000")
        _local.conn = conn
    return _local.conn


@contextmanager
def transaction():
    conn = _get_conn()
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


_SCHEMA = """
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    form_json TEXT NOT NULL,
    document_refs TEXT,
    created_at TEXT NOT NULL,
    forced_outcome TEXT,
    rejection_reason TEXT,
    withdrawn_at TEXT
);
CREATE TABLE IF NOT EXISTS portal_documents (
    ref TEXT PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS fail_counters (
    idempotency_key TEXT PRIMARY KEY,
    calls INTEGER NOT NULL
);
"""


def init_db() -> None:
    conn = _get_conn()
    conn.executescript(_SCHEMA)
    conn.commit()
