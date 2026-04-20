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
    service_required: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(min_length=5, max_length=2000)
    enquiry_type: EnquiryType = "contact"
    source_page: Optional[str] = None


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
    tds_url: Optional[str] = None
    sds_url: Optional[str] = None


# ---------- Static product catalog (CMS placeholder) ----------
SEED_PRODUCTS = [
    {"name": "NN-Floc 210", "category": "Water Treatment", "application": "Effluent clarification & sludge dewatering", "industry": "Chemicals, Pharma, Refineries", "description": "High-efficiency anionic polyacrylamide for industrial ETP/STP clarification and sludge dewatering.", "tds_url": "/assets/tds/nn-floc-210.pdf", "sds_url": "/assets/sds/nn-floc-210.pdf"},
    {"name": "NN-Neutra 05", "category": "Neutralization Agent", "application": "pH correction for acidic effluent streams", "industry": "Chemicals, Electroplating, Pharma", "description": "Engineered alkaline blend for rapid neutralisation of low-pH industrial effluent.", "tds_url": "/assets/tds/nn-neutra-05.pdf", "sds_url": "/assets/sds/nn-neutra-05.pdf"},
    {"name": "NN-Solv CP", "category": "Industrial Solvent", "application": "Cleaning & degreasing of process equipment", "industry": "Cement, Steel, Power", "description": "Co-processing grade solvent blend suitable for cement kiln alternative fuel substitution programs.", "tds_url": "/assets/tds/nn-solv-cp.pdf", "sds_url": "/assets/sds/nn-solv-cp.pdf"},
    {"name": "NN-Bind FA", "category": "Fly Ash Binder", "application": "Stabilization of fly ash & hazardous residue", "industry": "Power, Cement, TSDF", "description": "Cementitious binder system for solidification/stabilisation (S/S) of hazardous residues prior to secure landfill.", "tds_url": "/assets/tds/nn-bind-fa.pdf", "sds_url": "/assets/sds/nn-bind-fa.pdf"},
    {"name": "NN-Odor Guard", "category": "Odour Control", "application": "Landfill & treatment plant odour neutralisation", "industry": "TSDF, Municipal, Refineries", "description": "Plant-derived vapour-phase odour counteractant for active landfill cells and transfer stations.", "tds_url": "/assets/tds/nn-odor-guard.pdf", "sds_url": "/assets/sds/nn-odor-guard.pdf"},
    {"name": "NN-Cat Reclaim", "category": "Spent Catalyst Recovery", "application": "Value recovery from spent refinery catalysts", "industry": "Refineries, Petrochemicals", "description": "Reagent system for precious & base-metal recovery from spent hydroprocessing catalysts.", "tds_url": "/assets/tds/nn-cat-reclaim.pdf", "sds_url": "/assets/sds/nn-cat-reclaim.pdf"},
    {"name": "NN-Scale Stop", "category": "Scale Inhibitor", "application": "Cooling tower and boiler scale prevention", "industry": "Power, Steel, Chemicals", "description": "Phosphonate-based scale & corrosion inhibitor for industrial cooling water systems.", "tds_url": "/assets/tds/nn-scale-stop.pdf", "sds_url": "/assets/sds/nn-scale-stop.pdf"},
    {"name": "NN-Bio Clean", "category": "Bio-Augmentation", "application": "Biological treatment enhancement for ETP", "industry": "Pharma, Food, Chemicals", "description": "Concentrated microbial consortium for rapid BOD/COD reduction in biological reactors.", "tds_url": "/assets/tds/nn-bio-clean.pdf", "sds_url": "/assets/sds/nn-bio-clean.pdf"},
]


# ---------- Startup: seed admin & indexes ----------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.enquiries.create_index("created_at")
    await db.vendors.create_index("created_at")

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
    if not products:
        # Seed on first call
        seeded = []
        for p in SEED_PRODUCTS:
            doc = {"id": str(uuid.uuid4()), **p}
            seeded.append(doc)
        if seeded:
            await db.products.insert_many([dict(x) for x in seeded])
        return seeded
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
    body = (
        f"New enquiry received via website\n\n"
        f"Type: {payload.enquiry_type}\n"
        f"Name: {payload.name}\n"
        f"Company: {payload.company or '-'}\n"
        f"Email: {payload.email}\n"
        f"Phone: {payload.phone}\n"
        f"Service: {payload.service_required or '-'}\n"
        f"Source: {payload.source_page or '-'}\n\n"
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
