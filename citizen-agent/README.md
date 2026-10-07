# 🏛️ Citizen Service Agent (CivicAgent)
### *Empowering Citizens with Voice-First, Consent-Driven AI for Government Welfare & Services*

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Modern%20Async%20API-009688.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Security](https://img.shields.io/badge/Privacy-DPDP%20Aligned-orange.svg)]()
[![Build & Tests](https://img.shields.io/badge/Tests-Passing%20(100%25)-brightgreen.svg)]()

---

## 📌 Overview

The **Citizen Service Agent (CivicAgent)** is an open-source, multilingual, consent-first AI civic platform designed to bridge the digital divide for millions of citizens. By removing complex bureaucratic hurdles and eliminating predatory intermediaries, CivicAgent enables individuals to effortlessly discover, prepare documents for, and apply for statutory government certificates and welfare programs.

Built with a deterministic state machine, tamper-evident audit logging, and modern voice-enabled conversational interfaces, the platform ensures complete privacy, statutory compliance, and zero dark patterns.

---

## ✨ Key Features

### 🎙️ Multilingual Voice-First Interaction
- **ChatGPT-Style Voice Mode:** Tap-to-speak voice recognition with real-time audio waveform equalizer animations.
- **Multilingual Support:** Natural conversational understanding and Text-to-Speech (TTS) readout across English, Hindi, and regional languages.
- **Zero-Friction Access:** Citizens who struggle with typing or complex forms can speak naturally to discover services and prepare required documentation.

### 📋 Intelligent AI Document Finder
- **Statutory Document Checklists:** Instantly lists mandatory vs. optional documents for services such as:
  - **Income Certificate** (*आय प्रमाण पत्र*)
  - **Caste / Community Certificate** (*जाति प्रमाण पत्र - SC/ST/OBC/EWS*)
  - **Residence / Domicile Certificate** (*निवास प्रमाण पत्र*)
  - **Post-Matric Scholarship Scheme** (*छात्रवृत्ति*)
  - **Learner & Driving Licence** (*ड्राइविंग लाइसेंस*)
  - **Birth & Death Certificates** (*जन्म / मृत्यु प्रमाण पत्र*)
  - **Farmer Input Subsidy & PM-Kisan** (*किसान सम्मान निधि*)
  - **Old Age, Widow & Disability Pensions** (*सामाजिक सुरक्षा पेंशन*)
  - **Ration Cards & Trade Licences**
- **One-Click Form Launching:** Direct transition from AI conversation into the interactive step-by-step application wizard.

### 🔒 Consent-First & Privacy Architecture (DPDP Aligned)
- **Granular Affirmative Consent:** No sensitive personal data or document payload is transmitted without explicit, plain-language citizen authorization.
- **Trust Boundaries:** LLM outputs are strictly advisory; all critical operations (form submission, payment verification, external API calls) are governed by strict deterministic gates.
- **Tamper-Evident SHA-256 Audit Trail:** Every consent event, document extraction, and state transition is cryptographically logged in an append-only hash chain.

### 📄 Document Extraction & Client-Side Verification
- **Automated OCR & Extraction:** Extracts and cross-checks key fields (Name, Date of Birth, Aadhaar/ID number, Income, Address) to catch mismatches early.
- **Instant PDF Certificate Generator:** Built-in PDF generation engine formatting certificates with accurate layouts and statutory metadata.

### 📞 24x7 Helpline & Human Escalation
- **Integrated Support:** Seamless fallback to human assistance and dedicated 24x7 toll-free citizen guidance.

---

## 🏗️ System Architecture

CivicAgent is structured across layered trust boundaries:

```
┌────────────────────────────────────────────────────────┐
│               Citizen Interface & Voice UI             │
│   (Web Portal, Floating AI Agent, Speech Mic, Forms)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Application                  │
│       (Chat & STT, Document Routing, Consent APIs)     │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  Deterministic State Machine │ │   Advisory LLM Adapter       │
│  - Session Management        │ │   - Intent Classification    │
│  - Step Progression          │ │   - Multilingual Extraction  │
│  - Guardrails & Validations  │ │   - Conversational Guidance  │
└──────────────┬───────────────┘ └──────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│                  Security & Core Gates                 │
│  - Cryptographic Consent Gate (DPDP Act)               │
│  - SHA-256 Hash-Chained Audit Ledger                   │
│  - Mock / Real Government Service Portals              │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
citizen-agent/
├── agent/                 # Core backend logic
│   ├── audit.py           # Tamper-evident SHA-256 audit ledger
│   ├── consent.py         # DPDP consent engine & verification
│   ├── db.py              # SQLite session & application storage
│   ├── extraction.py      # OCR & document extraction pipeline
│   ├── llm.py             # Multilingual LLM adapter & intent classifier
│   ├── main.py            # FastAPI entry point & middleware
│   ├── state_machine.py   # Deterministic session state engine
│   ├── voice.py           # Audio conversion & speech-to-text handlers
│   └── routes/            # API endpoints (chat, stt, documents, auth)
├── portal/                # Mock Government Service Portal simulation
├── web/                   # Frontend assets
│   ├── index.html         # Main citizen portal & application wizard
│   ├── app.js             # Client application logic & AI Document Assistant
│   ├── style.css          # Civic-Tech design system & responsive styling
│   └── translations.js    # Multilingual translation registry
├── tests/                 # Unit, integration, and security test suites
├── benchmarks/            # Task completion & robustness benchmarks
├── scripts/               # Automation scripts (scenarios, tamper demo)
├── run.sh                 # Unix/Linux launcher script
├── run.bat                # Windows launcher batch script
└── requirements.txt       # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **ffmpeg** *(optional, for local Whisper audio conversion)*

### 1. Setup Virtual Environment
- **On Linux / macOS:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
- **On Windows:**
  ```cmd
  python -m venv venv
  venv\Scripts\activate
  ```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

### 4. Launch the Application
- **On Linux / macOS:**
  ```bash
  chmod +x run.sh
  ./run.sh
  ```
- **On Windows:**
  ```cmd
  run.bat
  ```

---

## 🧪 Testing & Quality Assurance

### Run Test Suite
Execute unit tests, invariant checks, and architectural boundary tests:
```bash
pytest tests/ -v
```

### Run Core Scenarios Benchmark
Execute the complete set of automated citizen interaction scenarios:
```bash
python scripts/run_scenarios.py
```

### Run Long-Horizon Benchmark
Evaluate task completion rates and resilience under ablations:
```bash
python benchmarks/run_benchmark.py --seeds 3 --ablations
```

### Verify Audit Ledger Tamper Evidence
Demonstrate mathematical tamper detection in the cryptographic audit log:
```bash
python scripts/tamper_demo.py
```

---

## 🛡️ Security, Privacy & Compliance

1. **Digital Personal Data Protection (DPDP) Alignment:** Explicit consent notices before any personal document is read or dispatched.
2. **Deterministic Control:** The agent cannot execute destructive or state-altering actions without user review.
3. **No Credential Harvesting:** Users are never prompted for sensitive payment credentials or banking PINs.
4. **Immutable Audit Trails:** State transitions and data exchanges are cryptographically signed and stored in append-only storage.

---

## 📖 Key Documentation
- [Design Note](docs/design_note.md): System architecture, trust boundaries, recovery, and test metrics.
- [Consent Notes](docs/consent_notes.md): Plain-language consent principles, sensitive action registry, and DPDP alignment.
- [Architecture Blueprint](../ARCHITECTURE.md): Comprehensive system specification and dependency rules.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
