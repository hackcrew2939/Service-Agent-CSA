"""
tests/test_core.py – Core unit tests for consent gate, audit hash chain, validation, recovery, and plan invariants
"""
import os
import sys
import uuid
import pytest

# Insert agent path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Ensure stub mode for tests
os.environ["LLM_MODE"] = "stub"
os.environ["TEST_MODE"] = "1"

from agent import audit, clock, db, util
from agent.consent import execute_action, record_consent_decision, ConsentRequired, ActionNotAllowed
from agent.validation import validate, cross_check
from agent.plan import create_plan, validate_plan


@pytest.fixture(autouse=True)
def init_test_db(tmp_path, monkeypatch):
    test_db = str(tmp_path / "test_agent.db")
    monkeypatch.setattr(db, "DB_PATH", test_db)
    # Reset thread local
    if hasattr(db._local, "conn"):
        db._local.conn = None
    db.init_db()


def test_consent_gate_blocks_without_consent():
    """Consent gate must raise ConsentRequired when no granted consent exists."""
    session_id = str(uuid.uuid4())
    db.create_session(session_id, "en", clock.now_iso())

    called = False
    def dummy_tool(payload):
        nonlocal called
        called = True
        return {"status": "ok"}

    payload = {"applicant_name": "Ramesh Kumar", "income": 120000}
    with pytest.raises(ConsentRequired) as exc_info:
        execute_action(session_id, "submit_form", payload, dummy_tool)

    assert not called
    assert exc_info.value.request["action"] == "submit_form"


def test_consent_granted_allows_execution():
    """Once citizen decides 'yes', execute_action runs and marks consent used."""
    session_id = str(uuid.uuid4())
    db.create_session(session_id, "en", clock.now_iso())

    called = False
    def dummy_tool(payload):
        nonlocal called
        called = True
        return {"application_id": "APP-123"}

    payload = {"applicant_name": "Ramesh Kumar", "income": 120000}

    # 1. First call creates request
    consent_id = None
    try:
        execute_action(session_id, "submit_form", payload, dummy_tool)
    except ConsentRequired as e:
        consent_id = e.request["id"]

    assert consent_id is not None
    assert not called

    # 2. Citizen grants consent
    ok = record_consent_decision(consent_id, session_id, "yes", "button")
    assert ok is True

    # 3. Second call now succeeds
    result = execute_action(session_id, "submit_form", payload, dummy_tool)
    assert called is True
    assert result == {"application_id": "APP-123"}

    # 4. Consent should now be marked 'used'
    consent = db.get_consent(consent_id)
    assert consent["status"] == "used"


def test_payload_change_invalidates_consent():
    """Changing payload data changes the hash, invalidating prior consent."""
    session_id = str(uuid.uuid4())
    db.create_session(session_id, "en", clock.now_iso())

    def dummy_tool(payload):
        return {"ok": True}

    payload1 = {"applicant_name": "Ramesh Kumar", "income": 120000}
    consent_id = None
    try:
        execute_action(session_id, "submit_form", payload1, dummy_tool)
    except ConsentRequired as e:
        consent_id = e.request["id"]

    # Grant for payload1
    record_consent_decision(consent_id, session_id, "yes", "button")

    # Now attempt with modified payload2
    payload2 = {"applicant_name": "Ramesh Kumar", "income": 150000}  # changed
    with pytest.raises(ConsentRequired):
        execute_action(session_id, "submit_form", payload2, dummy_tool)


def test_audit_hash_chain_integrity():
    """Hash chain must verify when intact, and detect any modified row."""
    session_id = str(uuid.uuid4())
    for i in range(20):
        audit.log(session_id, actor="agent", action=f"action_{i}", reason=f"step {i}", result="ok")

    valid, broken_row = audit.verify_chain()
    assert valid is True
    assert broken_row is None

    # Tamper with row 10 directly in DB
    with db.transaction():
        db.execute("UPDATE audit_log SET result='tampered' WHERE id=10")

    valid_after_tamper, broken_row_after = audit.verify_chain()
    assert valid_after_tamper is False
    assert broken_row_after == 10


def test_document_validation_rules():
    """Test validation rules: income proof expiry, non-expiring aadhaar, fuzzy name match."""
    # 1. Valid Aadhaar (registered citizen C001)
    aadhaar_extracted = {
        "document_type": "aadhaar",
        "aadhaar_number": "1234 5678 9012",
        "name": "Rik Kumar",
        "dob": "2003-05-14"
    }
    st, code, _ = validate(aadhaar_extracted, "aadhaar", "income_certificate")
    assert st == "OK"
    assert code == "VALID"

    # 2. Old income proof (older than max_age_days)
    old_income_doc = {
        "document_type": "income_proof",
        "annual_income": 95000,
        "issue_date": "2020-01-01",
        "name": "Rik Kumar"
    }
    st_inc, code_inc, _ = validate(old_income_doc, "income_proof", "income_certificate")
    assert st_inc == "REJECT"
    assert code_inc == "EXPIRED"

    # 3. Fuzzy name match ASK_USER ("Rik K." vs "Rik Kumar")
    similar_name_doc = {
        "document_type": "aadhaar",
        "aadhaar_number": "1234 5678 9012",
        "name": "Rik K.",
        "dob": "2003-05-14"
    }
    st_fuzzy, code_fuzzy, _ = validate(similar_name_doc, "aadhaar", "income_certificate")
    assert st_fuzzy == "ASK_USER"
    assert code_fuzzy == "NAME_SIMILAR"


def test_plan_invariants():
    """Plan invariants: validate_all before submit_form, consent before sensitive actions."""
    session_id = str(uuid.uuid4())
    plan = create_plan(session_id, "income_certificate")
    ok, reason = validate_plan(plan["steps"])
    assert ok is True

    # Bad plan: remove consent step
    invalid_steps = [s for s in plan["steps"] if s["type"] != "consent"]
    ok_inv, reason_inv = validate_plan(invalid_steps)
    assert ok_inv is False
    assert "consent" in reason_inv
