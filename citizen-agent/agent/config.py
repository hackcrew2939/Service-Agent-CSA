"""
agent/config.py  –  Layer 0
Load and validate all environment variables once at startup.
"""
from __future__ import annotations

import os
from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── LLM ────────────────────────────────────────────────────────────────
    anthropic_api_key: str = Field(default="", alias="ANTHROPIC_API_KEY")
    claude_model: str = Field(default="claude-sonnet-4-5", alias="CLAUDE_MODEL")
    llm_mode: str = Field(default="live", alias="LLM_MODE")  # live | stub

    # ── Extraction ──────────────────────────────────────────────────────────
    extraction_mode: str = Field(default="sidecar", alias="EXTRACTION_MODE")  # vision | sidecar

    # ── Portal ──────────────────────────────────────────────────────────────
    portal_base_url: str = Field(default="http://localhost:8001", alias="PORTAL_BASE_URL")
    portal_fail_mode: str = Field(default="none", alias="PORTAL_FAIL_MODE")
    portal_seed: int = Field(default=42, alias="PORTAL_SEED")

    # ── Modes ───────────────────────────────────────────────────────────────
    test_mode: bool = Field(default=False, alias="TEST_MODE")
    benchmark_mode: bool = Field(default=False, alias="BENCHMARK_MODE")

    # Ablation flags – only active when benchmark_mode=True
    ablate_recovery: bool = Field(default=False, alias="ABLATE_RECOVERY")
    ablate_code_consent: bool = Field(default=False, alias="ABLATE_CODE_CONSENT")
    ablate_rules: bool = Field(default=False, alias="ABLATE_RULES")

    # ── Voice ────────────────────────────────────────────────────────────────
    whisper_mode: str = Field(default="browser", alias="WHISPER_MODE")  # local | api | browser

    # ── Auth ─────────────────────────────────────────────────────────────────
    helper_token: str = Field(default="demo-helper-token-change-me", alias="HELPER_TOKEN")

    # ── Payments ─────────────────────────────────────────────────────────────
    payment_webhook_secret: str = Field(default="demo-webhook-secret-key-12345", alias="PAYMENT_WEBHOOK_SECRET")
    payment_admin_key: str = Field(default="demo-admin-key-67890", alias="PAYMENT_ADMIN_KEY")

    # ── Dates ────────────────────────────────────────────────────────────────
    reference_date: str = Field(default="", alias="REFERENCE_DATE")

    @field_validator("llm_mode")
    @classmethod
    def _check_llm_mode(cls, v: str) -> str:
        if v not in ("live", "stub"):
            raise ValueError("LLM_MODE must be 'live' or 'stub'")
        return v

    @field_validator("extraction_mode")
    @classmethod
    def _check_extraction_mode(cls, v: str) -> str:
        if v not in ("vision", "sidecar"):
            raise ValueError("EXTRACTION_MODE must be 'vision' or 'sidecar'")
        return v

    def check_ablation_guard(self) -> None:
        """Call this before any ablation flag is used."""
        if not self.benchmark_mode:
            for flag in ("ablate_recovery", "ablate_code_consent", "ablate_rules"):
                if getattr(self, flag):
                    raise RuntimeError(
                        f"ABLATE_* flags are only allowed when BENCHMARK_MODE=1. "
                        f"Set BENCHMARK_MODE=1 first."
                    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


# Convenient module-level alias
settings = get_settings()
