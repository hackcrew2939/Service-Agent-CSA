"""
agent/plan.py  –  Layer 4
Plan creation, replanning, and invariant validation.
Plans are generated from service templates (deterministic code, not LLM).
"""
from __future__ import annotations

import json
import os
from copy import deepcopy
from typing import Any, Optional

import agent.audit as audit
import agent.clock as clock
import agent.db as db

_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_SERVICES_PATH = os.path.join(_BASE, "data", "services.json")

# Step types allowed in a plan
ALLOWED_STEP_TYPES = {
    "collect_document", "recollect_document", "confirm_name",
    "validate_all", "data_review", "consent", "submit_form",
    "track_status", "fix_issue", "wait_and_retry", "escalate",
}

# ── Invariants (PRD Section 13.4) ─────────────────────────────────────────────
# 1. A consent step always precedes its sensitive step.
# 2. validate_all precedes submit_form.
# 3. No consent or validation step may be removed or skipped.

def _load_template(service: str) -> list[dict]:
    with open(_SERVICES_PATH, encoding="utf-8") as f:
        cfg = json.load(f)
    return cfg[service]["plan_template"]


def create_plan(session_id: str, service: str) -> dict:
    """
    Create a fresh plan from the service template.
    Persists to DB and logs plan_created.
    Returns the plan dict.
    """
    template = _load_template(service)
    steps = [
        {
            "seq": s["seq"],
            "type": s["type"],
            "slot": s.get("slot"),
            "action": s.get("action"),
            "status": "pending",
        }
        for s in template
    ]

    plan_id = db.create_plan(
        session_id=session_id,
        service=service,
        version=1,
        reason="Initial plan created from service template",
        diff_json="[]",
        created_at=clock.now_iso(),
    )
    db.add_plan_steps(plan_id, steps, clock.now_iso())
    audit.log(
        session_id, actor="agent", action="plan_created",
        reason=f"New plan for {service}",
    )
    return {"plan_id": plan_id, "version": 1, "service": service, "steps": steps}


def get_current_plan(session_id: str) -> Optional[dict]:
    """Return the latest plan for a session, or None."""
    plan_row = db.get_latest_plan(session_id)
    if plan_row is None:
        return None
    steps = [dict(s) for s in db.get_plan_steps(plan_row["id"])]
    return {
        "plan_id": plan_row["id"],
        "version": plan_row["version"],
        "service": plan_row["service"],
        "steps": steps,
    }


def validate_plan(steps: list[dict]) -> tuple[bool, str]:
    """
    Check that all plan invariants hold.
    Returns (ok, reason).
    """
    has_consent_share = False
    has_consent_submit = False
    has_validate_all = False
    has_submit_form = False

    for s in steps:
        t = s["type"]
        if t not in ALLOWED_STEP_TYPES:
            return False, f"Unknown step type: {t}"
        if t == "consent" and s.get("action") == "share_document":
            has_consent_share = True
        if t == "consent" and s.get("action") == "submit_form":
            has_consent_submit = True
        if t == "validate_all":
            has_validate_all = True
        if t == "submit_form":
            has_submit_form = True

    if has_submit_form and not has_validate_all:
        return False, "validate_all must precede submit_form"
    if has_submit_form and not has_consent_submit:
        return False, "consent(submit_form) must precede submit_form"

    # Check ordering: consent must come before its sensitive step
    step_types_ordered = [s["type"] for s in steps if s["status"] not in ("done", "skipped")]
    action_map = {s.get("action"): s["seq"] for s in steps if s.get("action")}

    for s in steps:
        if s["type"] == "submit_form":
            consent_seq = action_map.get("submit_form", 0)
            if consent_seq >= s["seq"]:
                return False, "consent(submit_form) must appear before submit_form step"

    return True, "OK"


