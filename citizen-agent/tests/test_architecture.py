"""
tests/test_architecture.py – Enforce architectural boundary invariants (Section 4.2)
"""
import ast
import os
import pytest

AGENT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "agent")


def get_imports(filepath: str) -> set[str]:
    with open(filepath, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read(), filename=filepath)
    imports = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.add(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.add(node.module)
    return imports


def test_consent_does_not_import_llm():
    """Rule: consent.py must never import llm.py (Section 25.4)"""
    consent_path = os.path.join(AGENT_DIR, "consent.py")
    imports = get_imports(consent_path)
    for imp in imports:
        assert "llm" not in imp, f"Forbidden import found in consent.py: {imp}"


def test_audit_does_not_import_llm():
    """Rule: audit.py must never import llm.py (Section 25.4)"""
    audit_path = os.path.join(AGENT_DIR, "audit.py")
    imports = get_imports(audit_path)
    for imp in imports:
        assert "llm" not in imp, f"Forbidden import found in audit.py: {imp}"


def test_validation_does_not_import_llm():
    """Rule: validation.py must never import llm.py (Section 25.4)"""
    val_path = os.path.join(AGENT_DIR, "validation.py")
    imports = get_imports(val_path)
    for imp in imports:
        assert "llm" not in imp, f"Forbidden import found in validation.py: {imp}"
