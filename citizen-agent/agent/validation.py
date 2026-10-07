"""
agent/validation.py  –  Layer 2
Document validation rule engine.
IMPORTANT: This module MUST NOT import llm.py (enforced by test_architecture.py).
All validation is deterministic Python; the LLM only extracts fields.
"""
from __future__ import annotations

import json
import os
import re
from datetime import date
from difflib import SequenceMatcher
from typing import Optional

import agent.clock as clock
import agent.util as util

# ── Data loading ──────────────────────────────────────────────────────────────
_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_CITIZENS_PATH = os.path.join(_BASE, "data", "citizens.json")
_SERVICES_PATH = os.path.join(_BASE, "data", "services.json")


def _load_citizens() -> list[dict]:
    with open(_CITIZENS_PATH, encoding="utf-8") as f:
        return json.load(f)


def _load_doc_rules(service: str = "income_certificate") -> dict:
    with open(_SERVICES_PATH, encoding="utf-8") as f:
        return json.load(f)[service]["document_rules"]


CITIZENS: list[dict] = _load_citizens()
DOC_RULES: dict = _load_doc_rules()


def reload_data() -> None:
    """Reload the citizens list and rules (used in tests)."""
    global CITIZENS, DOC_RULES
    CITIZENS = _load_citizens()
    DOC_RULES = _load_doc_rules()


# ── Name helpers ──────────────────────────────────────────────────────────────

def _name_tokens(name: str) -> list[str]:
    return re.sub(r"[^a-z ]", "", (name or "").lower()).split()


def name_match(doc_name: str, record_name: str) -> str:
    """Return 'EXACT', 'CLOSE' (abbreviation or small diff → ask user), or 'DIFFERENT'."""
    a = _name_tokens(doc_name)
    b = _name_tokens(record_name)
    if not a or not b:
        return "DIFFERENT"
    if a == b:
        return "EXACT"
    # Initials check: "R. Kumar" vs "Rik Kumar"
    initials_ok = len(a) == len(b) and all(
        y.startswith(x) for x, y in zip(a, b)
    )
    ratio = SequenceMatcher(None, " ".join(a), " ".join(b)).ratio()
    if initials_ok or ratio >= 0.85:
        return "CLOSE"
    return "DIFFERENT"


# ── Registry lookup ───────────────────────────────────────────────────────────

def _find(field: str, value: str) -> Optional[dict]:
    return next((c for c in CITIZENS if c.get(field) == value), None)


# ── Date helpers ──────────────────────────────────────────────────────────────

def _parse_date(value: str | None) -> Optional[date]:
    if not value:
        return None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            from datetime import datetime
            return datetime.strptime(value, fmt).date()
        except (TypeError, ValueError):
            pass
    return None


# ── Main validation ───────────────────────────────────────────────────────────

def validate(
    extracted: dict | None,
    expected_type: str,
    service: str = "income_certificate",
    *,
    ablate_rules: bool = False,
) -> tuple[str, str, str]:
    """
    Validate an extracted document dict against the rules.
    Returns (status, reason_code, human_reason).
    status is one of: OK, WARN, REJECT, ASK_USER.

    If ablate_rules=True (benchmark ablation only), skip all rule checks and
    return OK, so we can measure how many bad documents pass without rules.
    """
    if ablate_rules:
        return "OK", "ABLATED", "Rule validation disabled (benchmark ablation D)."

    if not isinstance(extracted, dict):
        return "WARN", "EXTRACTION_FAILED", (
            "Could not read this document. Please re-upload."
        )

    if extracted.get("readable") is False:
        return "WARN", "BLURRY", "Document is not clear. Please upload again."

    if extracted.get("document_type") != expected_type:
        return "REJECT", "WRONG_TYPE", (
            f"Expected {expected_type}, got {extracted.get('document_type', 'unknown')}."
        )

    # Photo requires no further checks
    if expected_type == "photo":
        return "OK", "VALID", "Photo accepted."

    person: Optional[dict] = None

    if expected_type == "aadhaar":
        number = util.normalize_aadhaar(extracted.get("aadhaar_number"))
        if not number:
            return "REJECT", "BAD_FORMAT", "Aadhaar number format is invalid."
        person = _find("aadhaar", number)
        if not person:
            return "REJECT", "NOT_FOUND", "This Aadhaar number is not in our records."

    elif expected_type == "ration_card":
        rc_no = (extracted.get("ration_card_no") or "").strip()
        person = _find("ration_card_no", rc_no)
        if not person:
            return "REJECT", "NOT_FOUND", "This ration card number is not in our records."

    # Name check (for aadhaar and ration_card)
    if person is not None:
        match = name_match(extracted.get("name", ""), person["name"])
        if match == "DIFFERENT":
            return "REJECT", "NAME_MISMATCH", (
                f"Name on document is '{extracted.get('name')}' "
                f"but record shows '{person['name']}'."
            )
        if match == "CLOSE":
            return "ASK_USER", "NAME_SIMILAR", (
                f"'{extracted.get('name')}' looks like '{person['name']}'. "
                "Are these the same person?"
            )

    # Date / expiry check (only if the document type has max_age_days)
    rules = DOC_RULES.get(expected_type, {})
    max_age = rules.get("max_age_days")
    if max_age is not None:
        issued = _parse_date(extracted.get("issue_date"))
        if issued is None:
            return "REJECT", "MISSING_DATE", "Issue date is missing or unreadable."
        today = clock.today()
        if issued > today:
            return "REJECT", "FUTURE_DATE", "Issue date is in the future."
        if (today - issued).days > max_age:
            return "REJECT", "EXPIRED", f"Document is older than {max_age} days."

    return "OK", "VALID", "Everything is correct."


def cross_check(
    docs: dict[str, dict],
) -> tuple[str, str, str]:
    """
    Verify that all uploaded documents belong to the same person.
    docs: slot -> extracted dict (each already individually OK or ASK_USER-confirmed).
    Returns (status, reason_code, human_reason).
    """
    aadhaar_num = util.normalize_aadhaar(
        docs.get("aadhaar", {}).get("aadhaar_number", "")
    )
    base = _find("aadhaar", aadhaar_num) if aadhaar_num else None
    if base is None:
        return "REJECT", "CROSS_NO_BASE", "Could not find the Aadhaar record for cross-checking."

    for slot in ("ration_card", "income_proof"):
        doc = docs.get(slot)
        if doc is None:
            continue
        m = name_match(doc.get("name", ""), base["name"])
        if m == "DIFFERENT":
            return "REJECT", "CROSS_MISMATCH", (
                f"Name on {slot} does not match the Aadhaar record."
            )
        if m == "CLOSE":
            return "ASK_USER", "CROSS_SIMILAR", (
                f"Name on {slot} is similar but not identical. Please confirm."
            )

    # Ration card belongs to same citizen?
    rc_no = (docs.get("ration_card", {}).get("ration_card_no") or "").strip()
    if rc_no:
        ration = _find("ration_card_no", rc_no)
        if ration and ration["citizen_id"] != base["citizen_id"]:
            return "REJECT", "CROSS_MISMATCH", "Ration card belongs to a different person."

    return "OK", "VALID", "All documents belong to the same person."


def get_citizen_for_session(docs: dict[str, dict]) -> Optional[dict]:
    """Return the citizen record identified by the Aadhaar in the docs dict."""
    aadhaar_num = util.normalize_aadhaar(
        docs.get("aadhaar", {}).get("aadhaar_number", "")
    )
    return _find("aadhaar", aadhaar_num) if aadhaar_num else None
