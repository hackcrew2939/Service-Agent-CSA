"""
agent/clock.py  –  Layer 0
Single injectable source of time.  Tests freeze it; production uses real UTC.
"""
from __future__ import annotations

import datetime
from typing import Optional


_frozen_date: Optional[datetime.date] = None
_frozen_dt: Optional[datetime.datetime] = None


def freeze(dt: datetime.datetime) -> None:
    """Freeze the clock to *dt* (UTC).  Call reset() to unfreeze."""
    global _frozen_date, _frozen_dt
    _frozen_dt = dt.replace(tzinfo=datetime.timezone.utc) if dt.tzinfo is None else dt
    _frozen_date = _frozen_dt.date()


def reset() -> None:
    """Unfreeze the clock."""
    global _frozen_date, _frozen_dt
    _frozen_date = None
    _frozen_dt = None


def now() -> datetime.datetime:
    """UTC datetime, possibly frozen for tests."""
    if _frozen_dt is not None:
        return _frozen_dt
    return datetime.datetime.now(datetime.timezone.utc)


def now_iso() -> str:
    """UTC ISO-8601 string suitable for database storage."""
    return now().isoformat()


def today() -> datetime.date:
    """UTC date, possibly frozen for tests."""
    if _frozen_date is not None:
        return _frozen_date
    return datetime.datetime.now(datetime.timezone.utc).date()


def from_env() -> None:
    """
    If REFERENCE_DATE env var is set, freeze the clock to that date at midnight UTC.
    Called once from main.py and portal main.py on startup.
    """
    import os
    rd = os.getenv("REFERENCE_DATE", "").strip()
    if rd:
        try:
            d = datetime.date.fromisoformat(rd)
            freeze(datetime.datetime(d.year, d.month, d.day, tzinfo=datetime.timezone.utc))
        except ValueError:
            pass  # silently ignore bad dates; real clock is used
