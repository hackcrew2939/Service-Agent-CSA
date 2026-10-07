#!/usr/bin/env bash
# run.sh – One-command startup for Citizen Service Agent
set -e

echo "=================================================="
echo " Starting Citizen Service Agent & Mock Portal"
echo "=================================================="

# 1. Start Mock Portal on Port 8001
echo "[1/3] Starting Mock Government Portal on port 8001..."
python -m uvicorn portal.main:app --host 0.0.0.0 --port 8001 &
PORTAL_PID=$!

# Trap exit to cleanup background portal process
trap "kill $PORTAL_PID 2>/dev/null || true" EXIT

# 2. Wait for portal health check
echo "[2/3] Waiting for Mock Portal to become healthy..."
for i in {1..30}; do
    if curl -s http://localhost:8001/api/health > /dev/null; then
        echo "Mock Portal is healthy!"
        break
    fi
    sleep 1
done

# 3. Start Agent Backend on Port 8000
echo "[3/3] Starting Agent Backend on port 8000..."
echo "--------------------------------------------------"
echo " Citizen Chat UI:       http://localhost:8000"
echo " Documents Checklist:   http://localhost:8000/documents"
echo " Helper Dashboard:      http://localhost:8000/dashboard"
echo " Mock Gov Portal:       http://localhost:8001/portal/apply"
echo " Mock Portal Status:    http://localhost:8001/portal/status"
echo "--------------------------------------------------"

python -m uvicorn agent.main:app --host 0.0.0.0 --port 8000
