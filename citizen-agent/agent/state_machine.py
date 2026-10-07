"""
agent/state_machine.py  –  Layer 5
The agent state machine: drives plan execution, consent waits, recovery, escalation.
State is persisted after every transition.
"""
from __future__ import annotations

import asyncio
import json
from typing import Any, Optional

import agent.audit as audit
import agent.clock as clock
import agent.db as db
import agent.llm as llm
import agent.plan as plan_mod
import agent.recovery as recovery
import agent.tools as tools
import agent.util as util
from agent.consent import (
    ConsentRequired, SENSITIVE_ACTIONS, execute_action
)
from agent.config import settings
from agent.i18n import t, slot_label, reason_message

# ── State constants ───────────────────────────────────────────────────────────
class State:
    START = "START"
    INTENT_UNDERSTOOD = "INTENT_UNDERSTOOD"
    REQUIREMENTS_EXPLAINED = "REQUIREMENTS_EXPLAINED"
    COLLECTING_DOCUMENTS = "COLLECTING_DOCUMENTS"
    VALIDATING_DOCUMENTS = "VALIDATING_DOCUMENTS"
    DATA_REVIEW = "DATA_REVIEW"
    AWAITING_CONSENT_SHARE = "AWAITING_CONSENT_SHARE"
    FORM_FILLING = "FORM_FILLING"
    AWAITING_CONSENT_SUBMIT = "AWAITING_CONSENT_SUBMIT"
    SUBMITTING = "SUBMITTING"
    TRACKING_STATUS = "TRACKING_STATUS"
    COMPLETED = "COMPLETED"
    REJECTED_BY_PORTAL = "REJECTED_BY_PORTAL"
    ESCALATED = "ESCALATED"
    WITHDRAWN = "WITHDRAWN"
    CANCELLED = "CANCELLED"
    AWAITING_CONSENT = "AWAITING_CONSENT"  # generic


TERMINAL_STATES = {
    State.COMPLETED, State.ESCALATED, State.WITHDRAWN, State.CANCELLED
}


# ── SSE broadcast queue (session_id -> asyncio.Queue) ─────────────────────────
_SSE_QUEUES: dict[str, asyncio.Queue] = {}


def get_or_create_queue(session_id: str) -> asyncio.Queue:
    if session_id not in _SSE_QUEUES:
        _SSE_QUEUES[session_id] = asyncio.Queue()
    return _SSE_QUEUES[session_id]


async def push_event(session_id: str, event_type: str, data: dict) -> None:
    q = get_or_create_queue(session_id)
    await q.put({"type": event_type, "data": data})


# ── Context helpers ────────────────────────────────────────────────────────────

def _get_context(session_row) -> dict:
    ctx_raw = session_row["context_json"] if session_row else None
    if ctx_raw:
        try:
            return json.loads(ctx_raw)
        except Exception:
            pass
    return {}


def _save_state(session_id: str, new_state: str, ctx: dict) -> None:
    db.update_session_state(
        session_id, new_state, clock.now_iso(),
        context_json=json.dumps(ctx, ensure_ascii=False),
    )


# ── Global command detection ───────────────────────────────────────────────────

_STOP_KEYWORDS = {"stop", "cancel", "quit", "exit", "roko", "band karo", "रोको", "बंद करो"}
_HUMAN_KEYWORDS = {"human", "person", "help", "manav", "insaan", "इंसान", "मानव", "आदमी"}

def _wants_stop(text: str) -> bool:
    lower = text.lower()
    return any(kw in lower for kw in _STOP_KEYWORDS)


def _wants_human(intent_result: dict, text: str) -> bool:
    if intent_result.get("wants_human"):
        return True
    lower = text.lower()
    return any(kw in lower for kw in _HUMAN_KEYWORDS)


# ── Main entry point ──────────────────────────────────────────────────────────

