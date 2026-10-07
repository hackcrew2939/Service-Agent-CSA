"""
scripts/tamper_demo.py – Demonstrates hash chain tamper-evidence (PRD Section 11.3)
"""
import os
import sys
import tempfile
import uuid

# Adjust import path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import audit, clock, db


def main():
    print("==================================================")
    print("  Immutable Audit Log Tamper-Evidence Demonstration")
    print("==================================================")

    # Use a clean demo DB for a pure, self-contained demonstration
    temp_db_path = os.path.join(tempfile.gettempdir(), f"demo_audit_{uuid.uuid4().hex[:6]}.db")
    db.DB_PATH = temp_db_path
    if hasattr(db._local, "conn"):
        db._local.conn = None
    db.init_db()

    session_id = f"demo-case-{uuid.uuid4().hex[:6]}"
    print(f"\n1. Writing 5 sequential audit rows for session {session_id}...")
    for i in range(1, 6):
        row_id = audit.log(
            session_id=session_id,
            actor="agent",
            action=f"step_{i}_executed",
            reason=f"Processing application step {i}",
            consent_status="yes",
            result="success",
        )
        print(f"   - Appended Row #{row_id}: step_{i}_executed")

    # Verify initial chain
    valid, broken_row = audit.verify_chain()
    head = db.get_chain_head()
    print(f"\n2. Verifying initial chain integrity:")
    print(f"   - Chain Status: {'[INTACT / VALID]' if valid else '[INVALID]'}")
    print(f"   - Total Rows: {head['count']}")
    print(f"   - Head Hash: {head['hash'][:24]}...")

    # Pick the 3rd row to tamper
    rows = db.fetchall("SELECT * FROM audit_log WHERE session_id=? ORDER BY id ASC", (session_id,))
    target_row = rows[2]
    target_id = target_row["id"]
    print(f"\n3. Simulating unauthorized database tampering:")
    print(f"   - Tampering with Row #{target_id}: changing result from '{target_row['result']}' to 'UNAUTHORIZED_DATA'")

    with db.transaction():
        db.execute(
            "UPDATE audit_log SET result='UNAUTHORIZED_DATA' WHERE id=?",
            (target_id,)
        )

    # Verify after tampering
    valid_after, broken_after = audit.verify_chain()
    print(f"\n4. Verifying chain integrity after tampering:")
    print(f"   - Chain Status: {'[INTACT]' if valid_after else '[TAMPER DETECTED]'}")
    print(f"   - Broken Row Identified: Row #{broken_after}")

    if not valid_after and broken_after == target_id:
        print("\n[SUCCESS] The cryptographic hash chain successfully detected and isolated the exact tampered row!")
    else:
        print("\n[FAILURE] Tamper detection failed.")

    # Cleanup temp db
    try:
        if hasattr(db._local, "conn") and db._local.conn:
            db._local.conn.close()
            db._local.conn = None
        if os.path.exists(temp_db_path):
            os.remove(temp_db_path)
    except Exception:
        pass


if __name__ == "__main__":
    main()
