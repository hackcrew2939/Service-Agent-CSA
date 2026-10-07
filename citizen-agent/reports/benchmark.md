# Long-Horizon Task Completion Benchmark Report (PRD Section 19.4)

**Generated:** 2026-10-07T10:16:25.352145+00:00  
**Seeds:** 3 per tier  
**Intermediary Cost to Citizen:** Rs 0 (No middlemen)  

## 1. Success Rate by Horizon Tier and Ablation (%)

| Ablation Variant | Short Tier (5-8 steps) | Medium Tier (9-15 steps) | Long Tier (16+ steps) | Overall Success | Total Consent Violations |
|---|---|---|---|---|---|
| **A. Full Agent** (Code gate, rules, recovery) | **100.0%** | **100.0%** | **100.0%** | **100.0%** | **0** |
| **B. No Recovery** (`ABLATE_RECOVERY=1`) | 100.0% | 0.0% | 0.0% | 33.3% | 0 |
| **C. LLM-Only Consent** (`ABLATE_CODE_CONSENT=1`) | 100.0% | 100.0% | 0.0% | 66.7% | **30** |
| **D. No Rule Validation** (`ABLATE_RULES=1`) | 100.0% | 100.0% | 0.0% | 66.7% | 0 |

## 2. Key Findings

1. **Recovery is Essential for Long Horizons:** When recovery is ablated (Variant B), success on Medium and Long horizons drops from 100% to 0% due to transient network and portal faults.
2. **Code Consent Gate Prevents Violations:** In Variant C (LLM-only consent), consent violations emerge under injection and complex flows. The deterministic code gate in Variant A guarantees **0 consent violations**.
3. **Deterministic Rules Safeguard Validation:** In Variant D (No rules), relying strictly on LLM judgment accepts invalid/expired documents, leading to downstream portal rejections.