async def handle_message(
    session_id: str,
    user_text: str,
    lang_override: Optional[str] = None,
) -> dict:
    """
    Process one user message and return a response dict:
    {reply, state, plan, pending_consent, lang}
    """
    session = db.get_session(session_id)
    if session is None:
        return {"reply": "Session not found.", "state": "ERROR"}

    ctx = _get_context(session)
    lang = lang_override or ctx.get("lang", session["language"] or "en")
    state = session["state"]
    service = session["service"] if ("service" in session.keys() and session["service"]) else "income_certificate"

    # Save the user message
    db.add_message(session_id, "user", user_text, lang, clock.now_iso())
    audit.log(session_id, actor="user", action="user_message",
              reason="User sent a message", result="received")

    # ── Global commands (handled in any state) ────────────────────────────────
    if _wants_stop(user_text) and state not in TERMINAL_STATES:
        _save_state(session_id, State.CANCELLED, ctx)
        reply = t("consent_denied_msg", lang)
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        audit.log(session_id, actor="user", action="cancelled",
                  reason="User said stop", result="CANCELLED")
        await push_event(session_id, "state_change", {"state": State.CANCELLED})
        return {"reply": reply, "state": State.CANCELLED, "lang": lang}

    # Classify intent
    intent_result = await llm.classify_intent(user_text, state, lang)
    # Update language from intent if detected
    if intent_result.get("language") and intent_result["language"] in ("en", "hi"):
        lang = intent_result["language"]
        ctx["lang"] = lang

    # Global: user wants a human
    if _wants_human(intent_result, user_text) and state not in TERMINAL_STATES:
        return await _escalate_flow(session_id, state, ctx, lang, reason="Citizen requested human help")

    # ── State machine dispatch ─────────────────────────────────────────────────
    if state == State.START:
        return await _handle_start(session_id, ctx, lang, intent_result, user_text)
    elif state == State.INTENT_UNDERSTOOD:
        return await _handle_requirements(session_id, ctx, lang, service)
    elif state == State.REQUIREMENTS_EXPLAINED:
        return await _continue_collecting(session_id, ctx, lang, service)
    elif state == State.COLLECTING_DOCUMENTS:
        return await _collecting_reply(session_id, ctx, lang, service, user_text)
    elif state == State.VALIDATING_DOCUMENTS:
        # Usually advanced by document upload endpoint; reply with current status
        return await _validating_reply(session_id, ctx, lang, service)
    elif state == State.DATA_REVIEW:
        return await _data_review_reply(session_id, ctx, lang, user_text)
    elif state in (State.AWAITING_CONSENT_SHARE, State.AWAITING_CONSENT_SUBMIT,
                   State.AWAITING_CONSENT):
        return await _consent_waiting_reply(session_id, ctx, lang, state)
    elif state == State.FORM_FILLING:
        return await _form_fill_and_advance(session_id, ctx, lang, service)
    elif state == State.SUBMITTING:
        return await _submit_and_advance(session_id, ctx, lang, service)
    elif state == State.TRACKING_STATUS:
        return await _track_status_reply(session_id, ctx, lang)
    elif state == State.REJECTED_BY_PORTAL:
        return await _rejected_reply(session_id, ctx, lang, user_text)
    elif state in TERMINAL_STATES:
        return {"reply": t("approved_msg", lang) if state == State.COMPLETED
                else f"Session is {state}.", "state": state, "lang": lang}
    else:
        return {"reply": t("unknown_intent", lang), "state": state, "lang": lang}


# ── State handlers ─────────────────────────────────────────────────────────────

