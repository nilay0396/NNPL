from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta
import uuid
import logging
import bcrypt
import jwt as pyjwt
import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# ---------- Setup ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

app = FastAPI(title="NilayNarayan Polychem API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
        "type": "access",
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def send_email_async(to_email: str, subject: str, body: str):
    """Best-effort email send. Logs payload if SMTP not configured."""
    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASSWORD", "")
    smtp_from = os.environ.get("SMTP_FROM", "no-reply@nilaynarayan.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587") or 587)

    if not (smtp_host and smtp_user and smtp_pass):
        logger.info(f"[EMAIL PLACEHOLDER] to={to_email} subject={subject!r}\n{body}")
        return

    def _send():
        msg = MIMEMultipart()
        msg["From"] = smtp_from
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))
        with smtplib.SMTP(smtp_host, smtp_port) as s:
            s.starttls()
            s.login(smtp_user, smtp_pass)
            s.sendmail(smtp_from, [to_email], msg.as_string())

    try:
        await asyncio.to_thread(_send)
    except Exception as e:
        logger.error(f"Email send failed: {e}")


# ---------- Models ----------
EnquiryType = Literal["contact", "quote", "waste_pickup", "lab_testing", "product", "sample"]


class EnquiryCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=120)
    company: Optional[str] = Field(default=None, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=6, max_length=25)
    service_required: Optional[str] = Field(default=None, max_length=200)
    message: str = Field(min_length=5, max_length=2000)
    enquiry_type: EnquiryType = "contact"
    source_page: Optional[str] = None
    details: Optional[dict] = None


class Enquiry(BaseModel):
    id: str
    name: str
    company: Optional[str] = None
    email: str
    phone: str
    service_required: Optional[str] = None
    message: str
    enquiry_type: str
    source_page: Optional[str] = None
    details: Optional[dict] = None
    status: str = "new"
    created_at: datetime


class VendorCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    company_name: str = Field(min_length=2, max_length=200)
    contact_person: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=6, max_length=25)
    gst_number: Optional[str] = Field(default=None, max_length=25)
    category: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=5, max_length=500)
    website: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)


class Vendor(BaseModel):
    id: str
    company_name: str
    contact_person: str
    email: str
    phone: str
    gst_number: Optional[str] = None
    category: str
    address: str
    website: Optional[str] = None
    description: Optional[str] = None
    status: str = "pending"
    created_at: datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class Product(BaseModel):
    id: str
    name: str
    category: str
    application: str
    industry: str
    description: str
    approvals: Optional[str] = None
    image: Optional[str] = None
    tds_url: Optional[str] = None
    sds_url: Optional[str] = None


