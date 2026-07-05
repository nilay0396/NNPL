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
- [x] **Feb 2026** — NN-PyroShield STC-II: added real product image + gated TDS/SDS downloads (same flow).
- [x] **Feb 2026** — NN-AluBond High Alumina Binder: added real product image + gated TDS/SDS downloads (same flow).
- [x] **Feb 2026** — NN-RockGrout Resin Capsule: added real product image + gated TDS/SDS downloads (same flow).
- [x] **Feb 2026** — NN-Emul SMO: added real product image + gated TDS/SDS downloads (same flow).
- [x] **Feb 2026** — NN-PlastiFlo Water Reducer: **hidden** from catalog and enquiry dropdown until assets are provided. Backend seed commented, entry preserved for easy re-enable.
- [x] **Feb 2026** — Contact routing update: Call-Us dropdown reordered (Sales · Operations · Compliance) with corrected numbers. Sales = +91 91994 39902 (also the primary WhatsApp line). Operations = +91 80843 71124. Compliance = +91 82925 84106.
- [x] **Feb 2026** — Email delivery live via **Emergent-managed Resend**. All enquiry/vendor submissions now email `nilaynarayanpolychem@gmail.com` with the enquirer's email set as `Reply-To`. Verified 202 response from integration proxy on live traffic.
- [x] **Feb 2026** — Production-readiness hardening pass (see `/app/memory/PRODUCTION_READINESS_REPORT.md`): CORS wildcard+credentials fixed, admin fallback removed, env vars fail-fast, date-fns pinned to 3.6.0, backend test suite expanded to 37 tests with TEST_ prefix + auto-cleanup fixture. Verdict: **GO for production**.
- [x] **Feb 2026** — About page infrastructure section: replaced the single stock warehouse photo with a **FacilityGallery** (4-slide auto-rotating carousel + thumbnail nav) showing real facility photos: Main Plant, NABL Lab, Water Treatment Plant, High-Temp Incinerator. Photos cropped from brochure composite. Removed "25 Acres" overlay. Kept the 4 facility-highlight cards (TSDF Unit, NABL Lab, Pre-treatment, Logistics Fleet).
- [x] **Feb 2026** — Facility gallery photos upgraded to real high-resolution originals: Main Plant, Quality Control / NABL Laboratory, Water Treatment Plant, High-Temperature Incinerator. Downscaled to 1600×1000 web-optimised progressive JPEGs (~150-400 KB each) with 16:10 centre-crop. Old low-res crops removed.
- [x] **Feb 2026** — UAT audit pass (iteration_3 → iteration_4): fixed Header 1024px viewport clipping the 'Get Quote' CTA by moving desktop nav breakpoint from `lg:` (1024px) to `xl:` (1280px). At 1024–1279 the mobile hamburger is used; at 1280+ desktop nav renders without overflow. Added `www.nnpolychem.com` website line + Globe icon to Footer Contact column with `testid=footer-website-link` (renders on all 10 pages). Reverted the earlier ISO 22241 change back to ISO 14001 per user's follow-up instruction — verified 0 ISO 22241 hits site-wide.
- [x] **Feb 2026** — Anti-screenshot / anti-copy deterrence hardening (see `/app/memory/ANTI_SCREENSHOT_REPORT.md`, `/app/test_reports/iteration_5.json`). Added 7 security headers via FastAPI middleware + meta tags in index.html (Permissions-Policy `display-capture=()`, CSP `frame-ancestors 'none'`, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, X-Content-Type-Options nosniff, COOP/CORP). Rewrote screenshotShield.js with polite toast (data-testid="shield-toast", exact text spec-compliant) fired on right-click / F12 / Ctrl+S/P/U / Ctrl+Shift+I / PrintScreen. Admin routes excluded from shield; form fields exempt. Added `data-shield="on"` to FacilityGallery, leadership cards, product images. CSS relaxed so contact info (email/phone/address) is still selectable — only shielded blocks locked. Backend tests: +3 security-header tests → 40/40 pass. testing_agent_v3_fork verdict: **PASS**.
- [x] **Feb 2026** — REAL HTTP security headers now delivered on frontend static responses too (`/app/test_reports/iteration_6.json`). FastAPI now serves the React build (`frontend/build/`) via `StaticFiles` mount + `@app.api_route('/{full_path:path}', methods=['GET','HEAD'])` SPA-fallback with `Cache-Control: no-store, must-revalidate` on HTML shell, path-traversal defence in place, and API routes retaining precedence. All 7 security headers verified via curl on 15 paths including SPA HTML routes, deep-linked routes, brochure PDF, product TDS PDFs, and images. Backend pytest expanded to **57 tests** (added 17 static-hosting + SPA-fallback + PDF-integrity tests). Redundant meta CSP tag removed from index.html to silence the 'CSP frame-ancestors ignored via meta' console warning now that the real HTTP header does the work. In the preview environment the CRA dev server on port 3000 still serves the frontend; the new headers activate automatically in the production Emergent.sh deploy where uvicorn handles both api and static.
- [x] **Feb 2026** — Brochure PDF replaced with the latest revision (2,979,408 bytes, 10 pages, Title "NilayNarayan Polychem LLP — Company Profile"). Both `frontend/public/brochure.pdf` and `frontend/build/brochure.pdf` updated so preview + production deploys serve the same file.
- [x] **Feb 2026** — Added 8 new client logos (Alkem, Coal India, Glenmark, HURL, Micro Labs, Oil India, Titan, Zydus) taking the ClientMarquee from 9 to **17 unique logos** and the Industries page from 10 to **18 client tiles**. All slugs (`alkem`, `coal-india`, `glenmark`, `hurl`, `microlabs`, `oil-india`, `titan`, `zydus`) registered in `/app/frontend/src/lib/clients.js` with sector + locations and added to the `LOGO_SLUGS` allow-list in `ClientMarquee.jsx`. Added a 4th leadership card: **Mr. Rudra Narayan Pandey — Director, Compliance & Regulatory Affairs** with real portrait at `/team/rudra-narayan-pandey.png` and bio extracted verbatim from the brochure ("Oversees all statutory compliance, regulatory authorizations and renewals across JSPCB, DGMS, NABL and ISO frameworks…"). Leadership grid changed from 3-col to `md:grid-cols-2 lg:grid-cols-4`.
- [x] **Feb 2026** — WhatsApp button cropping bug fixed (`iteration_7.json` verdict PASS). Rewrote `FloatingWhatsApp.jsx` with `env(safe-area-inset-*)` for iOS notch safety + Tailwind `mb-16 sm:mb-10` to lift above the Emergent preview badge. Verified fully visible at 320/375/414/768/1024/1440/1920 px viewports. Certifications page now renders 4 REAL certificate images (NABL TC-17291, ISO 9001:2015, ISO 14001:2015, ISO 45001:2018) extracted from PDF originals via pdftoppm@220dpi → PIL white-border trim → 88% progressive JPG; container aspect changed to `3/4` with `object-contain` + `p-1.5` so certs render FULL (no cropping) inside placeholders. Removed Factory Licence and CGWA Ground Water NOC cards from the certifications list. Backend pytest now **61 / 61 passing** (added 4 parametrized cert-image tests). Waiting on user for the Startup certificate PDF before adding a 5th slot.
- [x] **Feb 2026** — Added 5th certification card: **Startup India Recognition (DPIIT)** with real certificate scan at `/public/certs/startup-india.jpg` (extracted from user-uploaded PDF via same pipeline). Facility gallery expanded from 4 → **8 slides** — added Plastic Waste Processing Plant, Ball Mill / Crusher Unit, E-Waste Processing Plant, and Effluent Treatment Plant (ETP). Thumbnail grid switched to `grid-cols-4 sm:grid-cols-8` so all 8 thumbs display cleanly. Verified live at /about (thumb-5 → "FACILITY · 05 / 08") and /certifications (Startup India card + DPIIT text present).
- [x] **Feb 2026** — Certifications page: removed JSPCB Hazardous Waste Authorisation and CPCB Co-processing Compliance cards. Featured NABL card now embeds a certificate image placeholder ("NABL Certificate · TC-17291") awaiting upload of `/public/certs/nabl.jpg`.

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
