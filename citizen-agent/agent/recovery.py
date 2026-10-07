"""
agent/recovery.py  –  Layer 3
Retry policy, alternate paths, and escalation triggers.
"""
from __future__ import annotations

import asyncio
import random
from typing import Any, Callable, Coroutine, Optional

import httpx

import agent.audit as audit
import agent.clock as clock
import agent.db as db
from agent.config import settings

# ── Retry constants (PRD 12.1) ────────────────────────────────────────────────
MAX_RETRIES = 3
BASE_BACKOFF = 1.0     # seconds
BUDGET_SECONDS = 30.0  # max total retry time per step

# Retryable status codes
RETRYABLE_STATUS = {408, 429, 500, 502, 503, 504}


class RetryBudgetExhausted(Exception):
    """All retry attempts failed within the budget."""


class PermanentFailure(Exception):
    """HTTP 4xx – do not retry; fix the input or ask the user."""


async def run_with_recovery(
    tool_fn: Callable[..., Coroutine[Any, Any, Any]],
    payload: dict,
    idempotency_key: str,
    session_id: str,
    action: str,
    *,
    ablate: bool = False,
) -> Any:
    """
    Run an async tool function with exponential backoff retries.
    - Retries: transient errors (timeout, 5xx, 429) up to MAX_RETRIES.
    - Never retries HTTP 4xx (permanent failure).
    - Always uses the same idempotency_key on retries.
    - If ABLATE_RECOVERY=1 (benchmark only): single attempt, no retry.
    """
    max_attempts = 1 if ablate else MAX_RETRIES + 1
    start = asyncio.get_event_loop().time()

    last_exc: Exception = RuntimeError("No attempts made")
    for attempt in range(1, max_attempts + 1):
        try:
            result = await tool_fn(payload)
            return result

        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            if status not in RETRYABLE_STATUS:
                # 4xx — permanent; do not retry
                audit.log(
                    session_id, actor="agent", action=f"retry",
                    reason=f"HTTP {status} is permanent; not retrying",
                    result=f"fail_permanent: HTTP {status}",
                )
                raise PermanentFailure(f"HTTP {status}: {exc.response.text[:200]}") from exc
            last_exc = exc

        except (httpx.TimeoutException, httpx.ConnectError, httpx.RemoteProtocolError) as exc:
            last_exc = exc

        except Exception as exc:
            # Unexpected exception — do not retry
            raise

        if attempt <= max_attempts - 1:
            elapsed = asyncio.get_event_loop().time() - start
            remaining = BUDGET_SECONDS - elapsed
            if remaining <= 0:
                break
            delay = min(BASE_BACKOFF * (2 ** (attempt - 1)) + random.uniform(0, 0.3),
                        remaining)
            audit.log(
                session_id, actor="agent", action="retry",
                reason=f"Attempt {attempt} failed: {type(last_exc).__name__}; retrying in {delay:.1f}s",
                result=f"retrying attempt {attempt + 1}",
            )
            await asyncio.sleep(delay)

    audit.log(
        session_id, actor="agent", action="retry",
        reason=f"All {max_attempts} attempts failed",
        result=f"fail: {type(last_exc).__name__}: {last_exc}",
    )
    raise RetryBudgetExhausted(f"All attempts failed: {last_exc}") from last_exc


def should_escalate(
    *,
    retry_count: int = 0,
    doc_rejection_count: int = 0,
    unknown_intent_count: int = 0,
    replan_count: int = 0,
    user_asked_human: bool = False,
    unexpected_exception: bool = False,
) -> Optional[str]:
    """
    Return an escalation reason string if escalation is warranted, else None.
    Uses deterministic rules (PRD Section 12.2 / ARCH Section 10.2).
    """
    if unexpected_exception:
        return "Unexpected exception in the state machine"
    if user_asked_human:
        return "Citizen requested a human helper"
    if retry_count >= MAX_RETRIES:
        return f"Portal call failed after {retry_count} retries"
    if doc_rejection_count >= 3:
        return f"Same document rejected {doc_rejection_count} times"
    if unknown_intent_count >= 3:
        return "Intent unknown after 3 clarification attempts"
    if replan_count > 3:
        return "More than 3 replans for the same step"
    return None


async def escalate(
    session_id: str,
    user_ref: str,
    reason: str,
    retry_count: int,
    detail_shared: bool,
) -> int:
    """Create an escalation record and log it."""
    esc_id = db.create_escalation(
        session_id=session_id,
        user_ref=user_ref,
        reason=reason,
        retry_count=retry_count,
        created_at=clock.now_iso(),
        detail_shared=1 if detail_shared else 0,
    )
    audit.log(
        session_id, actor="agent", action="escalated",
        reason=reason,
        consent_status="yes" if detail_shared else "no",
        result="OPEN",
    )
    return esc_id