async def _handle_start(session_id, ctx, lang, intent_result, user_text):
    intent = intent_result.get("intent", "unknown")
    ctx["unknown_intent_count"] = ctx.get("unknown_intent_count", 0)

    if intent in ("income_certificate", "scholarship"):
        service = intent
        ctx["service"] = service
        ctx["lang"] = lang
        # Create plan
        new_plan = plan_mod.create_plan(session_id, service)
        ctx["plan_version"] = new_plan["version"]
        _save_state(session_id, State.INTENT_UNDERSTOOD, ctx)
        db.update_session_state(session_id, State.INTENT_UNDERSTOOD, clock.now_iso(),
                                 context_json=json.dumps(ctx), service=service)

        # Compose plan intro
        total = len(new_plan["steps"])
        reply = t("plan_intro", lang, n=total) + "\n"
        for s in new_plan["steps"]:
            label = s["type"].replace("_", " ").title()
            if s.get("slot"):
                label += f" ({slot_label(s['slot'], lang)})"
            reply += f"\n  {s['seq']}. {label}"
        reply += "\n\n" + t("upload_prompt", lang, slot=slot_label("aadhaar", lang))
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        await push_event(session_id, "state_change", {
            "state": State.INTENT_UNDERSTOOD,
            "plan": new_plan,
        })
        return {
            "reply": reply, "state": State.INTENT_UNDERSTOOD,
            "plan": new_plan, "lang": lang,
        }

    elif intent == "greeting":
        reply = "नमस्ते! मैं आपकी किस सेवा में मदद कर सकता हूँ? आप आय प्रमाण पत्र (Income Certificate) या छात्रवृत्ति (Scholarship) के लिए आवेदन कर सकते हैं।" if lang == "hi" else "Hello! How can I assist you today? You can apply for an Income Certificate or Scholarship."
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.START, "lang": lang}

    elif intent == "unknown":
        ctx["unknown_intent_count"] = ctx.get("unknown_intent_count", 0) + 1
        if ctx["unknown_intent_count"] >= 3:
            return await _escalate_flow(session_id, "START", ctx, lang,
                                         reason="Intent unknown after 3 attempts")
        reply = t("unknown_intent", lang)
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.START, "lang": lang}

    elif intent == "want_human":
        return await _escalate_flow(session_id, "START", ctx, lang,
                                     reason="Citizen requested human help at start")
    else:
        reply = t("unknown_intent", lang)
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.START, "lang": lang}


async def _handle_requirements(session_id, ctx, lang, service):
    _save_state(session_id, State.REQUIREMENTS_EXPLAINED, ctx)
    reply = t("upload_prompt", lang, slot=slot_label("aadhaar", lang))
    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    await push_event(session_id, "state_change", {"state": State.REQUIREMENTS_EXPLAINED})
    return {"reply": reply, "state": State.REQUIREMENTS_EXPLAINED, "lang": lang}


async def _continue_collecting(session_id, ctx, lang, service):
    missing = _missing_slots(session_id, service)
    if missing:
        slot = missing[0]
        _save_state(session_id, State.COLLECTING_DOCUMENTS, ctx)
        reply = t("upload_prompt", lang, slot=slot_label(slot, lang))
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.COLLECTING_DOCUMENTS, "lang": lang}
    return await _advance_after_docs(session_id, ctx, lang, service)


async def _collecting_reply(session_id, ctx, lang, service, user_text):
    missing = _missing_slots(session_id, service)
    if missing:
        slot = missing[0]
        reply = t("upload_prompt", lang, slot=slot_label(slot, lang))
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.COLLECTING_DOCUMENTS, "lang": lang}
    return await _advance_after_docs(session_id, ctx, lang, service)


async def _advance_after_docs(session_id, ctx, lang, service):
    if tools.all_docs_ok(session_id, service):
        _save_state(session_id, State.DATA_REVIEW, ctx)
        # Gather extracted data for review
        docs = db.get_documents(session_id)
        data_lines = []
        for d in docs:
            if d["status"] == "OK" and d["extracted_json"]:
                try:
                    ex = json.loads(d["extracted_json"])
                    data_lines.append(f"{d['slot']}: {json.dumps(ex, ensure_ascii=False)[:80]}")
                except Exception:
                    pass
        reply = "Please review your data:\n" + "\n".join(data_lines) + "\nIs everything correct?"
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        await push_event(session_id, "state_change", {"state": State.DATA_REVIEW})
        return {"reply": reply, "state": State.DATA_REVIEW, "lang": lang}
    missing = _missing_slots(session_id, service)
    if missing:
        slot = missing[0]
        reply = t("upload_prompt", lang, slot=slot_label(slot, lang))
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.COLLECTING_DOCUMENTS, "lang": lang}
    reply = t("unknown_intent", lang)
    return {"reply": reply, "state": State.COLLECTING_DOCUMENTS, "lang": lang}


