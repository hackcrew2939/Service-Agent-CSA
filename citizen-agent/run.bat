@echo off
REM run.bat – Startup script for Windows
echo ==================================================
echo  Starting Citizen Service Agent & Mock Portal
echo ==================================================

echo [1/2] Starting Mock Portal in background (port 8001)...
start "Mock Portal :8001" python -m uvicorn portal.main:app --host 0.0.0.0 --port 8001

echo [2/2] Starting Agent Backend (port 8000)...
echo --------------------------------------------------
echo  Citizen Chat UI:       http://localhost:8000
echo  Documents Checklist:   http://localhost:8000/documents
echo  Helper Dashboard:      http://localhost:8000/dashboard
echo  Mock Gov Portal:       http://localhost:8001/portal/apply
echo  Mock Portal Status:    http://localhost:8001/portal/status
echo --------------------------------------------------

python -m uvicorn agent.main:app --host 0.0.0.0 --port 8000
