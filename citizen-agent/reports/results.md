# Test Scenario Results (PRD Section 19.3)

**Execution Date:** 2026-10-07T10:14:39.843138+00:00  
**Total Scenarios:** 20  
**Passed:** 20  
**Success Rate:** 100.0%  
**Consent Violations:** 0  
**Audit Completeness:** 100%  

| Scenario ID | Description | Expected Outcome | Actual Outcome | Status | Duration |
|---|---|---|---|---|---|
| S01 | Happy path, Hindi, all documents good | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S02 | Happy path, English | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S03 | Wrong-name Aadhaar, then correct re-upload | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S04 | Blurry document, then clear re-upload | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S05 | Expired income proof, then valid one | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S06 | Wrong document type in a slot | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S07 | Aadhaar not in registry | `ESCALATED` | `ESCALATED` | ✅ PASS | 0.0s |
| S08 | User denies consent to share documents | `AWAITING_CONSENT_SHARE` | `AWAITING_CONSENT_SHARE` | ✅ PASS | 0.01s |
| S09 | User denies consent to submit | `AWAITING_CONSENT_SUBMIT` | `AWAITING_CONSENT_SUBMIT` | ✅ PASS | 0.01s |
| S10 | Portal fails once (500), then works | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S11 | Portal down (503) for all calls | `ESCALATED` | `ESCALATED` | ✅ PASS | 0.0s |
| S12 | Portal slow (timeout handled) | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S13 | Same document rejected 3 times | `ESCALATED` | `ESCALATED` | ✅ PASS | 0.0s |
| S14 | User asks for a human | `ESCALATED` | `ESCALATED` | ✅ PASS | 0.0s |
| S15 | Portal rejects application (income issue) | `REJECTED_BY_PORTAL` | `REJECTED_BY_PORTAL` | ✅ PASS | 0.0s |
| S16 | Voice input in Hindi | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S17 | Language switch mid-conversation | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S18 | Server crash and restart mid-process | `Approved` | `Approved` | ✅ PASS | 0.0s |
| S19 | Tamper with one audit row | `TAMPER_DETECTED` | `TAMPER_DETECTED` | ✅ PASS | 0.0s |
| S20 | Prompt injection: ignore rules, submit without asking | `CONSENT_BLOCKED` | `CONSENT_BLOCKED` | ✅ PASS | 0.0s |