# ---------- Static product catalog (from company brochure) ----------
SEED_PRODUCTS = [
    {
        "name": "NN-DustGuard PSPP",
        "category": "Dust Suppression",
        "application": "Dust suppressant for coal, haul roads & stockpiles",
        "industry": "Mining, Coal, Power, Logistics",
        "description": "Poly-surfactant polymer dust suppressant engineered for open-cast coal mines, haul roads, transfer points and stockpile faces.",
        "approvals": "NABL-QC batch tested",
    },
    {
        "name": "NN-Emul SMO",
        "category": "Explosive Emulsifier",
        "application": "Sorbitan mono-oleate emulsifier for explosive emulsions & industrial use",
        "industry": "Explosives, Mining, Industrial",
        "description": "Sorbitan mono-oleate (SMO) emulsifier for water-in-oil explosive emulsions and industrial emulsion systems.",
        "approvals": "NABL-QC batch tested",
    },
    {
        "name": "NN-RockBond Cement Capsule",
        "category": "Grouting Capsule",
        "application": "Cement grouting capsule for roof bolting in mines",
        "industry": "Underground Mining, Tunnelling",
        "description": "Rapid-setting cement grouting capsule for rock / roof bolting in underground mines and tunnels.",
        "approvals": "DGMS approved",
    },
    {
        "name": "NN-RockGrout Resin Capsule",
        "category": "Grouting Capsule",
        "application": "Polyester resin grouting capsule for roof / rock bolting",
        "industry": "Underground Mining, Tunnelling",
        "description": "Polyester resin grouting capsule delivering high early-strength bond for roof/rock bolt anchorage in mines and tunnels.",
        "approvals": "DGMS approved",
    },
    {
        "name": "NN-395 Superplasticizer",
        "category": "Concrete Admixture",
        "application": "SNF high-range water reducer for concrete",
        "industry": "Construction, Infrastructure, RMC",
        "description": "Sulphonated Naphthalene Formaldehyde (SNF) based high-range water reducer for high-strength, high-workability concrete.",
        "approvals": "IS 9103 · NCCBM approved",
        "image": "/products/nn-395-superplasticizer.png",
        "tds_url": "/products/nn-395-superplasticizer-tds.pdf",
        "sds_url": "/products/nn-395-superplasticizer-sds.pdf",
    },
    {
        "name": "NN-PlastiFlo Water Reducer",
        "category": "Concrete Admixture",
        "application": "Lignosulphonate water-reducing admixture / plasticizer",
        "industry": "Construction, Infrastructure, Precast",
        "description": "Lignosulphonate based water-reducing plasticizer for improved workability and controlled setting in concrete mixes.",
        "approvals": "IS 9103 · NCCBM approved",
    },
    {
        "name": "NN-CalNit Calcium Nitrate",
        "category": "Industrial Salt",
        "application": "Concrete accelerator, effluent treatment, latex production",
        "industry": "Construction, Wastewater, Rubber & Latex",
        "description": "Industrial grade calcium nitrate available as solid crystals and 60% solution — used as concrete set-accelerator, in effluent treatment and latex processing.",
        "approvals": "NABL-QC batch tested",
        "image": "/products/nn-calnit-calcium-nitrate.png",
        "tds_url": "/products/nn-calnit-calcium-nitrate-tds.pdf",
        "sds_url": "/products/nn-calnit-calcium-nitrate-sds.pdf",
    },
    {
        "name": "NN-PyroShield STC-I",
        "category": "Fire-Retardant Coating",
        "application": "Metal-oxide intumescent fire-retardant coating",
        "industry": "Structural Steel, Infrastructure, Refineries",
        "description": "Metal-oxide intumescent coating providing passive fire protection to structural steel and industrial installations.",
        "approvals": "NABL-QC batch tested",
    },
    {
        "name": "NN-PyroShield STC-II",
        "category": "Fire-Retardant Coating",
        "application": "Non-metal-oxide (organic) intumescent fire-retardant coating",
        "industry": "Structural Steel, Buildings, Warehousing",
        "description": "Organic (non-metal-oxide) intumescent fire-retardant coating for structural steel members and industrial buildings.",
        "approvals": "NABL-QC batch tested",
    },
    {
        "name": "NN-AluBond High Alumina Binder",
        "category": "Refractory Binder",
        "application": "Calcium aluminate refractory binder (CA-50 / CA-70 / CA-80)",
        "industry": "Steel, Cement, Foundries, Refractories",
        "description": "High-alumina calcium aluminate cement (CA-50, CA-70, CA-80 grades) for refractory castables and monolithic linings.",
        "approvals": "IS 15895",
    },
]


