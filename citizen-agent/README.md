# Citizen Service Agent (नागरिक सेवा सहायक)

An open-source, voice-enabled, consent-first AI agent that helps citizens in India apply for government welfare services (Income Certificates, Scholarships) in Hindi and English without paying intermediaries.

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+
- `ffmpeg` (for local audio conversion / speech-to-text)

### 2. Setup Virtual Environment & Dependencies
```bash
cd citizen-agent
python -m venv venv
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Run Both Services (Single Command)
- **Linux/macOS:**
  ```bash
  chmod +x run.sh
  ./run.sh
  ```
- **Windows:**
  ```cmd
  run.bat
  ```

---

## 🌐 Application Endpoints

| Portal / Service | URL | Description |
|---|---|---|
| **Citizen Chat Interface** | `http://localhost:8000` | Voice & text assistant, plan checklist, consent modal |
| **Documents Checklist** | `http://localhost:8000/documents` | Upload, extraction, and statutory rule validation |
| **Helper Dashboard** | `http://localhost:8000/dashboard` | Audit log verification, case reports, escalation takeover |
| **Mock Government Portal** | `http://localhost:8001/portal/apply` | Simulated Government of Jharkhand service portal |
| **Portal Status Tracker** | `http://localhost:8001/portal/status` | Lazy status timeline (`Submitted` → `Under Review` → `Approved`) |

---

## 🧪 Testing & Benchmark Execution

### 1. Run Unit & Architecture Invariant Tests
```bash
pytest tests/test_architecture.py tests/test_core.py -v
```

### 2. Run the 20 Core Scenarios (S01 to S20)
```bash
python scripts/run_scenarios.py
```
*Outputs are saved to `reports/results.md` and `reports/results.json`.*

### 3. Run the Long-Horizon Task Completion Benchmark
```bash
python benchmarks/run_benchmark.py --seeds 3 --ablations
```
*Outputs are saved to `reports/benchmark.md` and `reports/benchmark.json`.*

### 4. Run the Audit Tamper-Evidence Demo
```bash
python scripts/tamper_demo.py
```

---

## 📖 Key Documentation
- [Design Note](docs/design_note.md): System architecture, trust boundaries, recovery, and test metrics.
- [Consent Notes](docs/consent_notes.md): Plain-language consent principles, sensitive action registry, and DPDP alignment.
- [Architecture Blueprint](../ARCHITECTURE.md): Comprehensive system specification and dependency rules.
