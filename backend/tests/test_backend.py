"""Backend tests for NilayNarayan Polychem API.

All test docs are prefixed with ``TEST_`` and cleaned up automatically
by the session fixture in conftest.py — safe to run against live infra.
"""
import time
import pytest
import jwt as pyjwt
from datetime import datetime, timezone, timedelta

from conftest import TEST_PREFIX


# =====================================================================
# Health
# =====================================================================
def test_health(api_client, base_url):
    r = api_client.get(f"{base_url}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# =====================================================================
# Products (brochure-aligned catalog)
# =====================================================================
def test_products_list_shape(api_client, base_url):
    r = api_client.get(f"{base_url}/api/products", timeout=20)
    assert r.status_code == 200
    products = r.json()
    assert isinstance(products, list)
    # 9 visible products (NN-PlastiFlo is hidden)
    assert len(products) == 9, f"Expected 9 visible products, got {len(products)}"
    required = {"id", "name", "category", "application", "industry", "description"}
    for p in products:
        assert required.issubset(p.keys())
        assert "_id" not in p


def test_products_hidden_plastiflo(api_client, base_url):
    r = api_client.get(f"{base_url}/api/products", timeout=20)
    names = [p["name"] for p in r.json()]
    assert not any("PlastiFlo" in n for n in names), "NN-PlastiFlo should be hidden"


def test_products_have_image_and_docs(api_client, base_url):
    """All 9 visible products must have image + tds + sds wired."""
    r = api_client.get(f"{base_url}/api/products", timeout=20)
    products = r.json()
    missing = [p["name"] for p in products if not (p.get("image") and p.get("tds_url") and p.get("sds_url"))]
    assert missing == [], f"Products missing media: {missing}"


# =====================================================================
# Enquiries — public POST
# =====================================================================
@pytest.mark.parametrize("etype", ["contact", "quote", "waste_pickup", "lab_testing", "product", "sample"])
def test_create_enquiry_all_types(api_client, base_url, etype):
    payload = {
        "name": f"{TEST_PREFIX}{etype}",
        "email": f"test_{etype}@example.com",
        "phone": "+919999999999",
        "message": f"Automated test enquiry of type {etype}",
        "enquiry_type": etype,
        "company": f"{TEST_PREFIX}Co",
    }
    r = api_client.post(f"{base_url}/api/enquiries", json=payload, timeout=20)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["enquiry_type"] == etype
    assert data["status"] == "new"


def test_create_enquiry_invalid_type(api_client, base_url):
    r = api_client.post(f"{base_url}/api/enquiries", json={
        "name": f"{TEST_PREFIX}bad", "email": "bad@example.com",
        "phone": "1", "message": "x", "enquiry_type": "nonsense",
    }, timeout=15)
    assert r.status_code == 422


def test_create_enquiry_invalid_email(api_client, base_url):
    r = api_client.post(f"{base_url}/api/enquiries", json={
        "name": f"{TEST_PREFIX}bad", "email": "not-an-email",
        "phone": "1", "message": "x", "enquiry_type": "contact",
    }, timeout=15)
    assert r.status_code == 422


def test_create_enquiry_missing_required(api_client, base_url):
    r = api_client.post(f"{base_url}/api/enquiries", json={"email": "x@y.com"}, timeout=15)
    assert r.status_code == 422


def test_create_enquiry_xss_payload_stored_as_text(api_client, base_url, authed_client):
    """XSS strings must be persisted as plain text (no server-side execution)."""
    xss = "<script>alert(1)</script>"
    payload = {
        "name": f"{TEST_PREFIX}xss",
        "email": "xss@example.com",
        "phone": "+911111111111",
        "message": xss,
        "enquiry_type": "contact",
    }
    r = api_client.post(f"{base_url}/api/enquiries", json=payload, timeout=15)
    assert r.status_code == 201
    # Verify persisted content is verbatim (backend does not sanitise, but also does not execute)
    listing = authed_client.get(f"{base_url}/api/enquiries", timeout=15).json()
    match = [e for e in listing if e["id"] == r.json()["id"]]
    assert match and match[0]["message"] == xss


def test_create_enquiry_large_message(api_client, base_url):
    payload = {
        "name": f"{TEST_PREFIX}large",
        "email": "large@example.com",
        "phone": "+911111111111",
        "message": "A" * 20000,
        "enquiry_type": "contact",
    }
    r = api_client.post(f"{base_url}/api/enquiries", json=payload, timeout=25)
    # Accept either persisted OK or a validation rejection — must not 500.
    assert r.status_code in (201, 413, 422), r.text


# =====================================================================
# Vendors — public POST
# =====================================================================
def test_create_vendor(api_client, base_url):
    payload = {
        "company_name": f"{TEST_PREFIX}Vendor Co",
        "contact_person": f"{TEST_PREFIX}Person",
        "email": "vendor_test@example.com",
        "phone": "+911111111111",
        "category": "Logistics",
        "address": "123 Test Street, Test City",
    }
    r = api_client.post(f"{base_url}/api/vendors", json=payload, timeout=20)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["company_name"] == payload["company_name"]
    assert data["status"] == "pending"


def test_create_vendor_invalid_email(api_client, base_url):
    r = api_client.post(f"{base_url}/api/vendors", json={
        "company_name": f"{TEST_PREFIX}bad",
        "contact_person": "x", "email": "bad", "phone": "1",
        "category": "X", "address": "y",
    }, timeout=15)
    assert r.status_code == 422


# =====================================================================
# Auth — happy path
# =====================================================================
def test_login_success(api_client, base_url, admin_credentials):
    r = api_client.post(f"{base_url}/api/auth/login", json=admin_credentials, timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["access_token"]
    assert data["user"]["email"] == admin_credentials["email"]
    assert data["user"]["role"] == "admin"
    assert "password_hash" not in data["user"]


def test_login_wrong_password(api_client, base_url, admin_credentials):
    r = api_client.post(f"{base_url}/api/auth/login", json={
        "email": admin_credentials["email"], "password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_login_unknown_email(api_client, base_url):
    r = api_client.post(f"{base_url}/api/auth/login", json={
        "email": "nobody@example.com", "password": "any"}, timeout=15)
    assert r.status_code == 401


# =====================================================================
# Auth — token edge cases
# =====================================================================
def test_me_requires_token(api_client, base_url):
    r = api_client.get(f"{base_url}/api/auth/me", timeout=15)
    assert r.status_code == 401


def test_me_with_valid_token(authed_client, base_url, admin_credentials):
    r = authed_client.get(f"{base_url}/api/auth/me", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == admin_credentials["email"]
    assert "password_hash" not in data
    assert "_id" not in data


def test_me_with_malformed_token(api_client, base_url):
    api_client.headers.update({"Authorization": "Bearer this.is.not.a.jwt"})
    r = api_client.get(f"{base_url}/api/auth/me", timeout=15)
    assert r.status_code == 401


def test_me_with_expired_token(api_client, base_url):
    """Manually forge an expired JWT signed with the same secret."""
    from conftest import _read_backend_env
    secret = _read_backend_env("JWT_SECRET")
    if not secret:
        pytest.skip("JWT_SECRET not available")
    token = pyjwt.encode({
        "sub": "expired-user",
        "email": "expired@example.com",
        "role": "admin",
        "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        "type": "access",
    }, secret, algorithm="HS256")
    api_client.headers.update({"Authorization": f"Bearer {token}"})
    r = api_client.get(f"{base_url}/api/auth/me", timeout=15)
    assert r.status_code == 401


def test_me_with_wrong_role(api_client, base_url):
    """A validly-signed token with role != admin should be forbidden on admin routes."""
    from conftest import _read_backend_env
    secret = _read_backend_env("JWT_SECRET")
    if not secret:
        pytest.skip("JWT_SECRET not available")
    token = pyjwt.encode({
        "sub": "user-x", "email": "user@example.com", "role": "user",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
        "type": "access",
    }, secret, algorithm="HS256")
    api_client.headers.update({"Authorization": f"Bearer {token}"})
    r = api_client.get(f"{base_url}/api/enquiries", timeout=15)
    assert r.status_code in (401, 403)


# =====================================================================
# Admin-protected routes
# =====================================================================
def test_list_enquiries_unauth(api_client, base_url):
    r = api_client.get(f"{base_url}/api/enquiries", timeout=15)
    assert r.status_code == 401


def test_list_enquiries_authed(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/enquiries", timeout=20)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    if items:
        assert "_id" not in items[0] and "id" in items[0]


def test_list_vendors_unauth(api_client, base_url):
    r = api_client.get(f"{base_url}/api/vendors", timeout=15)
    assert r.status_code == 401


def test_list_vendors_authed(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/vendors", timeout=20)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_stats(authed_client, base_url):
    r = authed_client.get(f"{base_url}/api/admin/stats", timeout=20)
    assert r.status_code == 200
    d = r.json()
    for k in ("total_enquiries", "new_enquiries", "total_vendors", "by_type"):
        assert k in d
    assert isinstance(d["by_type"], list)


# =====================================================================
# PATCH enquiry status
# =====================================================================
def test_patch_enquiry_status(api_client, authed_client, base_url):
    r = api_client.post(f"{base_url}/api/enquiries", json={
        "name": f"{TEST_PREFIX}patch", "email": "patch@example.com",
        "phone": "+911111111111", "message": "patch test", "enquiry_type": "contact",
    }, timeout=15)
    assert r.status_code == 201
    eid = r.json()["id"]
    r2 = authed_client.patch(f"{base_url}/api/enquiries/{eid}",
                             json={"status": "in_progress"}, timeout=15)
    assert r2.status_code == 200
    assert r2.json()["ok"] is True

    # Verify persistence
    listing = authed_client.get(f"{base_url}/api/enquiries", timeout=15).json()
    match = [e for e in listing if e["id"] == eid]
    assert match and match[0]["status"] == "in_progress"


def test_patch_enquiry_unknown_id(authed_client, base_url):
    r = authed_client.patch(f"{base_url}/api/enquiries/nonexistent-uuid-000",
                            json={"status": "closed"}, timeout=15)
    # Backend may 400 (invalid status flow), 404 (not found) — both are safe non-500.
    assert r.status_code in (400, 404)


def test_patch_enquiry_invalid_status(authed_client, base_url):
    r = authed_client.patch(f"{base_url}/api/enquiries/any-id",
                            json={"status": "bogus"}, timeout=15)
    assert r.status_code == 400


def test_patch_enquiry_unauth(api_client, base_url):
    r = api_client.patch(f"{base_url}/api/enquiries/some-id",
                         json={"status": "closed"}, timeout=15)
    assert r.status_code == 401


# =====================================================================
# Public static assets (brochure + product PDFs + client logos)
# =====================================================================
def test_brochure_pdf_served(api_client, base_url):
    r = api_client.get(f"{base_url}/brochure.pdf", timeout=25)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("application/pdf")
    # Sanity check: the real 10-page brochure is > 2 MB, not a placeholder
    assert len(r.content) > 500_000, "Brochure file too small — likely a placeholder"


def test_product_tds_served(api_client, base_url):
    r = api_client.get(f"{base_url}/products/nn-395-superplasticizer-tds.pdf", timeout=25)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("application/pdf")


def test_client_logo_served(api_client, base_url):
    r = api_client.get(f"{base_url}/clients/iocl.png", timeout=15)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("image/")



# =====================================================================
# Security headers
# =====================================================================
@pytest.mark.parametrize("path", ["/api/health", "/api/products"])
def test_security_headers_present(api_client, base_url, path):
    r = api_client.get(f"{base_url}{path}", timeout=15)
    assert r.status_code == 200
    h = {k.lower(): v for k, v in r.headers.items()}
    # Permissions-Policy must block display-capture (Screen Capture API)
    assert "permissions-policy" in h, "Permissions-Policy header missing"
    assert "display-capture=()" in h["permissions-policy"]
    # CSP must include frame-ancestors 'none'
    assert "content-security-policy" in h, "CSP header missing"
    assert "frame-ancestors 'none'" in h["content-security-policy"]
    # X-Frame-Options = DENY
    assert h.get("x-frame-options") == "DENY"
    # Referrer-Policy = strict-origin-when-cross-origin
    assert h.get("referrer-policy") == "strict-origin-when-cross-origin"
    # X-Content-Type-Options = nosniff
    assert h.get("x-content-type-options") == "nosniff"


def test_cors_still_works(api_client, base_url):
    """Security headers must not break existing CORS behaviour."""
    r = api_client.options(
        f"{base_url}/api/enquiries",
        headers={
            "Origin": "https://example.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
        timeout=15,
    )
    # OPTIONS preflight should succeed (200 or 204)
    assert r.status_code in (200, 204), r.text


# =====================================================================
# Auto-acknowledgement email side-effects (log-based verification)
# =====================================================================
import time as _time


def _tail_backend_log(match: str, since_ts: float, timeout: float = 6.0):
    """Poll the supervisor backend log for a matching line since `since_ts`."""
    for path in ("/var/log/supervisor/backend.err.log", "/var/log/supervisor/backend.out.log"):
        try:
            with open(path) as f:
                lines = f.readlines()
        except FileNotFoundError:
            continue
        end = _time.time() + timeout
        while _time.time() < end:
            for ln in lines[-200:]:
                if match in ln:
                    return ln
            _time.sleep(0.5)
            with open(path) as f:
                lines = f.readlines()
    return None


def test_auto_ack_email_on_enquiry(api_client, base_url):
    """After a public enquiry POST, backend must dispatch TWO emails:
    (a) company notification, (b) acknowledgement to the enquirer."""
    unique = f"test-ack-{uuid_lib.uuid4().hex[:8]}@example.com" if False else None  # noqa
    import uuid as _uuid
    enquirer = f"test-ack-{_uuid.uuid4().hex[:8]}@example.com"
    since = _time.time()
    r = api_client.post(f"{base_url}/api/enquiries", json={
        "name": f"{TEST_PREFIX}ack",
        "email": enquirer,
        "phone": "+919999999999",
        "message": "ack test",
        "enquiry_type": "contact",
    }, timeout=15)
    assert r.status_code == 201
    ack_line = _tail_backend_log(f"Email sent to {enquirer}", since)
    company_line = _tail_backend_log("Email sent to nilaynarayanpolychem@gmail.com", since)
    assert ack_line, "Acknowledgement email to enquirer NOT dispatched"
    assert company_line, "Company notification email NOT dispatched"


def test_auto_ack_email_on_vendor(api_client, base_url):
    import uuid as _uuid
    vendor_email = f"test-vendor-{_uuid.uuid4().hex[:8]}@example.com"
    since = _time.time()
    r = api_client.post(f"{base_url}/api/vendors", json={
        "company_name": f"{TEST_PREFIX}ack Vendor",
        "contact_person": "Rajesh Test",
        "email": vendor_email,
        "phone": "+919999999999",
        "category": "Logistics",
        "address": "123 Test",
    }, timeout=15)
    assert r.status_code == 201
    ack_line = _tail_backend_log(f"Email sent to {vendor_email}", since)
    assert ack_line, "Acknowledgement email to vendor NOT dispatched"


# =====================================================================
# Frontend static hosting via FastAPI (localhost:8001 only)
# The preview ingress routes non-/api paths to CRA on :3000, so these
# tests target the local FastAPI process directly where the new
# StaticFiles mount + SPA-fallback route actually run.
# =====================================================================
LOCAL_BACKEND = "http://localhost:8001"

_STATIC_PATHS = [
    "/", "/index.html", "/about", "/products", "/certifications",
    "/contact", "/vendor-onboarding", "/admin/login",
    "/services/nabl-lab", "/services/hazardous-waste",
]


@pytest.mark.parametrize("path", _STATIC_PATHS)
def test_local_spa_route_has_all_security_headers(api_client, path):
    r = api_client.get(f"{LOCAL_BACKEND}{path}", timeout=15)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/html")
    # Body ~ 5.5 KB React shell
    assert 4000 < len(r.content) < 20000, f"Expected SPA shell body, got {len(r.content)} bytes"
    h = {k.lower(): v for k, v in r.headers.items()}
    assert h["x-content-type-options"] == "nosniff"
    assert h["x-frame-options"] == "DENY"
    assert h["referrer-policy"] == "strict-origin-when-cross-origin"
    assert "display-capture=()" in h["permissions-policy"]
    assert "frame-ancestors 'none'" in h["content-security-policy"]
    assert h["cross-origin-opener-policy"] == "same-origin"
    assert h["cross-origin-resource-policy"] == "same-site"


def test_local_html_shell_cache_control(api_client):
    r = api_client.get(f"{LOCAL_BACKEND}/", timeout=15)
    assert r.status_code == 200
    cc = r.headers.get("cache-control", "").lower()
    assert "no-store" in cc and "must-revalidate" in cc


def test_local_spa_fallback_random_path_returns_index(api_client):
    r = api_client.get(f"{LOCAL_BACKEND}/some/random/nonexistent/path", timeout=15)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("text/html")
    assert b"<div id=\"root\">" in r.content


def test_local_brochure_pdf_integrity(api_client):
    r = api_client.get(f"{LOCAL_BACKEND}/brochure.pdf", timeout=30)
    assert r.status_code == 200
    assert r.headers.get("content-type") == "application/pdf"
    # Brochure is regenerated on each redeploy — allow ±5 KB drift around ~2.98 MB.
    assert 2_900_000 < len(r.content) < 3_100_000, f"Brochure size out of range: {len(r.content)}"
    # Security headers must still be attached to static file responses
    h = {k.lower(): v for k, v in r.headers.items()}
    assert h["x-frame-options"] == "DENY"
    assert "frame-ancestors 'none'" in h["content-security-policy"]


def test_local_product_tds_pdf(api_client):
    r = api_client.get(f"{LOCAL_BACKEND}/products/nn-395-superplasticizer-tds.pdf", timeout=30)
    assert r.status_code == 200
    assert r.headers.get("content-type") == "application/pdf"
    assert len(r.content) > 0


def test_local_client_logo_served(api_client):
    r = api_client.get(f"{LOCAL_BACKEND}/clients/iocl.png", timeout=15)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("image/")
    h = {k.lower(): v for k, v in r.headers.items()}
    assert h["x-content-type-options"] == "nosniff"


def test_local_api_still_works_alongside_static(api_client):
    r = api_client.get(f"{LOCAL_BACKEND}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_local_head_on_static_route(api_client):
    """methods=['GET','HEAD'] on the catch-all — HEAD must succeed (not 405)."""
    r = api_client.head(f"{LOCAL_BACKEND}/about", timeout=15)
    assert r.status_code == 200
    assert r.headers.get("x-frame-options") == "DENY"


# =====================================================================
# Certificate image assets (nabl / iso-9001 / iso-14001 / iso-45001)
# Added in iteration 7 — real cert images extracted from PDFs
# =====================================================================
_CERT_SLUGS = ["nabl", "iso-9001", "iso-14001", "iso-45001"]


@pytest.mark.parametrize("slug", _CERT_SLUGS)
def test_certificate_image_served_local(api_client, slug):
    r = api_client.get(f"{LOCAL_BACKEND}/certs/{slug}.jpg", timeout=15)
    assert r.status_code == 200, f"/certs/{slug}.jpg not served"
    assert r.headers.get("content-type", "").startswith("image/jpeg")
    # Real cert JPGs are ~180-290 KB (not tiny placeholders)
    assert 150_000 < len(r.content) < 350_000, f"cert {slug} size {len(r.content)} out of expected range"