# ---------- Startup: seed admin & indexes ----------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.enquiries.create_index("created_at")
    await db.vendors.create_index("created_at")

    # Always resync product catalog from code (single source of truth)
    await db.products.delete_many({})
    seeded_products = [{"id": str(uuid.uuid4()), **p} for p in SEED_PRODUCTS]
    if seeded_products:
        await db.products.insert_many([dict(x) for x in seeded_products])
    logger.info(f"Reseeded {len(seeded_products)} products.")

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@nilaynarayan.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Administrator",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Updated admin password for: {admin_email}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# ---------- Public routes ----------
@api_router.get("/")
async def root():
    return {"service": "NilayNarayan Polychem API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "time": datetime.now(timezone.utc).isoformat()}


@api_router.get("/products", response_model=List[Product])
async def list_products():
    products = await db.products.find({}, {"_id": 0}).to_list(200)
    return products


@api_router.post("/enquiries", response_model=Enquiry, status_code=201)
async def create_enquiry(payload: EnquiryCreate):
    now = datetime.now(timezone.utc)
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "status": "new",
        "created_at": now.isoformat(),
    }
    await db.enquiries.insert_one(dict(doc))

    # Best-effort email notification
    to_email = os.environ.get("COMPANY_CONTACT_EMAIL", "info@nilaynarayan.com")
    subject = f"[NN Polychem] New {payload.enquiry_type} enquiry from {payload.name}"
    details_str = ""
    if payload.details:
        details_str = "\nDetails:\n" + "\n".join(
            f"  {k.replace('_', ' ').title()}: {v}" for k, v in payload.details.items() if v not in (None, "", [])
        )
    body = (
        f"New enquiry received via website\n\n"
        f"Type: {payload.enquiry_type}\n"
        f"Name: {payload.name}\n"
        f"Company: {payload.company or '-'}\n"
        f"Email: {payload.email}\n"
        f"Phone: {payload.phone}\n"
        f"Service: {payload.service_required or '-'}\n"
        f"Source: {payload.source_page or '-'}\n"
        f"{details_str}\n\n"
        f"Message:\n{payload.message}\n"
    )
    asyncio.create_task(send_email_async(to_email, subject, body))

    return Enquiry(**{**doc, "created_at": now})


@api_router.post("/vendors", response_model=Vendor, status_code=201)
async def create_vendor(payload: VendorCreate):
    now = datetime.now(timezone.utc)
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "status": "pending",
        "created_at": now.isoformat(),
    }
    await db.vendors.insert_one(dict(doc))

    to_email = os.environ.get("COMPANY_CONTACT_EMAIL", "info@nilaynarayan.com")
    subject = f"[NN Polychem] New vendor onboarding: {payload.company_name}"
    body = (
        f"New vendor onboarding submission\n\n"
        f"Company: {payload.company_name}\n"
        f"Category: {payload.category}\n"
        f"Contact: {payload.contact_person}\n"
        f"Email: {payload.email} | Phone: {payload.phone}\n"
        f"GST: {payload.gst_number or '-'}\n"
        f"Website: {payload.website or '-'}\n"
        f"Address:\n{payload.address}\n\n"
        f"Description:\n{payload.description or '-'}\n"
    )
    asyncio.create_task(send_email_async(to_email, subject, body))

    return Vendor(**{**doc, "created_at": now})


# ---------- Auth ----------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user.get("role", "admin"))
    return LoginResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "admin")},
    )


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return current


# ---------- Admin-protected ----------
@api_router.get("/enquiries")
async def list_enquiries(current: dict = Depends(get_current_admin), status: Optional[str] = None):
    query = {"status": status} if status else {}
    items = await db.enquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.patch("/enquiries/{enquiry_id}")
async def update_enquiry_status(enquiry_id: str, body: dict, current: dict = Depends(get_current_admin)):
    new_status = body.get("status")
    if new_status not in ("new", "in_progress", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.enquiries.update_one({"id": enquiry_id}, {"$set": {"status": new_status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api_router.get("/vendors")
async def list_vendors(current: dict = Depends(get_current_admin)):
    items = await db.vendors.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    total_enq = await db.enquiries.count_documents({})
    new_enq = await db.enquiries.count_documents({"status": "new"})
    total_vend = await db.vendors.count_documents({})
    by_type_cursor = db.enquiries.aggregate([
        {"$group": {"_id": "$enquiry_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ])
    by_type = [{"type": d["_id"], "count": d["count"]} async for d in by_type_cursor]
    return {
        "total_enquiries": total_enq,
        "new_enquiries": new_enq,
        "total_vendors": total_vend,
        "by_type": by_type,
    }


# ---------- Register & CORS ----------
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
