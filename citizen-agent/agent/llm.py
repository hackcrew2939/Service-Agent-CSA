"""
agent/llm.py  –  Layer 5
Claude adapter: intent classification, reply composition, plan-edit proposals.
The LLM proposes; code disposes.

RULES (enforced by test_architecture.py):
- llm.py MUST NOT import consent.py, audit.py, or db.py.
- The LLM has no database handle and no tool handles.
- It receives plain data and returns plain data.
"""
from __future__ import annotations

import json
from typing import Any, Optional

from agent.config import settings
from agent import util

# ── Stub mode ─────────────────────────────────────────────────────────────────
# Deterministic scripted adapter for tests that must not depend on model output.

_STUB_INTENTS: dict[str, str] = {
    # Income Certificate (Hindi, Hinglish, English)
    "income": "income_certificate",
    "income certificate": "income_certificate",
    "income_certificate": "income_certificate",
    "aay": "income_certificate",
    "aay praman": "income_certificate",
    "aay pramaan": "income_certificate",
    "आय": "income_certificate",
    "आय प्रमाण": "income_certificate",
    "आय प्रमाण पत्र": "income_certificate",
    "certificate": "income_certificate",
    "प्रमाण पत्र": "income_certificate",

    # Scholarship (Hindi, Hinglish, English)
    "scholarship": "scholarship",
    "chhatravritti": "scholarship",
    "chatravriti": "scholarship",
    "छात्रवृत्ति": "scholarship",
    "स्कॉलरशिप": "scholarship",

    # Human help
    "human": "want_human",
    "person": "want_human",
    "help": "want_human",
    "manav": "want_human",
    "insaan": "want_human",
    "मदद": "want_human",
    "इंसान": "want_human",
    "सहायता": "want_human",

    # Stop / Cancel
    "stop": "stop",
    "cancel": "stop",
    "quit": "stop",
    "roko": "stop",
    "रोको": "stop",
    "बंद": "stop",

    # Greetings
    "hi": "greeting",
    "hello": "greeting",
    "hey": "greeting",
    "namaste": "greeting",
    "namaskar": "greeting",
    "नमस्ते": "greeting",
    "नमस्कार": "greeting",
    "प्रणाम": "greeting",
}


def _stub_classify_intent(text: str, state: str) -> dict:
    """Deterministic multilingual intent classifier."""
    lower = text.lower().strip()
    is_hindi = any(c > "\u0900" for c in text) or any(w in lower for w in ("chahiye", "banao", "madad", "karo", "karna", "hai"))
    lang = "hi" if is_hindi else "en"

    # Prompt-injection detection
    if "ignore" in lower or "bypass" in lower or "skip consent" in lower or "override" in lower:
        return {"intent": "prompt_injection_attempt", "language": lang, "wants_human": False}

    # Human help
    if any(w in lower for w in ("human", "insaan", "help", "manav", "मदद", "इंसान", "सहायता")):
        return {"intent": "want_human", "language": lang, "wants_human": True}

    for kw, intent in _STUB_INTENTS.items():
        if kw in lower or kw in text:
            return {"intent": intent, "language": lang, "wants_human": intent == "want_human"}

    # Fallback to income_certificate if text mentions document/apply/etc.
    if any(w in lower for w in ("apply", "document", "docs", "upload", "form", "आवेदन", "दस्तावेज", "बनाना")):
        return {"intent": "income_certificate", "language": lang, "wants_human": False}

    return {"intent": "unknown", "language": lang, "wants_human": False}


async def classify_intent(text: str, state: str, lang: str = "en") -> dict:
    """
    Classify user intent and language.
    Uses Claude API when key is available; falls back to deterministic rules seamlessly.
    """
    if settings.llm_mode == "stub" or not settings.anthropic_api_key or len(settings.anthropic_api_key) < 10:
        return _stub_classify_intent(text, state)

    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        response = await client.messages.create(
            model=settings.claude_model,
            max_tokens=128,
            system=_INTENT_SYSTEM,
            messages=[{"role": "user", "content": text}],
            temperature=0,
        )
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            lines = raw.splitlines()
            raw = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
        parsed = json.loads(raw)
        parsed.setdefault("intent", "unknown")
        parsed.setdefault("language", lang)
        parsed.setdefault("wants_human", False)
        parsed["wants_human"] = bool(parsed["wants_human"])
        return parsed
    except Exception:
        # Graceful fallback to deterministic pattern matching
        return _stub_classify_intent(text, state)


async def compose_reply(
    state: str,
    plan: Optional[dict],
    context: dict,
    lang: str = "en",
) -> str:
    """
    Compose a natural-language reply from facts provided by the state machine.
    The LLM receives only the state name, plan summary, and pre-computed facts —
    never raw document text.
    """
    if settings.llm_mode == "stub":
        return _stub_compose_reply(state, plan, context, lang)

    import anthropic
    client = anthropic.AsyncAnthropic(api_key=settings.claude_model)
    # Build a safe context summary (no raw document text, no LLM-mutable instructions)
    facts = {
        "current_state": state,
        "plan_step": _safe_plan_summary(plan),
        **{k: v for k, v in context.items() if isinstance(v, (str, int, float, bool, type(None)))},
    }
    user_msg = f"Facts: {util.canonical(facts)}\nPlease compose a reply in {'Hindi' if lang == 'hi' else 'English'}."
    try:
        client2 = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        response = await client2.messages.create(
            model=settings.claude_model,
            max_tokens=256,
            system=_REPLY_SYSTEM.format(lang="Hindi" if lang == "hi" else "English"),
            messages=[{"role": "user", "content": user_msg}],
            temperature=0.3,
        )
        return response.content[0].text.strip()
    except Exception as exc:
        return context.get("fallback_reply", f"[Error composing reply: {exc}]")


async def propose_plan_edit(plan: dict, failure_context: dict) -> list[dict]:
    """
    Ask the LLM to propose plan edits. The result is ALWAYS validated by
    plan.validate_plan() before being applied.
    """
    if settings.llm_mode == "stub":
        return _stub_propose_plan_edit(plan, failure_context)
    # In this MVP we only use deterministic replan rules; LLM proposals are not used
    return []


def _safe_plan_summary(plan: Optional[dict]) -> Optional[dict]:
    if plan is None:
        return None
    done = sum(1 for s in plan["steps"] if s["status"] == "done")
    total = len(plan["steps"])
    next_step = next(
        (s["type"] for s in plan["steps"] if s["status"] in ("pending", "in_progress")),
        "complete"
    )
    return {"done": done, "total": total, "next": next_step}