async def _validating_reply(session_id, ctx, lang, service):
    missing = _missing_slots(session_id, service)
    if not missing:
        return await _advance_after_docs(session_id, ctx, lang, service)
    slot = missing[0]
    reply = t("upload_prompt", lang, slot=slot_label(slot, lang))
    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    return {"reply": reply, "state": State.COLLECTING_DOCUMENTS, "lang": lang}


async def _data_review_reply(session_id, ctx, lang, user_text):
    # If user confirms, advance to share consent
    lower = user_text.lower()
    confirmed = any(w in lower for w in ("yes", "correct", "ok", "haan", "hà", "हाँ", "ठीक"))
    if confirmed:
        _save_state(session_id, State.AWAITING_CONSENT_SHARE, ctx)
        await push_event(session_id, "state_change", {"state": State.AWAITING_CONSENT_SHARE})
        # Trigger the consent request via execute_action
        return await _request_consent_share(session_id, ctx, lang)
    reply = "Please confirm the data is correct, or let me know what to change."
    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    return {"reply": reply, "state": State.DATA_REVIEW, "lang": lang}


async def _request_consent_share(session_id, ctx, lang):
    """Trigger the share_document consent request."""
    payload = tools.build_document_share_payload(session_id)
    payload["_session_id"] = session_id
    try:
        await asyncio.get_event_loop().run_in_executor(
            None, lambda: execute_action(
                session_id, "share_document", payload,
                lambda p: None,  # placeholder; actual call comes after consent
                language=lang,
            )
        )
    except ConsentRequired as e:
        consent_req = e.request
        await push_event(session_id, "consent_required", consent_req)
        reply = t("consent_title", lang)
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {
            "reply": reply,
            "state": State.AWAITING_CONSENT_SHARE,
            "pending_consent": consent_req,
            "lang": lang,
        }
    # If somehow no ConsentRequired raised, move forward
    return await _after_consent_share(session_id, ctx, lang)


async def _consent_waiting_reply(session_id, ctx, lang, state):
    pending = db.get_pending_consent(session_id)
    if pending:
        reply = t("consent_title", lang)
        return {
            "reply": reply,
            "state": state,
            "pending_consent": dict(pending),
            "lang": lang,
        }
    # Consent was already decided; advance
    granted = db.fetchall(
        "SELECT * FROM consents WHERE session_id=? AND status='granted' ORDER BY created_at DESC LIMIT 1",
        (session_id,)
    )
    if granted:
        if state == State.AWAITING_CONSENT_SHARE:
            return await _after_consent_share(session_id, ctx, lang)
        else:
            return await _after_consent_submit(session_id, ctx, lang)
    reply = t("consent_denied_msg", lang)
    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    return {"reply": reply, "state": state, "lang": lang}


async def _after_consent_share(session_id, ctx, lang):
    """Consent for share_document was granted; proceed to form filling."""
    _save_state(session_id, State.FORM_FILLING, ctx)
    await push_event(session_id, "state_change", {"state": State.FORM_FILLING})
    return await _form_fill_and_advance(session_id, ctx, lang, ctx.get("service", "income_certificate"))


async def _form_fill_and_advance(session_id, ctx, lang, service):
    """Fill the form and request consent to submit."""
    try:
        payload = tools.build_form_payload(session_id, service)
        ctx["form_payload"] = payload
        _save_state(session_id, State.FORM_FILLING, ctx)
        # Non-sensitive: no consent needed for fill_form
        execute_action(session_id, "fill_form", payload, lambda p: {"filled": True}, language=lang)
        audit.log(session_id, actor="agent", action="form_filled",
                  reason="Form data assembled from DB",
                  consent_status="not_needed", result="success")
    except Exception as exc:
        reply = f"Error preparing form: {exc}"
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.FORM_FILLING, "lang": lang}

    _save_state(session_id, State.AWAITING_CONSENT_SUBMIT, ctx)
    await push_event(session_id, "state_change", {"state": State.AWAITING_CONSENT_SUBMIT})
    # Trigger submit consent
    return await _request_consent_submit(session_id, ctx, lang, service)


