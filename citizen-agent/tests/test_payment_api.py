import pytest
from httpx import AsyncClient, ASGITransport
from agent.main import app
from agent import db


@pytest.mark.asyncio
async def test_payment_order_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Create order
        create_res = await ac.post("/api/payments/create-order", json={
            "service_id": "caste_certificate",
            "service_title": "Caste Certificate",
            "amount": 1.0,
            "customer_name": "Test Citizen",
            "customer_email": "test@example.com",
            "customer_phone": "9999999999"
        })
        assert create_res.status_code == 200
        order = create_res.json()
        assert order["status"] == "PENDING"
        assert order["amount"] == 1.0
        order_id = order["order_id"]

        # 2. Verify status before payment
        verify_pending = await ac.post("/api/payments/verify", json={"order_id": order_id})
        assert verify_pending.status_code == 200
        assert verify_pending.json()["status"] == "PENDING"

        # 3. Confirm settlement
        import uuid
        test_utr = f"TEST-UTR-{uuid.uuid4().hex[:10]}"
        confirm_res = await ac.post("/api/payments/confirm", headers={
            "X-Admin-Key": "demo-admin-key-67890"
        }, json={
            "order_id": order_id,
            "txn_ref_id": test_utr,
            "amount": 1.0,
            "payer_vpa": "citizen@upi"
        })
        assert confirm_res.status_code == 200

        # 4. Verify status after payment
        verify_paid = await ac.post("/api/payments/verify", json={"order_id": order_id})
        assert verify_paid.status_code == 200
        assert verify_paid.json()["status"] == "PAID"
        assert verify_paid.json()["verified"] is True


@pytest.mark.asyncio
async def test_submit_utr_payment_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create order
        create_res = await ac.post("/api/payments/create-order", json={
            "service_id": "income_certificate",
            "service_title": "Income Certificate",
            "amount": 1.0,
            "customer_name": "Rahul Kumar"
        })
        order_id = create_res.json()["order_id"]

        # Check status before UTR (Must be PENDING, never bypassed)
        res1 = await ac.post("/api/payments/verify", json={"order_id": order_id})
        assert res1.json()["status"] == "PENDING"
        assert res1.json()["verified"] is False

        # Submit UTR
        import uuid
        sample_utr = f"4287{uuid.uuid4().int % 90000000 + 10000000}"
        res_utr = await ac.post("/api/payments/submit-utr", json={
            "order_id": order_id,
            "utr_number": sample_utr,
            "payer_vpa": "rahul@upi"
        })
        assert res_utr.status_code == 200
        assert res_utr.json()["status"] == "PAID"
        assert res_utr.json()["txn_ref_id"] == sample_utr

        # Verify status is now PAID
        res2 = await ac.post("/api/payments/verify", json={"order_id": order_id})
        assert res2.json()["status"] == "PAID"
        assert res2.json()["verified"] is True