def replan(
    session_id: str,
    trigger: str,
    context: dict,
    current_plan: dict,
) -> dict:
    """
    Apply deterministic replan rules, then persist the new plan version.
    Returns the new plan dict.

    trigger values:
      document_rejected   context: {slot, attempt}
      name_similar        context: {slot}
      consent_denied      context: {action}
      portal_failure      context: {retry_count}
      portal_rejected     context: {reason}
      language_change     context: {new_lang}
      crash_resume        context: {}
    """
    steps = deepcopy(current_plan["steps"])
    old_version = current_plan["version"]
    diff: list[dict] = []

    if trigger == "document_rejected":
        slot = context.get("slot")
        attempt = context.get("attempt", 1)
        # Insert a recollect_document step after the last failed collect step
        max_seq = max(s["seq"] for s in steps)
        new_step = {
            "seq": max_seq + 1,
            "type": "recollect_document",
            "slot": slot,
            "action": None,
            "status": "pending",
        }
        # Re-number: insert before validate_all
        _insert_before_type(steps, "validate_all", new_step)
        diff.append({"added": new_step, "reason": f"Document {slot} rejected (attempt {attempt})"})

    elif trigger == "name_similar":
        slot = context.get("slot")
        new_step = {
            "seq": 0,
            "type": "confirm_name",
            "slot": slot,
            "action": None,
            "status": "pending",
        }
        _insert_before_type(steps, "validate_all", new_step)
        diff.append({"added": new_step, "reason": f"Name similar on {slot}; needs confirmation"})

    elif trigger == "consent_denied":
        action = context.get("action", "")
        # Mark all dependent steps as blocked
        blocking = {"share_document": ["submit_form"], "submit_form": []}.get(action, [])
        for s in steps:
            if s["type"] in blocking or (s["type"] == "consent" and s.get("action") == action):
                s["status"] = "blocked"
                diff.append({"blocked": s["type"], "reason": f"Consent denied for {action}"})

    elif trigger == "portal_failure":
        retry_count = context.get("retry_count", 1)
        new_step = {
            "seq": 0,
            "type": "wait_and_retry",
            "slot": None,
            "action": None,
            "status": "pending",
        }
        _insert_before_type(steps, "submit_form", new_step)
        diff.append({"added": new_step, "reason": f"Portal failure after {retry_count} retries"})

    elif trigger == "portal_rejected":
        reason = context.get("reason", "unknown")
        new_steps = [
            {"seq": 0, "type": "fix_issue", "slot": None, "action": None, "status": "pending"},
            {"seq": 0, "type": "consent", "slot": None, "action": "reapply", "status": "pending"},
            {"seq": 0, "type": "submit_form", "slot": None, "action": None, "status": "pending"},
        ]
        for ns in new_steps:
            steps.append(ns)
            diff.append({"added": ns, "reason": f"Portal rejected: {reason}"})

    elif trigger == "crash_resume":
        # Keep steps as-is; just log the replan
        diff.append({"reason": "Resumed after crash; continuing from last non-done step"})

    # Renumber sequences
    _renumber(steps)

    # Validate invariants
    ok, msg = validate_plan(steps)
    if not ok:
        # Reject the edit; return the old plan unchanged
        audit.log(
            session_id, actor="agent", action="plan_replanned",
            reason=f"Replan for {trigger} rejected: invariant violated: {msg}",
            result="rejected",
        )
        return current_plan

    new_version = old_version + 1
    plan_id = db.create_plan(
        session_id=session_id,
        service=current_plan["service"],
        version=new_version,
        reason=f"Replan triggered by: {trigger}",
        diff_json=json.dumps(diff, ensure_ascii=False),
        created_at=clock.now_iso(),
    )
    db.add_plan_steps(plan_id, steps, clock.now_iso())
    audit.log(
        session_id, actor="agent", action="plan_replanned",
        reason=f"Replan: {trigger}",
        result=f"new version {new_version}",
    )
    return {"plan_id": plan_id, "version": new_version,
            "service": current_plan["service"], "steps": steps}


def _insert_before_type(steps: list[dict], before_type: str, new_step: dict) -> None:
    """Insert new_step before the first step of before_type, or append if not found."""
    for i, s in enumerate(steps):
        if s["type"] == before_type and s["status"] not in ("done", "skipped"):
            steps.insert(i, new_step)
            return
    steps.append(new_step)


def _renumber(steps: list[dict]) -> None:
    for i, s in enumerate(steps, start=1):
        s["seq"] = i


def next_pending_step(plan: dict) -> Optional[dict]:
    """Return the first step that is not done/blocked/skipped."""
    for s in plan["steps"]:
        if s["status"] in ("pending", "in_progress"):
            return s
    return None


def mark_step_done(session_id: str, plan_id: int, step_id: int) -> None:
    db.update_plan_step_status(step_id, "done", clock.now_iso())


def mark_step_failed(session_id: str, plan_id: int, step_id: int) -> None:
    db.update_plan_step_status(step_id, "failed", clock.now_iso())