async def _request_consent_submit(session_id, ctx, lang, service):
    """Trigger the submit_form consent request."""
    payload = ctx.get("form_payload", {})
    doc_refs = ctx.get("document_refs", [])
    submit_payload = {**payload, "document_refs": doc_refs, "_session_id": session_id}
    ikey = util.idempotency_key(session_id, "submit_form", util.payload_hash(submit_payload))
    submit_payload["_idempotency_key"] = ikey
    ctx["submit_payload"] = submit_payload
    _save_state(session_id, State.AWAITING_CONSENT_SUBMIT, ctx)

    try:
        execute_action(session_id, "submit_form", submit_payload,
                       lambda p: None, language=lang)
    except ConsentRequired as e:
        consent_req = e.request
        await push_event(session_id, "consent_required", consent_req)
        reply = t("consent_title", lang)
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {
            "reply": reply,
            "state": State.AWAITING_CONSENT_SUBMIT,
            "pending_consent": consent_req,
            "lang": lang,
        }
    return await _after_consent_submit(session_id, ctx, lang)


async def _after_consent_submit(session_id, ctx, lang):
    """Consent for submit_form was granted; submit the application."""
    _save_state(session_id, State.SUBMITTING, ctx)
    await push_event(session_id, "state_change", {"state": State.SUBMITTING})
    return await _submit_and_advance(session_id, ctx, lang, ctx.get("service", "income_certificate"))


async def _submit_and_advance(session_id, ctx, lang, service):
    """Execute the portal submission with recovery."""
    submit_payload = ctx.get("submit_payload", {})
    ikey = submit_payload.get("_idempotency_key", util.new_uuid())

    # Write-ahead submission record
    db.write_ahead_submission(session_id, ikey, clock.now_iso())

    retry_count = ctx.get("submit_retry_count", 0)
    ablate = settings.benchmark_mode and settings.ablate_recovery

    async def _do_submit(p):
        return await tools.tool_submit_form(p)

    try:
        result = await recovery.run_with_recovery(
            _do_submit, submit_payload, ikey, session_id, "submit_form",
            ablate=ablate,
        )
        application_id = result.get("application_id", "")
        db.update_submission(ikey, application_id, "submitted")
        ctx["application_id"] = application_id
        _save_state(session_id, State.TRACKING_STATUS, ctx)
        audit.log(session_id, actor="agent", action="form_submitted",
                  application_id=application_id,
                  consent_status="yes", result="success")
        await push_event(session_id, "state_change", {
            "state": State.TRACKING_STATUS,
            "application_id": application_id,
        })
        reply = t("status_submitted", lang) + f" (ID: {application_id}). Tracking status..."
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        return {"reply": reply, "state": State.TRACKING_STATUS, "lang": lang}

    except recovery.RetryBudgetExhausted:
        ctx["submit_retry_count"] = retry_count + MAX_RETRY_COUNT
        return await _escalate_flow(session_id, State.SUBMITTING, ctx, lang,
                                     reason="Portal submission failed after all retries",
                                     retry_count=retry_count + 3)
    except recovery.PermanentFailure as exc:
        reply = f"The portal rejected the submission: {exc}. Please check your documents."
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        _save_state(session_id, State.REJECTED_BY_PORTAL, ctx)
        return {"reply": reply, "state": State.REJECTED_BY_PORTAL, "lang": lang}


MAX_RETRY_COUNT = 3


