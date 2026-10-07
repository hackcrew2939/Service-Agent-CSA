"""
agent/i18n.py  –  Layer 2
Fixed UI strings, consent wording, and validation messages in English and Hindi.
The LLM is only used for free-form explanation text; all structural strings come from here.
"""
from __future__ import annotations

from typing import Any

# ── Translation table ──────────────────────────────────────────────────────────
_STRINGS: dict[str, dict[str, str]] = {
    # ── General ──
    "welcome": {
        "en": "Hello! I am your Citizen Service Agent. How can I help you today?",
        "hi": "नमस्ते! मैं आपका नागरिक सेवा एजेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    },
    "unknown_intent": {
        "en": "I'm sorry, I didn't understand that. Could you rephrase?",
        "hi": "मुझे समझ नहीं आया। क्या आप दोबारा कह सकते हैं?",
    },
    "escalate_msg": {
        "en": "I am connecting you to a human helper. Please wait.",
        "hi": "मैं आपको एक मानव सहायक से जोड़ रहा हूँ। कृपया प्रतीक्षा करें।",
    },
    "consent_share_helper": {
        "en": "Do you allow me to share your case details with a human helper?",
        "hi": "क्या आप अनुमति देते हैं कि मैं आपके केस की जानकारी एक मानव सहायक के साथ साझा करूँ?",
    },
    "plan_intro": {
        "en": "Here is what we will do ({n} steps):",
        "hi": "हम यह करेंगे ({n} चरण):",
    },
    "step_done": {
        "en": "✓ Done",
        "hi": "✓ हो गया",
    },
    "step_pending": {
        "en": "Pending",
        "hi": "प्रतीक्षा में",
    },
    "step_failed": {
        "en": "Failed",
        "hi": "विफल",
    },
    # ── Document collection ──
    "upload_prompt": {
        "en": "Please upload your {slot}.",
        "hi": "कृपया अपना {slot} अपलोड करें।",
    },
    "doc_ok": {
        "en": "✓ {slot} accepted.",
        "hi": "✓ {slot} स्वीकृत।",
    },
    "doc_reject": {
        "en": "✗ {slot} rejected: {reason}",
        "hi": "✗ {slot} अस्वीकृत: {reason}",
    },
    "doc_warn": {
        "en": "⚠ {slot} is not clear enough. Please re-upload.",
        "hi": "⚠ {slot} पर्याप्त स्पष्ट नहीं है। कृपया फिर से अपलोड करें।",
    },
    "doc_ask_user": {
        "en": "Question about {slot}: {reason}",
        "hi": "{slot} के बारे में प्रश्न: {reason}",
    },
    "attempt_counter": {
        "en": "Attempt {n} of {max}",
        "hi": "प्रयास {n} / {max}",
    },
    # ── Consent popup ──
    "consent_title": {
        "en": "Permission Required",
        "hi": "अनुमति आवश्यक है",
    },
    "consent_what": {
        "en": "Action: {action_label}",
        "hi": "कार्य: {action_label}",
    },
    "consent_data": {
        "en": "Data involved: {data_fields}",
        "hi": "डेटा: {data_fields}",
    },
    "consent_where": {
        "en": "Destination: {destination}",
        "hi": "गंतव्य: {destination}",
    },
    "consent_purpose": {
        "en": "Purpose: {purpose}",
        "hi": "उद्देश्य: {purpose}",
    },
    "consent_no_consequence": {
        "en": "If you say No, the application will not be submitted.",
        "hi": "यदि आप 'नहीं' कहते हैं, तो आवेदन जमा नहीं होगा।",
    },
    "consent_yes": {"en": "Yes / हाँ", "hi": "हाँ"},
    "consent_no": {"en": "No / नहीं", "hi": "नहीं"},
    "consent_human": {
        "en": "Talk to a human / इंसान से बात करें",
        "hi": "इंसान से बात करें",
    },
    "consent_denied_msg": {
        "en": "Understood. The action was cancelled. Would you like to modify something, talk to a human, or stop?",
        "hi": "समझ गया। कार्य रद्द कर दिया गया। क्या आप कुछ बदलना चाहते हैं, किसी इंसान से बात करना चाहते हैं, या रोकना चाहते हैं?",
    },
    # ── Action labels (for consent popup) ──
    "action_share_document": {
        "en": "Share your documents with the portal",
        "hi": "पोर्टल के साथ दस्तावेज़ साझा करें",
    },
    "action_submit_form": {
        "en": "Submit the Income Certificate application",
        "hi": "आय प्रमाण पत्र आवेदन जमा करें",
    },
    "action_make_payment": {
        "en": "Make payment (Rs 0 fee)",
        "hi": "भुगतान करें (शुल्क: Rs 0)",
    },
    "action_reapply": {
        "en": "Resubmit the application",
        "hi": "आवेदन फिर से जमा करें",
    },
    "action_share_with_helper": {
        "en": "Share your case with a human helper",
        "hi": "अपने केस को मानव सहायक के साथ साझा करें",
    },
    "action_withdraw_application": {
        "en": "Withdraw the submitted application",
        "hi": "जमा किया गया आवेदन वापस लें",
    },
    # ── Status ──
    "status_submitted": {"en": "Submitted", "hi": "जमा किया गया"},
    "status_under_review": {"en": "Under Review", "hi": "समीक्षाधीन"},
    "status_approved": {"en": "Approved", "hi": "स्वीकृत"},
    "status_rejected": {"en": "Rejected", "hi": "अस्वीकृत"},
    "status_withdrawn": {"en": "Withdrawn", "hi": "वापस लिया गया"},
    "approved_msg": {
        "en": "🎉 Congratulations! Your Income Certificate application has been Approved.",
        "hi": "🎉 बधाई हो! आपका आय प्रमाण पत्र आवेदन स्वीकृत हो गया है।",
    },
    "rejected_msg": {
        "en": "Your application was Rejected. Reason: {reason}. Would you like to fix and reapply?",
        "hi": "आपका आवेदन अस्वीकृत हो गया। कारण: {reason}। क्या आप सुधार करके फिर से आवेदन करना चाहते हैं?",
    },
    # ── Recovery ──
    "retry_msg": {
        "en": "There was an error. Retrying (attempt {n} of {max})...",
        "hi": "एक त्रुटि हुई। पुनः प्रयास ({n} / {max})...",
    },
    "escalate_portal_fail": {
        "en": "The portal is not responding after {n} retries. I am escalating to a human helper.",
        "hi": "पोर्टल {n} प्रयासों के बाद भी जवाब नहीं दे रहा। मैं एक मानव सहायक को सूचित कर रहा हूँ।",
    },
    # ── Document slot labels ──
    "slot_aadhaar": {"en": "Aadhaar Card", "hi": "आधार कार्ड"},
    "slot_ration_card": {"en": "Ration Card", "hi": "राशन कार्ड"},
    "slot_income_proof": {"en": "Income Proof", "hi": "आय प्रमाण"},
    "slot_photo": {"en": "Passport Photo", "hi": "पासपोर्ट फोटो"},
    # ── Validation reason messages ──
    "BLURRY": {
        "en": "The document image is too blurry to read.",
        "hi": "दस्तावेज़ की छवि पढ़ने के लिए बहुत धुंधली है।",
    },
    "WRONG_TYPE": {
        "en": "This is the wrong type of document for this slot.",
        "hi": "यह इस स्लॉट के लिए गलत प्रकार का दस्तावेज़ है।",
    },
    "BAD_FORMAT": {
        "en": "The Aadhaar number format is invalid (expected: #### #### ####).",
        "hi": "आधार नंबर का प्रारूप अमान्य है (अपेक्षित: #### #### ####)।",
    },
    "NOT_FOUND": {
        "en": "This document number is not found in our records.",
        "hi": "यह दस्तावेज़ नंबर हमारे रिकॉर्ड में नहीं मिला।",
    },
    "NAME_MISMATCH": {
        "en": "The name on the document does not match our records.",
        "hi": "दस्तावेज़ पर नाम हमारे रिकॉर्ड से मेल नहीं खाता।",
    },
    "NAME_SIMILAR": {
        "en": "The name is similar but not identical. Please confirm.",
        "hi": "नाम समान है लेकिन एक जैसा नहीं। कृपया पुष्टि करें।",
    },
    "EXPIRED": {
        "en": "This document has expired (older than the allowed limit).",
        "hi": "यह दस्तावेज़ समय-सीमा पार कर चुका है।",
    },
    "MISSING_DATE": {
        "en": "The issue date is missing or unreadable.",
        "hi": "जारी तिथि अनुपलब्ध या अपठनीय है।",
    },
    "FUTURE_DATE": {
        "en": "The issue date is in the future.",
        "hi": "जारी तिथि भविष्य में है।",
    },
    "CROSS_MISMATCH": {
        "en": "Your documents don't all match the same person.",
        "hi": "आपके सभी दस्तावेज़ एक ही व्यक्ति के नहीं हैं।",
    },
    "CROSS_SIMILAR": {
        "en": "Some document names are similar but not identical. Please confirm they are yours.",
        "hi": "कुछ दस्तावेज़ों के नाम समान हैं लेकिन एक जैसे नहीं। कृपया पुष्टि करें।",
    },
    "VALID": {"en": "Valid", "hi": "वैध"},
    # ── My consents ──
    "my_consents_title": {"en": "Your Consents", "hi": "आपकी अनुमतियाँ"},
    "no_consents": {
        "en": "No consent records found for this session.",
        "hi": "इस सत्र के लिए कोई अनुमति रिकॉर्ड नहीं मिला।",
    },
    # ── Case report ──
    "case_report_title": {"en": "Case Accountability Report", "hi": "केस जवाबदेही रिपोर्ट"},
    "chain_intact": {"en": "Audit log is intact.", "hi": "ऑडिट लॉग सुरक्षित है।"},
    "chain_tampered": {
        "en": "⚠ Tampering detected at row {row}!",
        "hi": "⚠ पंक्ति {row} पर छेड़छाड़ का पता चला!",
    },
}


def t(key: str, lang: str = "en", **kwargs: Any) -> str:
    """
    Look up a string by key and language, then format with kwargs.
    Falls back to English if the key or language is missing.
    """
    bucket = _STRINGS.get(key, {})
    text = bucket.get(lang) or bucket.get("en") or key
    if kwargs:
        try:
            text = text.format(**kwargs)
        except KeyError:
            pass  # return unformatted if a placeholder is missing
    return text


def action_label(action: str, lang: str = "en") -> str:
    """Return the human-readable label for a consent action."""
    return t(f"action_{action}", lang)


def slot_label(slot: str, lang: str = "en") -> str:
    """Return the human-readable label for a document slot."""
    return t(f"slot_{slot}", lang)


def reason_message(reason_code: str, lang: str = "en", **kwargs: Any) -> str:
    """Return a human-readable validation failure message."""
    return t(reason_code, lang, **kwargs)


SUPPORTED_LANGUAGES = ["en", "hi"]
