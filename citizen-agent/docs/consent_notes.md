# Consent Notes: Citizen Service Agent

**Deliverable: Plain-Language Consent & Privacy Architecture**  
**Version:** 1.0 (MVP)

---

## 1. Core Principles

The Citizen Service Agent adheres to five foundational consent principles:
1. **Explicit & Informed:** Every sensitive operation requires active, informed permission detailing what data is sent, to whom, and for what purpose.
2. **Deterministic Code Gate:** Consent is enforced by Python code inside `execute_action()`. The LLM has zero authority to grant, assume, or bypass consent.
3. **Payload Binding:** Consents are cryptographically bound to the exact payload hash (`sha256(canonical(payload))`). Modifying any field immediately invalidates the consent.
4. **Single-Use & Time-Bounded:** Granted consent can be used once and expires automatically after 600 seconds (10 minutes).
5. **Freely Given & Reversible:** "Yes" and "No" have equal visual weight. The citizen can revoke unused consent or request formal application withdrawal at any time.

---

## 2. Sensitive Action Registry

| Action | Data Involved | Destination | Purpose | English Consent Wording | Hindi Consent Wording (हिंदी) |
|---|---|---|---|---|---|
| `share_document` | Document files & extracted fields | Government Mock Portal | Validate identity & income eligibility | *"Do you agree to share your uploaded documents with the Government Portal for verification?"* | *"क्या आप सत्यापन के लिए अपने दस्तावेज़ सरकारी पोर्टल पर साझा करने की अनुमति देते हैं?"* |
| `submit_form` | Full application form details | Government Mock Portal | Official submission of Income Certificate | *"Do you agree to submit your finalized application to the Government Portal?"* | *"क्या आप अपना अंतिम आवेदन सरकारी पोर्टल पर जमा करने की अनुमति देते हैं?"* |
| `share_with_helper` | Chat transcript & case failure context | Service Centre Staff / Human Helper | Assisted troubleshooting & manual takeover | *"Do you agree to share your case details with a human helper for assistance?"* | *"क्या आप सहायता के लिए अपने मामले का विवरण सहायक कर्मचारी के साथ साझा करने की अनुमति देते हैं?"* |
| `make_payment` | Fee amount & billing profile | Payment Gateway | Application processing fee (Rs 0 for demo) | *"Do you agree to proceed with the fee payment?"* | *"क्या आप शुल्क भुगतान के साथ आगे बढ़ने की अनुमति देते हैं?"* |
| `reapply` | Corrected application form | Government Mock Portal | Re-application after rejection | *"Do you agree to resubmit your corrected application?"* | *"क्या आप अपना संशोधित आवेदन पुनः जमा करने की अनुमति देते हैं?"* |
| `withdraw_application`| Application reference ID | Government Mock Portal | Cancel submission and delete shared data | *"Do you agree to withdraw your submitted application?"* | *"क्या आप अपना जमा किया गया आवेदन वापस लेना चाहते हैं?"* |

---

## 3. Consent Lifecycle & UX Rules

```
[Agent identifies sensitive tool] 
               │
               ▼
[execute_action()] ── No granted consent ──► [Modal Appears]
                                                  │
               ┌──────────────────────────────────┴──────────────────────────────────┐
               ▼                                                                     ▼
    [Citizen Selects YES]                                                 [Citizen Selects NO]
               │                                                                     │
  • Record granted in DB                                                • Record denied in DB
  • Bind sha256(payload)                                                • Dependent steps BLOCKED
  • Tool executes (in_use -> used)                                      • Stop or ask human
  • Mirror receipt in audit_log                                         • 0 data leaves the machine
```

### What Counts as Consent:
- **Only** a deliberate button press in the non-dismissible consent modal or an utterance recorded inside the modal voice prompt.
- **Never Counts:** Typed chat text, document text, prompt injection phrases (e.g. *"ignore rules and submit"*), or LLM inferences.

---

## 4. Withdrawal and Evidence

- **Receipts:** Every decision creates an immutable receipt with timestamp, decision method, destination, purpose, and hash chain link.
- **My Consents View:** Citizens can view all active and historical consents at any time by clicking "My Consents" on the top bar.
- **Revocation:** Pending or unused consents can be revoked with a single tap.
- **Post-Submission Withdrawal:** Once submitted, selecting "Withdraw" triggers `POST /api/applications/{id}/withdraw` on the portal, purging the data.

---

## 5. Privacy & Limitations

- **Data Minimisation:** Only fields strictly required by the service are transmitted. Aadhaar numbers are masked in all logs (`XXXX XXXX 9012`).
- **Honest Limitations:** Built with synthetic identities and a mock portal. While adhering to the privacy principles of India's DPDP Act 2023, this is an educational prototype and does not claim official legal certification.
