/**
 * dashboard/dashboard.js – Helper Dashboard client logic
 */

let helperToken = 'dev-helper-token';

window.addEventListener('DOMContentLoaded', () => {
    loadAuditLog();
    loadEscalations();
});

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    
    document.getElementById(`tab-btn-${tab}`).classList.add('active');
    document.getElementById(`tab-${tab}`).style.display = 'block';
}

async function loadAuditLog() {
    const tableBody = document.getElementById('auditTableBody');
    tableBody.innerHTML = '<tr><td colspan="7">Loading audit log...</td></tr>';

    try {
        const res = await fetch('/api/audit', {
            headers: { 'Authorization': `Bearer ${helperToken}` }
        });
        const data = await res.json();
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No audit records found</td></tr>';
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.timestamp}</td>
                <td>${row.actor}</td>
                <td><strong>${row.action}</strong></td>
                <td>${row.reason || ''}</td>
                <td>${row.result || ''}</td>
                <td><code>${row.row_hash ? row.row_hash.substring(0, 16) + '...' : ''}</code></td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="7" style="color:red;">Error: ${err.message}</td></tr>`;
    }
}

async function verifyAuditChain() {
    const resultSpan = document.getElementById('verifyResult');
    resultSpan.innerText = 'Verifying hash chain...';

    try {
        const res = await fetch('/api/audit/verify', {
            headers: { 'Authorization': `Bearer ${helperToken}` }
        });
        const data = await res.json();

        if (data.valid) {
            resultSpan.className = 'badge badge-valid';
            resultSpan.innerText = `LOG INTACT: ${data.total_rows} rows verified (Head: ${data.head_hash.substring(0, 10)}...)`;
        } else {
            resultSpan.className = 'badge badge-invalid';
            resultSpan.innerText = `TAMPER DETECTED: Chain broken at row ${data.broken_row}`;
        }
    } catch (err) {
        resultSpan.className = 'badge badge-invalid';
        resultSpan.innerText = 'Verification error: ' + err.message;
    }
}

function exportAuditCSV() {
    window.open('/api/audit?format=csv', '_blank');
}

async function loadEscalations() {
    const tableBody = document.getElementById('escalationsTableBody');
    tableBody.innerHTML = '<tr><td colspan="6">Loading escalations...</td></tr>';

    try {
        const res = await fetch('/api/escalations', {
            headers: { 'Authorization': `Bearer ${helperToken}` }
        });
        const data = await res.json();
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No escalations in queue</td></tr>';
            return;
        }

        data.forEach(esc => {
            const tr = document.createElement('tr');
            let badgeClass = 'badge-open';
            if (esc.status === 'IN_PROGRESS') badgeClass = 'badge-progress';
            else if (esc.status === 'RESOLVED') badgeClass = 'badge-resolved';

            tr.innerHTML = `
                <td>#${esc.id}</td>
                <td><code>${esc.session_id.substring(0, 8)}...</code></td>
                <td>${esc.reason}</td>
                <td><span class="badge ${badgeClass}">${esc.status}</span></td>
                <td>${esc.assigned_helper || 'Unassigned'}</td>
                <td>
                    ${esc.status === 'OPEN' ? `<button class="btn btn-primary" onclick="takeoverEscalation(${esc.id})">Take Over</button>` : ''}
                    ${esc.status === 'IN_PROGRESS' ? `
                        <button class="btn btn-primary" onclick="promptMessage(${esc.id})">Message</button>
                        <button class="btn btn-success" onclick="resolveEscalation(${esc.id})">Resolve</button>
                    ` : ''}
                    <a href="/api/cases/${esc.session_id}/report?format=html" target="_blank" style="margin-left:8px; font-size:12px;">Case Report</a>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="6" style="color:red;">Error: ${err.message}</td></tr>`;
    }
}

async function takeoverEscalation(escId) {
    try {
        await fetch(`/api/escalations/${escId}/takeover`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${helperToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ helper_id: 'Helper-Staff-1' })
        });
        loadEscalations();
    } catch (err) {
        alert('Takeover failed: ' + err.message);
    }
}

async function promptMessage(escId) {
    const text = prompt("Enter message to send to the citizen:");
    if (!text) return;

    try {
        await fetch(`/api/escalations/${escId}/message`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${helperToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, helper_id: 'Helper-Staff-1' })
        });
        alert('Message sent.');
    } catch (err) {
        alert('Failed to send message: ' + err.message);
    }
}

async function resolveEscalation(escId) {
    const notes = prompt("Enter resolution notes:");
    try {
        await fetch(`/api/escalations/${escId}/resolve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${helperToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes: notes || 'Resolved by staff', helper_id: 'Helper-Staff-1' })
        });
        loadEscalations();
    } catch (err) {
        alert('Failed to resolve: ' + err.message);
    }
}