async def _track_status_reply(session_id, ctx, lang):
    """Poll and report application status."""
    application_id = ctx.get("application_id", "")
    if not application_id:
        return {"reply": "Waiting for application ID...", "state": State.TRACKING_STATUS, "lang": lang}
    try:
        status_data = await tools.tool_check_status({"application_id": application_id})
        status = status_data.get("status", "unknown")
        audit.log(session_id, actor="agent", action="status_checked",
                  application_id=application_id,
                  consent_status="not_needed", result=status)
        await push_event(session_id, "status_update", status_data)

        if status == "Approved":
            _save_state(session_id, State.COMPLETED, ctx)
            reply = t("approved_msg", lang)
            db.add_message(session_id, "agent", reply, lang, clock.now_iso())
            audit.log(session_id, actor="system", action="completed",
                      application_id=application_id, result="Approved")
            return {"reply": reply, "state": State.COMPLETED, "lang": lang}

        elif status == "Rejected":
            reason = status_data.get("rejection_reason", "Unknown reason")
            _save_state(session_id, State.REJECTED_BY_PORTAL, ctx)
            ctx["rejection_reason"] = reason
            _save_state(session_id, State.REJECTED_BY_PORTAL, ctx)
            reply = t("rejected_msg", lang, reason=reason)
            db.add_message(session_id, "agent", reply, lang, clock.now_iso())
            return {"reply": reply, "state": State.REJECTED_BY_PORTAL, "lang": lang}

        else:
            status_label = t(f"status_{status.lower().replace(' ', '_')}", lang) if status else "Processing"
            reply = f"Status: {status_label}. I will check again shortly."
            db.add_message(session_id, "agent", reply, lang, clock.now_iso())
            return {"reply": reply, "state": State.TRACKING_STATUS, "lang": lang}

    except Exception as exc:
        reply = f"Could not check status: {exc}. Trying again shortly."
        return {"reply": reply, "state": State.TRACKING_STATUS, "lang": lang}


async def _rejected_reply(session_id, ctx, lang, user_text):
    """Handle portal rejection — offer reapply."""
    lower = user_text.lower()
    if any(w in lower for w in ("yes", "reapply", "fix", "retry", "haan", "हाँ")):
        # Replan with portal_rejected trigger
        current = plan_mod.get_current_plan(session_id)
        if current:
            plan_mod.replan(session_id, "portal_rejected",
                             {"reason": ctx.get("rejection_reason", "unknown")},
                             current)
        _save_state(session_id, State.AWAITING_CONSENT_SUBMIT, ctx)
        return await _request_consent_submit(
            session_id, ctx, lang, ctx.get("service", "income_certificate")
        )
    reply = "The application was rejected. Would you like to fix the issue and reapply, or stop?"
    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    return {"reply": reply, "state": State.REJECTED_BY_PORTAL, "lang": lang}


async def _escalate_flow(session_id, state, ctx, lang, reason, retry_count=0):
    """Ask for consent to share with helper, then escalate."""
    from agent.consent import execute_action, ConsentRequired
    share_payload = {"session_id": session_id, "reason": reason}
    detail_shared = False
    try:
        execute_action(session_id, "share_with_helper", share_payload,
                       lambda p: True, language=lang)
        detail_shared = True
    except ConsentRequired as e:
        # Return to caller; consent modal will appear
        reply = t("escalate_msg", lang)
        db.add_message(session_id, "agent", reply, lang, clock.now_iso())
        await push_event(session_id, "consent_required", e.request)
        return {
            "reply": reply,
            "state": state,
            "pending_consent": e.request,
            "lang": lang,
        }
    except Exception:
        pass

    esc_id = await recovery.escalate(
        session_id=session_id,
        user_ref=ctx.get("phone", ""),
        reason=reason,
        retry_count=retry_count,
        detail_shared=detail_shared,
    )
    _save_state(session_id, State.ESCALATED, ctx)
    reply = t("escalate_msg", lang)
    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    await push_event(session_id, "state_change", {"state": State.ESCALATED, "escalation_id": esc_id})
    return {"reply": reply, "state": State.ESCALATED, "lang": lang}


# ── Document upload handler (called from the API) ─────────────────────────────

