"""Shared pytest fixtures for NNPL backend tests.

Test isolation strategy
-----------------------
All test-generated documents are tagged with the prefix defined by
TEST_PREFIX (default "TEST_"). A session-scoped `_cleanup` fixture
deletes those documents at start-of-session and end-of-session so tests
never pollute production data — even when run against the live preview
environment.
"""
import os
import pytest
import requests
from pymongo import MongoClient


TEST_PREFIX = "TEST_"

# ---- Base URL ----
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    env_path = "/app/frontend/.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")
                    break

# ---- Admin credentials (from backend .env) ----
def _read_backend_env(key: str, default: str = "") -> str:
    path = "/app/backend/.env"
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                if line.startswith(f"{key}="):
                    return line.split("=", 1)[1].strip().strip('"')
    return os.environ.get(key, default)


ADMIN_EMAIL = _read_backend_env("ADMIN_EMAIL")
ADMIN_PASSWORD = _read_backend_env("ADMIN_PASSWORD")
MONGO_URL = _read_backend_env("MONGO_URL")
DB_NAME = _read_backend_env("DB_NAME")


def _cleanup_test_docs():
    """Wipe every document created by this suite (identified by TEST_PREFIX)."""
    if not (MONGO_URL and DB_NAME):
        return
    try:
        m = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
        db = m[DB_NAME]
        db.enquiries.delete_many({"name": {"$regex": f"^{TEST_PREFIX}"}})
        db.vendors.delete_many({"company_name": {"$regex": f"^{TEST_PREFIX}"}})
        m.close()
    except Exception:
        pass


@pytest.fixture(scope="session", autouse=True)
def _cleanup():
    _cleanup_test_docs()
    yield
    _cleanup_test_docs()


@pytest.fixture(scope="session")
def base_url():
    assert BASE_URL, "REACT_APP_BACKEND_URL not configured"
    return BASE_URL


@pytest.fixture(scope="session")
def admin_credentials():
    assert ADMIN_EMAIL and ADMIN_PASSWORD, "ADMIN_EMAIL/PASSWORD not set in backend .env"
    return {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture
def auth_token(api_client, base_url, admin_credentials):
    r = api_client.post(f"{base_url}/api/auth/login", json=admin_credentials, timeout=20)
    if r.status_code != 200:
        pytest.skip(f"Admin auth failed: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture
def authed_client(api_client, auth_token):
    api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
    return api_client
