# 🏛️ CivicAgent — Citizen Service Agent

> **Government Services, Without the Confusion.**
> An open-source, AI-powered, consent-first digital platform that guides every Indian citizen through discovering, preparing, applying for, and tracking government certificates, licences, and welfare schemes — all in one place.

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![Anthropic Claude](https://img.shields.io/badge/LLM-Claude%20(Anthropic)-blueviolet.svg)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-DPDP%20Aligned-orange.svg)]()
[![Languages](https://img.shields.io/badge/Languages-15%20Indian%20Languages-brightgreen.svg)]()

---

## 📌 What is CivicAgent?

CivicAgent is a full-stack civic-tech platform designed to eliminate the bureaucratic confusion and predatory intermediaries that prevent millions of Indian citizens from accessing their entitled government benefits.

Citizens simply **describe what they need** — in their own language, by typing or speaking — and CivicAgent guides them step-by-step: from finding the right service and understanding required documents, to filling the application, reviewing it in full, giving explicit consent, and tracking the outcome until completion.

**Core principle:** The agent assists, but the citizen always decides. Nothing is submitted without your explicit review and approval.

---

## ✨ Key Features

### 🎙️ Voice-First Multilingual Interface
- **Tap-to-speak voice input** with real-time audio waveform animations
- **15 Indian & regional languages** — English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Maithili, Bhojpuri, Assamese, Urdu
- Real-time full UI translation — the entire interface switches dynamically with a single language selector
- Designed for citizens who struggle with complex forms or typing

### 📋 Intelligent Service Directory
A searchable, filterable catalog across **all 28 States, 8 Union Territories, and Central Government**:

| Category | Services |
|---|---|
| 📄 Certificates | Income Certificate, Caste/Community (SC/ST/OBC/EWS), Domicile/Residence, Birth & Death |
| 🎓 Education | Post-Matric Scholarship (छात्रवृत्ति), Student Services |
| 🚗 Transport | Learner & Driving Licence |
| 🌾 Agriculture | Farmer Input Subsidy, PM-Kisan (किसान सम्मान निधि) |
| 💰 Welfare | Old Age, Widow & Disability Pensions, Ration Cards |
| 🏪 Business | Trade Licences, Shop Registrations |

### 📍 Location-Aware Document Finder
- Browse document requirements by **State, Union Territory, or Central Government** (37 jurisdictions)
- Each location shows specific documents, eligibility criteria, official fees, processing timelines, and direct portal links
- Powered by a comprehensive PRD-sourced database covering every Indian jurisdiction

### 🧙 7-Stage Application Wizard
A guided, end-to-end application engine with a clear visual progress tracker:

1. **Location & Jurisdiction** — Select your state/UT to adapt forms and department portals
2. **Eligibility Check** — Verify you qualify before gathering documents
3. **Document Checklist** — Mandatory vs. optional documents, clearly separated
4. **Application Form** — Pre-filled and validated fields
5. **Review** — Full inspection of every field before anything is sent
6. **Payment** — Fee verification with UPI/QR code support
7. **Submit** — Final dispatch only after your explicit consent

### 🔒 Consent-First Architecture (DPDP Aligned)
- **No silent submissions** — nothing is dispatched without your explicit review and approval
- **Granular document permissions** — you choose exactly which verified files (Aadhaar, income proof, address) are shared
- **Cryptographic consent gate** — every consent event is SHA-256 hash-chained in a tamper-evident, append-only audit ledger
- **Full decision transparency** — every state transition is confirmed and permanently recorded
- Aligned with India's **Digital Personal Data Protection (DPDP) Act**

### 📊 Real-Time Application Tracking
- Live status timeline: Submitted → Under Review → Additional Information → Approved
- Real-time notification drawer categorized by Applications, Documents, and Updates
- Official PDF certificate download on approval
- Average processing time guidance per service type

### 🖥️ Operator / Helper Dashboard
A dedicated operator interface for support agents to monitor citizen sessions, view escalations, and assist citizens who require human help.

### 📞 24×7 Helpline & Human Escalation
- Built-in escalation pathway from AI guidance to human assistance
- Seamless hand-off to toll-free citizen helpline

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│               Citizen Web Interface                      │
│  index.html · documents.html · dashboard · style.css    │
│  Voice Mic · 7-Stage Wizard · Service Catalog · Tracker  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               FastAPI Application Backend                │
│  /api/chat  /api/auth  /api/consent  /api/documents      │
│  /api/cases  /api/payments  /api/stt  /api/audit         │
└─────────┬──────────────────────────────┬────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────────┐    ┌────────────────────────────┐
│  Deterministic       │    │  Advisory LLM Adapter      │
│  State Machine       │    │  (Claude · Anthropic API)  │
│  - Session flow      │    │  - Intent Classification   │
│  - Step gating       │    │  - Multilingual Extraction │
│  - Recovery sweep    │    │  - Conversational Guidance │
└─────────┬────────────┘    └────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                  Security & Core Gates                   │
│  SHA-256 Hash-Chained Audit Ledger   (audit.py)         │
│  Cryptographic Consent Engine        (consent.py)       │
│  OCR Document Extraction Pipeline    (extraction.py)    │
│  SQLite Session & Application Store  (db.py)            │
│  Mock Government Portal Simulator                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
Citizen-Agents/
├── citizen-agent/
│   ├── agent/                          # Core backend
│   │   ├── main.py                     # FastAPI entry point & middleware
│   │   ├── state_machine.py            # Deterministic session state engine
│   │   ├── llm.py                      # Claude LLM adapter & intent classifier
│   │   ├── consent.py                  # DPDP consent engine & cryptographic gate
│   │   ├── audit.py                    # SHA-256 tamper-evident audit ledger
│   │   ├── db.py                       # SQLite session & application storage
│   │   ├── extraction.py               # OCR & document extraction pipeline
│   │   ├── voice.py                    # Audio conversion & speech-to-text
│   │   ├── i18n.py                     # Multilingual backend support
│   │   ├── recovery.py                 # Session recovery on restart
│   │   ├── plan.py                     # Application plan builder
│   │   ├── validation.py               # Field & document validation rules
│   │   ├── config.py                   # Environment settings (pydantic-settings)
│   │   ├── clock.py                    # Deterministic clock (test-mode aware)
│   │   ├── portal_client.py            # Government portal HTTP client
│   │   └── routes/
│   │       ├── auth.py                 # Citizen login & session management
│   │       ├── chat.py                 # AI chat endpoint
│   │       ├── documents.py            # Document upload & extraction
│   │       ├── consent.py              # Consent grant / revoke API
│   │       ├── cases.py                # Application case management
│   │       ├── payments.py             # Fee verification & UPI/QR payment
│   │       ├── audit.py                # Audit log query endpoint
│   │       ├── escalations.py          # Human escalation routing
│   │       └── stt.py                  # Speech-to-text endpoint
│   ├── portal/                         # Mock Government Service Portal
│   ├── web/                            # Frontend assets (served at /)
│   │   ├── index.html                  # Main citizen portal (2500+ lines)
│   │   ├── documents.html              # Document upload & verification page
│   │   ├── style.css                   # Civic-Tech design system (dark/light mode)
│   │   ├── app.js                      # All client-side application logic
│   │   ├── translations.js             # 15-language real-time translation engine
│   │   └── place_documents_db.js       # Location-aware document DB (37 jurisdictions)
│   ├── dashboard/                      # Operator / Helper dashboard
│   │   ├── index.html
│   │   ├── dashboard.js
│   │   └── dashboard.css
│   ├── tests/                          # Unit, integration & security test suites
│   ├── benchmarks/                     # Task completion & robustness benchmarks
│   ├── scripts/                        # Automation scripts & demo utilities
│   ├── data/                           # PRD source documents & extracted data
│   ├── requirements.txt                # Python dependencies
│   ├── run.bat                         # Windows launcher
│   └── run.sh                          # Linux/macOS launcher
├── ARCHITECTURE.md                     # In-depth architectural blueprint
├── PRD_Citizen_Service_Agent.md        # Product Requirements Document
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- An **Anthropic API key** — [get one here](https://console.anthropic.com/)
- **ffmpeg** *(optional — for local Whisper-based audio transcription)*

### 1. Clone the Repository

```bash
git clone https://github.com/hackcrew2939/Service-Agent-CSA.git
cd Service-Agent-CSA/citizen-agent
```

### 2. Create & Activate a Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
CLAUDE_MODEL=claude-sonnet-4-5
LLM_MODE=live
WHISPER_MODE=browser
```

### 5. Launch the Application

```bash
# Windows
run.bat

# Linux / macOS
chmod +x run.sh && ./run.sh
```

This starts two services — the **Agent Backend** (main citizen portal & AI chat) and the **Mock Government Portal** (simulates official department portals for end-to-end testing).

---

## 🧪 Testing & Quality Assurance

### Run the Full Test Suite
```bash
pytest tests/ -v
```

### Run Core Citizen Scenarios Benchmark
```bash
python scripts/run_scenarios.py
```

### Run Long-Horizon Benchmark (with Ablations)
```bash
python benchmarks/run_benchmark.py --seeds 3 --ablations
```

### Verify Tamper-Evident Audit Log
```bash
python scripts/tamper_demo.py
```

---

## ⚙️ Configuration Reference

| Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | *(required)* | Your Anthropic Claude API key |
| `CLAUDE_MODEL` | `claude-sonnet-4-5` | Model version to use |
| `LLM_MODE` | `live` | `live` = real Claude API, `stub` = scripted adapter for tests |
| `EXTRACTION_MODE` | `vision` | `vision` = Claude Vision OCR, `sidecar` = pre-extracted JSON |
| `WHISPER_MODE` | `browser` | `browser` = Web Speech API, `local` = local Whisper, `api` = OpenAI |
| `PORTAL_FAIL_MODE` | `none` | Simulate portal failures: `none`, `random`, `down`, `slow`, `reject_income` |
| `TEST_MODE` | `0` | `1` = frozen clock, immediate portal outcomes, auto-consent |
| `BENCHMARK_MODE` | `0` | `1` = enable ablation flags for benchmarking |
| `HELPER_TOKEN` | *(set in .env)* | Auth token for the operator/helper dashboard |
| `REFERENCE_DATE` | *(today)* | Override "today" for deterministic test scenarios |

---

## 🛡️ Security, Privacy & Compliance

| Principle | Implementation |
|---|---|
| **DPDP Act Alignment** | Explicit consent notice before any personal document is read or transmitted |
| **No Silent Submissions** | Every application dispatch requires a full citizen review + affirmative approval |
| **Cryptographic Audit Trail** | SHA-256 hash-chained, append-only ledger of all consent events and state transitions |
| **Zero Credential Harvesting** | Citizens are never asked for banking PINs, passwords, or payment credentials |
| **Deterministic Control** | LLM is advisory only — all state-altering actions go through strict deterministic gates |
| **Session Recovery** | Startup sweep automatically restores any sessions stuck mid-consent on server restart |

---

## 🔌 API Overview

All endpoints are served under `/api`:

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Service health check |
| `/api/auth/*` | POST | Citizen login, OTP, session management |
| `/api/chat` | POST | AI conversation — intent classification & guidance |
| `/api/documents/*` | POST/GET | Document upload, OCR extraction, verification |
| `/api/consent/*` | POST | Grant / revoke granular data consent |
| `/api/cases/*` | GET/POST | Application case creation and status tracking |
| `/api/payments/*` | POST | Fee verification and UPI/QR payment handling |
| `/api/audit` | GET | Query the cryptographic audit ledger |
| `/api/escalations` | POST | Route session to human support |
| `/api/stt` | POST | Server-side speech-to-text transcription |

Interactive API docs (Swagger UI) are available at `/docs`.

---

## 🎨 Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.10+, FastAPI 0.115, Uvicorn |
| **AI / LLM** | Anthropic Claude (`claude-sonnet-4-5`) |
| **Database** | SQLite (stdlib `sqlite3`, no ORM) |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript ES6+ |
| **Fonts** | Plus Jakarta Sans, Noto Sans Devanagari (Google Fonts) |
| **Document Processing** | Pillow, Claude Vision API for OCR |
| **Voice** | Web Speech API (browser), optional local Whisper / faster-whisper |
| **Testing** | pytest, pytest-asyncio, anyio |
| **Benchmarking** | matplotlib, custom scenario runner |

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).

---

<p align="center">Built to bridge the digital divide — empowering every citizen to access what is rightfully theirs.</p>