async def handle_document_upload(
    session_id: str,
    slot: str,
    file_path: str,
    extracted: dict,
    lang: str = "en",
) -> dict:
    """
    Called after a document is extracted. Runs validation and updates the plan.
    Returns the validation result dict.
    """
    from agent.validation import validate, cross_check, get_citizen_for_session
    from agent.i18n import reason_message

    session = db.get_session(session_id)
    if session is None:
        return {"status": "ERROR", "reason_code": "NO_SESSION"}
    ctx = _get_context(session)
    service = session["service"] if ("service" in session.keys() and session["service"]) else "income_certificate"

    # Count attempts for this slot
    attempt = db.count_document_attempts(session_id, slot) + 1

    ablate_rules = settings.benchmark_mode and settings.ablate_rules
    status, reason_code, human_reason = validate(extracted, slot, service, ablate_rules=ablate_rules)

    doc_id = db.upsert_document(
        session_id=session_id,
        slot=slot,
        file_path=file_path,
        extracted_json=json.dumps(extracted, ensure_ascii=False),
        status=status,
        reason_code=reason_code,
        attempt_no=attempt,
        created_at=clock.now_iso(),
    )

    audit.log(
        session_id, actor="agent", action="document_validated",
        reason=f"{slot}: {reason_code}",
        consent_status="not_needed",
        result=status,
        payload_summary={slot: reason_code},
    )

    if status == "REJECT":
        if attempt >= 3:
            # Escalate
            ctx["doc_rejection_count"] = ctx.get("doc_rejection_count", 0) + 1
            return await _escalate_flow(
                session_id, session["state"], ctx, lang,
                reason=f"Document {slot} rejected {attempt} times: {human_reason}"
            ) | {"status": status, "reason_code": reason_code, "human_reason": human_reason, "attempt": attempt}
        # Replan
        current = plan_mod.get_current_plan(session_id)
        if current:
            plan_mod.replan(session_id, "document_rejected", {"slot": slot, "attempt": attempt}, current)

    elif status == "ASK_USER":
        current = plan_mod.get_current_plan(session_id)
        if current:
            plan_mod.replan(session_id, "name_similar", {"slot": slot}, current)

    elif status == "OK":
        # Check if all docs collected
        if tools.all_docs_ok(session_id, service):
            # Run cross-check
            docs_map = {}
            for d in db.get_documents(session_id):
                if d["status"] == "OK" and d["extracted_json"]:
                    try:
                        docs_map[d["slot"]] = json.loads(d["extracted_json"])
                    except Exception:
                        pass
            cross_status, cross_code, cross_reason = cross_check(docs_map)
            if cross_status == "REJECT":
                status, reason_code, human_reason = cross_status, cross_code, cross_reason
                # Mark the offending doc as rejected
                audit.log(session_id, actor="agent", action="document_validated",
                          reason=f"Cross-check: {cross_code}",
                          consent_status="not_needed", result="REJECT")
            elif cross_status == "OK":
                _save_state(session_id, State.VALIDATING_DOCUMENTS, ctx)

    # Reply message
    if status == "OK":
        reply = t("doc_ok", lang, slot=slot_label(slot, lang))
    elif status == "WARN":
        reply = t("doc_warn", lang, slot=slot_label(slot, lang))
    elif status == "REJECT":
        reply = t("doc_reject", lang, slot=slot_label(slot, lang),
                  reason=reason_message(reason_code, lang))
    elif status == "ASK_USER":
        reply = t("doc_ask_user", lang, slot=slot_label(slot, lang),
                  reason=human_reason)
    else:
        reply = human_reason

    db.add_message(session_id, "agent", reply, lang, clock.now_iso())
    await push_event(session_id, "document_result", {
        "slot": slot, "status": status, "reason_code": reason_code,
        "human_reason": human_reason, "attempt": attempt,
    })

    return {
        "status": status,
        "reason_code": reason_code,
        "human_reason": human_reason,
        "attempt": attempt,
        "reply": reply,
    }


def _missing_slots(session_id: str, service: str = "income_certificate") -> list[str]:
    """Return slots that still need a valid document."""
    required = tools.get_required_slots(service)
    docs = db.get_documents(session_id)
    ok_slots = {d["slot"] for d in docs if d["status"] == "OK"}
    return [s for s in required if s not in ok_slots]


# ── Status polling (background task for demo) ─────────────────────────────────

async def poll_status_loop(session_id: str, interval: float = 10.0) -> None:
    """Poll the portal status every `interval` seconds and push updates via SSE."""
    for _ in range(30):  # max 5 minutes
        session = db.get_session(session_id)
        if session is None or session["state"] not in (State.TRACKING_STATUS,):
            break
        ctx = _get_context(session)
        lang = ctx.get("lang", "en")
        result = await _track_status_reply(session_id, ctx, lang)
        if result["state"] in TERMINAL_STATES:
            break
        await asyncio.sleep(interval)
