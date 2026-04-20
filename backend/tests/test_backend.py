"""Backend tests for NilayNarayan Polychem API."""
import pytest
import requests


# ---------- Health ----------
def test_health(api_client, base_url):
    r = api_client.get(f"{base_url}/api/health", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"


# ---------- Products ----------
def test_products_list_and_shape(api_client, base_url):
    r = api_client.get(f"{base_url}/api/products", timeout=20)
    assert r.status_code == 200
    products = r.json()
    assert isinstance(products, list)
    assert len(products) >= 8, f"Expected 8 seeded products, got {len(products)}"
    required = {"id", "name", "category", "application", "industry", "description", "tds_url", "sds_url"}
    for p in products:
        assert required.issubset(p.keys()), f"Missing keys: {required - set(p.keys())}"
        assert "_id" not in p


# ---------- Enquiries (public create) ----------
@pytest.mark.parametrize("enquiry_type", ["contact", "quote", "waste_pickup", "lab_testing", "product", "sample"])
def test_create_enquiry_all_types(api_client, base_url, enquiry_type):
    payload = {
        "name": f"TEST_{enquiry_type}",
        "email": f"test_{enquiry_type}@example.com",
        "phone": "+919999999999",
        "message": f"Automated test enquiry of type {enquiry_type}",
        "enquiry_type": enquiry_type,
        "company": "TEST Co",
    }
    r = api_client.post(f"{base_url}/api/enquiries", json=payload, timeout=20)
    assert r.status_code == 201, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str)
    assert data["name"] == payload["name"]
    assert data["enquiry_type"] == enquiry_type
    assert data["status"] == "new"


def test_create_enquiry_invalid_type(api_client, base_url):
    payload = {
        "name": "TEST_bad",
        "email": "bad@example.com",
        "phone": "1234567",
        "message": "invalid type test",
        "enquiry_type": "nonsense",
    }
    r = api_client.post(f"{base_url}/api/enquiries", json=payload, timeout=20)
    assert r.status_code == 422


# ---------- Vendors (public create) ----------
def test_create_vendor(api_client, base_url):
    payload = {
        "company_name": "TEST_Vendor Co",
        "contact_person": "TEST Person",
        "email": "vendor_test@example.com",
        "phone": "+911111111111",
        "category": "Logistics",
        "address": "123 Test Street, Test City",
    }
    r = api_client.post(f"{base_url}/api/vendors", json=payload, timeout=20)
    assert r.status_code == 201, r.text
    data = r.json()
    assert "id" in data
    assert data["company_name"] == payload["company_name"]
    assert data["status"] == "pending"


# ---------- Auth ----------
def test_login_success(api_client, base_url):
    r = api_client.post(
        f"{base_url}/api/auth/login",
        json={"email": "admin@nilaynarayan.com", "password": "NN@dmin2025"},
        timeout=20,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data and data["access_token"]
    assert data["user"]["email"] == "admin@nilaynarayan.com"
    assert data["user"]["role"] == "admin"


def test_login_wrong_password(api_client, base_url):
    r = api_client.post(
        f"{base_url}/api/auth/login",
        json={"email": "admin@nilaynarayan.com", "password": "wrongpass"},
        timeout=20,
    )
    assert r.status_code == 401


def test_me_requires_token(api_client, base_url):
    r = api_client.get(f"{base_url}/api/auth/me", timeout=15)
    assert r.status_code == 401


def test_me_with_token(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/auth/me", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "admin@nilaynarayan.com"
    assert "password_hash" not in data
    assert "_id" not in data


# ---------- Admin protected ----------
def test_list_enquiries_unauthenticated(api_client, base_url):
    r = api_client.get(f"{base_url}/api/enquiries", timeout=15)
    assert r.status_code == 401


def test_list_enquiries_authenticated(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/enquiries", timeout=20)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    if items:
        assert "_id" not in items[0]
        assert "id" in items[0]


def test_list_vendors_unauthenticated(api_client, base_url):
    r = api_client.get(f"{base_url}/api/vendors", timeout=15)
    assert r.status_code == 401


def test_list_vendors_authenticated(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/vendors", timeout=20)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    if items:
        assert "_id" not in items[0]


def test_admin_stats(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/admin/stats", timeout=20)
    assert r.status_code == 200
    data = r.json()
    for k in ("total_enquiries", "new_enquiries", "total_vendors", "by_type"):
        assert k in data
    assert isinstance(data["by_type"], list)
    assert data["total_enquiries"] >= 1


def test_patch_enquiry_status(api_client, authed_client, base_url):
    # Create a fresh enquiry
    payload = {
        "name": "TEST_patch",
        "email": "patch@example.com",
        "phone": "+91900000000",
        "message": "patch status test",
        "enquiry_type": "contact",
    }
    r = api_client.post(f"{base_url}/api/enquiries", json=payload, timeout=20)
    assert r.status_code == 201
    eid = r.json()["id"]

    # Update status -> in_progress
    r2 = authed_client.patch(f"{base_url}/api/enquiries/{eid}", json={"status": "in_progress"}, timeout=20)
    assert r2.status_code == 200
    assert r2.json().get("ok") is True

    # Verify persistence via listing
    r3 = authed_client.get(f"{base_url}/api/enquiries", timeout=20)
    assert r3.status_code == 200
    match = [e for e in r3.json() if e["id"] == eid]
    assert match and match[0]["status"] == "in_progress"


def test_patch_enquiry_invalid_status(authed_client, base_url):
    r = authed_client.patch(
        f"{base_url}/api/enquiries/nonexistent-id", json={"status": "bogus"}, timeout=15
    )
    assert r.status_code == 400


def test_patch_enquiry_unauth(api_client, base_url):
    r = api_client.patch(
        f"{base_url}/api/enquiries/some-id", json={"status": "closed"}, timeout=15
    )
    assert r.status_code == 401
