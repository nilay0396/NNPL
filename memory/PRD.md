# NilayNarayan Polychem LLP — Product Requirements Document

## Original Problem Statement
Build a production-ready, modern corporate website for NilayNarayan Polychem LLP — an industrial company in Speciality Chemicals Manufacturing, Authorized Hazardous Waste Management & Recycling (TSDF, Co-processing, Value Recovery), and NABL Accredited Environmental Testing Lab. Primary goals: lead generation, tender credibility, product enquiries, waste disposal enquiries, lab testing enquiries, vendor onboarding, brochure downloads, WhatsApp/Call/Email conversions.

## User Personas
1. **Industrial EHS Manager** — evaluates hazardous waste vendors against compliance criteria
2. **Government Tender Committee** — needs certifications, authorisations and case studies
3. **Plant Procurement Head** — sources speciality chemicals and requests TDS/SDS
4. **Environmental Consultant** — books NABL lab testing on behalf of industrial clients
5. **Vendor / Supplier** — submits empanelment application

## Core Requirements (Static)
- Pages: Home, About, Services (parent + HazWaste detail + NABL Lab detail), Products, Industries, Certifications, Projects, Contact, Vendor Onboarding, Admin Login, Admin Dashboard
- Design: Deep navy (#0B192C) + Emerald (#047857) + Steel grey, Cabinet Grotesk + IBM Plex Sans, sharp corners, grid-border layouts
- Global: sticky crystal-glass header, floating WhatsApp, downloadable brochure
- Backend: all forms persisted to MongoDB + best-effort email forwarding (SMTP placeholder)
- Admin: JWT Bearer auth, single admin seeded from env

## Architecture
- **Backend**: FastAPI + Motor/MongoDB. Collections: `users`, `enquiries`, `vendors`, `products`. JWT auth, bcrypt hashing, idempotent admin seed.
- **Frontend**: React + React Router. `api.js` axios instance with auto Bearer token injection.
- **Endpoints**: `/api/health`, `/api/products`, `/api/enquiries` (POST public / GET+PATCH admin), `/api/vendors` (POST public / GET admin), `/api/auth/login`, `/api/auth/me`, `/api/admin/stats`
- **Email**: `send_email_async` logs payload when SMTP vars missing — production-ready when SMTP_HOST/USER/PASSWORD set in `.env`

## Implemented (v1 · Dec 2025)
- [x] Full 11-page marketing website (Home → Admin) with data-testid coverage
- [x] 8 services pillars across HazWaste detail page (TSDF, Co-processing, Recycling, Value Recovery, Waste Categories, Process Flow, Industries, Regulatory Compliance)
- [x] NABL Lab detail page (4 testing categories, scope, sample collection, TAT, reports)
- [x] Product catalog (8 seeded speciality chemicals) with TDS/SDS placeholder downloads, search + category filter
- [x] 4 case-study projects (PSU, Cement co-processing, Pharma cluster, Refinery catalyst recovery)
- [x] 8 certifications with placeholder download buttons
- [x] Contact form + Quote dialog + Vendor onboarding form → MongoDB + email forwarding
- [x] Admin panel: login, dashboard stats, enquiries table w/ status update, vendors grid
- [x] Floating WhatsApp (click-to-chat), sticky header "Get Quote", global brochure download
- [x] Google Maps embed (Ankleshwar placeholder)
- [x] Seed SMTP placeholders, company contact placeholders ready for real-value drop-in
- [x] **Feb 2026** — Real leadership & management team photos wired into `/app/frontend/public/team/` and rendered on `About.jsx` (grayscale → color hover). 7 photos: Dr. Jagdish, Ansul Kumar, Nilay Kumar, Sourav Kumar Mondal, Ombir Singh, Shubham Mandal, Ompal Singh. Fixed name spelling "Saurabh" → "Sourav".
- [x] **Feb 2026** — Extracted 9 client logos directly from the company brochure PDF (page 9) via `pdfimages`, placed at `/app/frontend/public/clients/` as `iocl.png`, `tata-mpl-jv.png`, `bccl.png`, `dvc.png`, `indane.png`, `indian-railways.png`, `technip-energies.png`, `acc-cement.png`, `gail.png`. Maithon Power gracefully falls back to text tile (no logo in brochure).
- [x] **Feb 2026** — Added subtle auto-scrolling `ClientMarquee` component under the Home hero — infinite-loop CSS animation (42s), pauses on hover, respects `prefers-reduced-motion`, edge fade masks, grayscale-to-color on hover.
- [x] **Feb 2026** — Hid Projects section (removed from Header nav, Footer, and App routes). `Projects.jsx` retained for future re-enable.
- [x] **Feb 2026** — NN-395 Superplasticizer: added real product image + gated TDS/SDS downloads. Files at `/app/frontend/public/products/`. Product schema extended with `image` field. Download triggers automatically only after the enquiry form is successfully submitted (which also emails the request to the company).
- [x] **Feb 2026** — NN-CalNit Calcium Nitrate: added real product image + gated TDS/SDS downloads (same flow as NN-395).
- [x] **Feb 2026** — NN-RockBond Cement Capsule: added real product image + gated TDS/SDS downloads (same flow).
- [x] **Feb 2026** — NN-DustGuard PSPP: added real product image + gated TDS/SDS downloads (same flow).
- [x] **Feb 2026** — NN-PyroShield STC-I: added real product image + gated TDS/SDS downloads (same flow).

## Testing
- Regression suite: `pytest /app/backend/tests/test_backend.py` — **22/22 pass**
- Frontend e2e via testing subagent — all flows verified
- Admin credentials: see `/app/memory/test_credentials.md`

## Prioritised Backlog

### P1 (Next iteration)
- CMS-style admin edit views for Products, Certifications and Projects (currently code-seeded)
- Real SMTP integration (Resend / SendGrid) once API key is provided
- Blog / Insights page for SEO
- Contact form CAPTCHA to prevent spam

### P2 (Nice to have)
- Client login portal for downloading past lab reports & manifests
- Multi-language (English + Hindi + Gujarati)
- OG-image per page and richer structured data (Organization/LocalBusiness JSON-LD already recommended)
- Replace placeholder brochure.pdf + 8 cert PDFs with real signed copies (upload path reserved at `/assets/certs/...` and `/assets/tds/...`)

### P3 (Future)
- Waste-pickup schedule portal (customer-side)
- Live fleet tracking for waste transport
- Automated e-manifest generation integration with CPCB portal

## Environment
- Backend `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `COMPANY_CONTACT_EMAIL`, `SMTP_*`
- Frontend `.env`: `REACT_APP_BACKEND_URL`
