# NilayNarayan Polychem LLP — Production Readiness Audit Report

**Date:** 04 Feb 2026
**Auditor:** E1 (main) + `testing_agent_v3_fork` iteration 2
**Verdict:** ✅ **GO — production-ready**

Test evidence: `/app/test_reports/iteration_2.json`, `/app/test_reports/pytest/pytest_results.xml`

---

## 1. Severity Summary

| Severity | Count | Notes |
|---|---|---|
| **Critical** | 0 | All previously-known criticals fixed in this audit |
| **High** | 0 | date-fns conflict resolved; CORS+creds hardened; admin fallback removed |
| **Medium** | 5 | See §4 (all non-blocking observations from testing agent) |
| **Low** | 0 | — |

---

## 2. Issues Fixed in This Audit

| # | Was | Fix | File / Line |
|---|---|---|---|
| C1 | CORS mixed `allow_origins=["*"]` with `allow_credentials=True` (browser-rejected combo) | Auto-disable `allow_credentials` when `*` is present; only allow explicit methods/headers | `backend/server.py` lines 505–518 |
| C2 | Admin credentials fell back to `admin@nilaynarayan.com` / `admin123` when env vars missing | Removed defaults; `ADMIN_EMAIL` and `ADMIN_PASSWORD` are now required env keys (fail-fast at import) | `backend/server.py` lines 33–36; `admin` seed fn |
| H1 | `date-fns ^4.1.0` conflicted with `react-day-picker@8.10.1` peer dep | Pinned `date-fns@3.6.0` | `frontend/package.json` |
| H2 | Backend tests wrote to real Mongo without cleanup — could pollute prod data | All test docs now prefixed `TEST_`; a session-scoped `_cleanup` fixture wipes them at start and end of run | `backend/tests/conftest.py` |
| H3 | Email delivery was SMTP-placeholder only; forms silently logged instead of sending | Wired **Emergent-managed Resend**; every enquiry/vendor submission emails `nilaynarayanpolychem@gmail.com` with the enquirer's email as Reply-To | `backend/server.py` lines 82–124, 396–404, 456–470 |
| H4 | WhatsApp / phone routing didn't match business intent | Sales (+91 91994 39902) is now primary WhatsApp & Call-Us top item; Operations & Compliance follow | `frontend/src/lib/company.js` |

---

## 3. Test Matrix (37 backend tests + full FE E2E)

### Backend (pytest, 37/37 ✅)

| Category | Tests | Result |
|---|---|---|
| Health | 1 | ✅ |
| Products (shape, hidden PlastiFlo, image+tds+sds) | 3 | ✅ |
| Enquiries — 6 types + XSS + invalid variants + large body | 10 | ✅ |
| Vendors — happy + invalid email | 2 | ✅ |
| Auth — login happy, wrong pw, unknown email | 3 | ✅ |
| Auth token — /me guarded, valid, malformed, expired, wrong-role | 5 | ✅ |
| Admin — list enquiries/vendors + stats (unauth vs authed) | 5 | ✅ |
| PATCH enquiry status — happy, unknown id, invalid status, unauth | 4 | ✅ |
| Static assets — brochure + product TDS + client logo | 3 | ✅ |
| CORS response headers | 1 | ✅ |

### Frontend E2E (Playwright)
- Home hero + headline ✅
- WhatsApp href = `wa.me/919199439902?text=…` ✅
- Call-Us dropdown order Sales → Operations → Compliance ✅
- Client Marquee: 18 logos rendered ✅
- Products page: 9 products, all images loaded, "BATCH TESTED" badges ✅
- Gated TDS/SDS: form → submit → PDF download initiated ✅
- Contact form → success ✅
- Vendor onboarding → success ✅
- About page: real leadership + management portraits ✅
- Industries page: 9 real client logo PNGs + 1 fallback ✅
- Brochure download (blob, 2.9 MB real file) ✅
- `/projects` hidden → 404 ✅
- Admin login → dashboard → PATCH enquiry status ✅
- Unauthenticated `/admin/dashboard` → redirects to login ✅
- All 10 navigable pages: 0 console errors ✅

### Production Readiness Checks
- Fresh install: `yarn install` clean; no peer-dep resolutions after `date-fns` pin
- Frontend build: `yarn build` succeeds, 180 kB gzipped JS, 13.5 kB gzipped CSS
- Backend boot: fails fast with `KeyError` on missing `MONGO_URL` / `JWT_SECRET` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` (safe)
- CORS: `Access-Control-Allow-Credentials` absent when `*` present (correct)
- Real email delivery: 202 Accepted from Emergent proxy on every enquiry POST (log-verified)
- Live emails going to `nilaynarayanpolychem@gmail.com`
- MongoDB has no `TEST_`-prefixed docs after the audit

---

## 4. Medium-severity Observations (Non-blocking)

| # | Observation | Recommended Action | Impact |
|---|---|---|---|
| M1 | Two logout controls in Admin dashboard (top-bar + sidebar) | Keep sidebar only, drop top-bar duplicate | Cosmetic |
| M2 | `@app.on_event("startup")` is deprecated (FastAPI 0.110) | Migrate to `lifespan` context manager | Warning-level |
| M3 | JWT stored in `localStorage` (`nn_admin_token`) | Consider `httpOnly` cookie for defense-in-depth against XSS | Marginal; site already has anti-tamper shield |
| M4 | `server.py` is ~525 lines | Split into `routers/`, `models/`, `auth.py` before it grows further | Maintainability |
| M5 | Email dispatch is fire-and-forget | Persist `email_delivery_status` on enquiry docs so admin can see failed sends | Observability |

---

## 5. Deployment Smoke Test Commands

```bash
# 1. Backend health
curl -s $REACT_APP_BACKEND_URL/api/health
# → {"status":"healthy","time":"..."}

# 2. Product catalog integrity
curl -s $REACT_APP_BACKEND_URL/api/products | jq 'length'
# → 9

# 3. Full pytest suite (< 10 s)
cd /app/backend/tests && python -m pytest -q
# → 37 passed

# 4. Frontend build
cd /app/frontend && yarn build
# → build folder is ready to be deployed
```

---

## 6. Content Regression vs Brochure

All 9 visible products, 3 leadership + 4 management portraits, 9 real client logos, JSPCB authorisation body, real capacities on Hazardous Waste page, real NABL Lab scope, correct address & pincode — **all match the source-of-truth brochure PDF** (verified page-by-page by the testing agent).

---

## 7. Verdict

### ✅ **GO for Production**

- 0 Critical / 0 High issues open
- All previously-known blockers resolved and verified
- 37/37 backend tests pass; full FE E2E green; 0 console errors on any page
- Email delivery live; static asset routing verified; CORS hardened; admin auth secure

The site can be deployed to production **as-is**. The 5 Medium observations are polish items to schedule for the next iteration, none block release.
