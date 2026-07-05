import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ShieldCheck,
    FlaskConical,
    Recycle,
    Award,
    BadgeCheck,
    Factory,
    Building2,
    Zap,
    Truck,
    TestTube2,
    Download,
    Phone,
    MessageCircle,
    Quote,
} from "lucide-react";
import QuoteDialog from "../components/site/QuoteDialog";
import ProcessFlow from "../components/site/ProcessFlow";
import CtaBanner from "../components/site/CtaBanner";
import ClientMarquee from "../components/site/ClientMarquee";
import { COMPANY, whatsappHref } from "../lib/company";
import { downloadBrochure } from "../lib/download";
import { TESTIMONIALS } from "../lib/clients";

const HERO_IMG =
    "https://static.prod-images.emergentagent.com/jobs/07dc2c71-76dd-4bb3-b84f-ee529563dce1/images/fa0b84fe426a04210fd17427c272575bcf16386208812eef71f0001ad6434fd0.png";

const industries = [
    { icon: Factory, label: "Cement" },
    { icon: Building2, label: "Steel" },
    { icon: Zap, label: "Power" },
    { icon: TestTube2, label: "Pharma" },
    { icon: FlaskConical, label: "Chemicals" },
    { icon: Truck, label: "Refineries" },
    { icon: ShieldCheck, label: "Government" },
    { icon: Award, label: "Automotive" },
];

const reasons = [
    {
        title: "Authorised & Compliant",
        desc: "JSPCB & CPCB authorised for hazardous waste handling, storage, transport & disposal.",
    },
    {
        title: "Integrated Under One Roof",
        desc: "TSDF, co-processing, recycling and NABL lab — single accountable operator.",
    },
    {
        title: "Government & Industrial Track Record",
        desc: "Executed tenders for PSUs, cement majors and large industrial clusters across India.",
    },
    {
        title: "End-to-End Execution",
        desc: "From manifest generation and pickup to final disposal certificate and CPCB reporting.",
    },
];

export default function Home() {
    const [quoteOpen, setQuoteOpen] = useState(false);

    return (
        <>
            {/* HERO */}
            <section className="relative bg-[#0B192C] overflow-hidden" data-testid="hero-section">
                <img
                    src={HERO_IMG}
                    alt="Industrial facility"
                    className="absolute inset-0 w-full h-full object-cover opacity-55"
                />
                <div className="absolute inset-0 nn-hero-overlay" />
                <div className="absolute inset-0 nn-dashed-grid opacity-25" />
                <div className="nn-grain" />

                <div className="relative nn-container pt-16 md:pt-28 pb-20 md:pb-36">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                        <div className="lg:col-span-8">
                            <div className="flex items-center gap-3 mb-6 nn-reveal">
                                <span className="w-10 h-px bg-emerald-400" />
                                <span className="nn-eyebrow-light">Authorised Industrial Operator</span>
                                <span className="hidden sm:inline-block ml-2 px-2.5 py-1 border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-mono text-[10px] tracking-[0.18em] uppercase" data-testid="hero-clients-badge">
                                    150+ Industrial Clients
                                </span>
                            </div>
                            <h1
                                data-testid="hero-headline"
                                className="font-display text-[38px] sm:text-5xl lg:text-[76px] font-black tracking-tight leading-[0.98] text-white nn-reveal nn-reveal-delay-1"
                            >
                                Integrated
                                <br />
                                Hazardous Waste
                                <br />
                                Management &{" "}
                                <span className="text-emerald-400">Environmental</span>
                                <br />
                                Solutions.
                            </h1>
                            <p className="mt-7 text-slate-300 text-base md:text-lg max-w-xl leading-relaxed nn-reveal nn-reveal-delay-2">
                                End-to-end services including TSDF, co-processing, recycling, value
                                recovery, speciality chemicals and NABL accredited environmental
                                lab testing — engineered for industrial scale and tender-grade
                                compliance.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3 nn-reveal nn-reveal-delay-3">
                                <button
                                    data-testid="hero-request-quote-btn"
                                    onClick={() => setQuoteOpen(true)}
                                    className="inline-flex items-center gap-2 h-12 px-6 bg-[#047857] text-white font-semibold hover:bg-[#059669] transition-colors"
                                >
                                    Request Quote
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <Link
                                    to="/contact"
                                    data-testid="hero-contact-btn"
                                    className="inline-flex items-center gap-2 h-12 px-6 border border-white/25 text-white font-semibold hover:bg-white/5 transition-colors"
                                >
                                    Contact Us
                                </Link>
                                <a
                                    href={whatsappHref()}
                                    target="_blank"
                                    rel="noreferrer"
                                    data-testid="hero-whatsapp-btn"
                                    className="inline-flex items-center gap-2 h-12 px-6 bg-[#25D366] text-[#0B192C] font-semibold hover:brightness-95 transition"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp Now
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-4 nn-reveal nn-reveal-delay-4">
                            <div className="border border-white/15 bg-white/[0.03] backdrop-blur-sm">
                                <div className="grid grid-cols-2">
                                    {[
                                        { k: "2L+", v: "TPA authorised capacity" },
                                        { k: "5", v: "Waste categories · Sched I–III" },
                                        { k: "NABL", v: "Accredited environmental lab" },
                                        { k: "24×7", v: "Operations & response" },
                                    ].map((s) => (
                                        <div
                                            key={s.v}
                                            className="p-6 border-r border-b border-white/10 last:border-r-0"
                                        >
                                            <div className="font-display text-3xl md:text-4xl font-black text-white tracking-tight">
                                                {s.k}
                                            </div>
                                            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400 font-mono">
                                                {s.v}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={downloadBrochure}
                                    data-testid="hero-brochure-btn"
                                    className="flex items-center justify-between w-full text-left px-6 py-4 bg-[#047857] text-white font-semibold text-sm hover:bg-[#059669] transition"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Download className="w-4 h-4" /> Corporate Brochure
                                    </span>
                                    <span className="font-mono text-xs opacity-80">PDF · 2.9 MB</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom strip: certifications */}
                <div className="relative border-t border-white/10 bg-black/30">
                    <div className="nn-container py-5 flex flex-wrap items-center gap-x-10 gap-y-3 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
                        <span className="text-emerald-300">Accreditations</span>
                        <span>JSPCB Authorised</span>
                        <span>NABL · ISO/IEC 17025:2017 · TC-17291</span>
                        <span>ISO 9001:2015</span>
                        <span>ISO 14001:2015</span>
                        <span>ISO 45001:2018</span>
                        <span>CPCB Compliant</span>
                    </div>
                </div>
            </section>

            {/* CLIENT LOGO MARQUEE — subtle social proof strip */}
            <ClientMarquee />

            {/* ABOUT SNAPSHOT */}
            <section className="nn-section bg-white" data-testid="about-snapshot">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <div className="nn-eyebrow mb-4">About NN Polychem</div>
                        <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-slate-900">
                            Engineering a cleaner<br />
                            <span className="text-[#047857]">industrial future.</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-7">
                        <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                            NilayNarayan Polychem LLP is an integrated industrial company operating
                            at the intersection of speciality chemicals manufacturing, authorised
                            hazardous waste management and NABL accredited environmental testing.
                            We partner with cement majors, steel plants, refineries, PSUs and
                            large industrial clusters to deliver regulatory-grade environmental
                            infrastructure with measurable operational outcomes.
                        </p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 border-t border-slate-200">
                            {[
                                { k: "Mission", v: "Zero-landfill through co-processing & value recovery" },
                                { k: "Vision", v: "India's most trusted environmental infrastructure partner" },
                                { k: "Code", v: "Safety · Compliance · Transparency" },
                            ].map((p) => (
                                <div key={p.k} className="py-5 sm:pr-6 border-b sm:border-b-0 sm:border-r border-slate-200 last:border-r-0">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#047857]">
                                        {p.k}
                                    </div>
                                    <div className="mt-2 font-display font-semibold text-slate-900">
                                        {p.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex gap-4">
                            <Link to="/about" className="nn-link-arrow" data-testid="about-learn-more-link">
                                Learn more about us <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CORE SERVICES */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="core-services">
                <div className="nn-container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <div className="nn-eyebrow mb-3">Core Services</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-slate-900 max-w-2xl leading-[1.05]">
                                Two integrated capabilities.<br />One accountable partner.
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/services/hazardous-waste"
                            data-testid="service-card-hazardous"
                            className="nn-card group relative p-8 md:p-10 overflow-hidden"
                        >
                            <div className="flex items-start justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                    Service 01
                                </span>
                                <Recycle className="w-6 h-6 text-slate-400 group-hover:text-[#047857] transition" />
                            </div>
                            <h3 className="mt-10 font-display text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                Hazardous Waste<br />Management Solutions
                            </h3>
                            <p className="mt-4 text-slate-600 text-[15px] leading-relaxed max-w-md">
                                TSDF services, co-processing, recycling, and value recovery
                                for hazardous and industrial waste — executed with complete
                                manifest-to-disposal traceability.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {["TSDF", "Co-processing", "Recycling", "Value Recovery"].map((t) => (
                                    <span key={t} className="font-mono text-[10px] uppercase tracking-[0.18em] border border-slate-300 text-slate-700 px-2.5 py-1">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-8 nn-link-arrow">
                                Explore More <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <Link
                            to="/services/nabl-lab"
                            data-testid="service-card-nabl"
                            className="nn-card group relative p-8 md:p-10 overflow-hidden"
                        >
                            <div className="flex items-start justify-between">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                    Service 02
                                </span>
                                <FlaskConical className="w-6 h-6 text-slate-400 group-hover:text-[#047857] transition" />
                            </div>
                            <h3 className="mt-10 font-display text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                NABL Accredited<br />Environmental Lab
                            </h3>
                            <p className="mt-4 text-slate-600 text-[15px] leading-relaxed max-w-md">
                                Water, air, soil and hazardous waste testing by a NABL
                                accredited lab — with fast turnaround, legally defensible
                                reports and on-site sample collection.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {["Water", "Air", "Soil", "Haz Waste", "Effluent"].map((t) => (
                                    <span key={t} className="font-mono text-[10px] uppercase tracking-[0.18em] border border-slate-300 text-slate-700 px-2.5 py-1">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-8 nn-link-arrow">
                                Explore More <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* INDUSTRIES */}
            <section className="nn-section bg-white" data-testid="industries-section">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-end">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Industries Served</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
                                Trusted across heavy industry and government.
                            </h2>
                        </div>
                        <div className="lg:col-span-5 text-slate-600">
                            Our services are built around tender-grade documentation,
                            on-site safety standards and auditable digital manifests — the
                            baseline expected by large corporates and PSUs.
                        </div>
                    </div>
                    <div className="nn-grid-border grid grid-cols-2 sm:grid-cols-4">
                        {industries.map((ind) => (
                            <div key={ind.label} className="p-6 md:p-8 bg-white hover:bg-slate-50 transition-colors">
                                <ind.icon className="w-7 h-7 text-[#047857]" strokeWidth={1.6} />
                                <div className="mt-6 font-display font-bold text-slate-900 text-lg">
                                    {ind.label}
                                </div>
                                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                    Sector
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="nn-section bg-[#0B192C] text-white relative overflow-hidden" data-testid="why-choose-us">
                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                <div className="nn-grain" />
                <div className="relative nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 items-end">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow-light mb-3">Why Choose Us</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-white">
                                Built for tenders. Engineered for compliance.
                            </h2>
                        </div>
                        <div className="lg:col-span-5 text-slate-300">
                            We operate at the intersection of chemistry, logistics and regulation —
                            and we stand behind every manifest we sign.
                        </div>
                    </div>
                    <div className="nn-grid-border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                        {reasons.map((r, i) => (
                            <div key={r.title} className="p-7 md:p-8 border-r border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="mt-10 font-display text-xl font-bold text-white leading-tight">
                                    {r.title}
                                </h3>
                                <p className="mt-3 text-slate-400 text-sm leading-relaxed">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS FLOW */}
            <section className="nn-section bg-white" data-testid="process-flow-section">
                <div className="nn-container">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <div className="nn-eyebrow mb-3">Process Flow</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.05] max-w-2xl">
                                From pickup to compliance — a single audit trail.
                            </h2>
                        </div>
                        <Link to="/services/hazardous-waste" className="nn-link-arrow" data-testid="process-explore-link">
                            Explore full process <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <ProcessFlow />
                </div>
            </section>

            {/* CERTIFICATIONS HIGHLIGHT */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="certifications-highlight">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Certifications & Compliance</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
                                Regulatory-grade by default.
                            </h2>
                        </div>
                        <Link to="/certifications" className="nn-link-arrow" data-testid="cert-view-all-link">
                            View all certifications <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="nn-grid-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white">
                        {[
                            { name: "JSPCB", sub: "Authorised" },
                            { name: "CPCB", sub: "Compliant" },
                            { name: "NABL", sub: "TC-17291" },
                            { name: "ISO 9001", sub: "2015" },
                            { name: "ISO 14001", sub: "2015" },
                            { name: "ISO 45001", sub: "2018" },
                        ].map((c) => (
                            <div key={c.name} className="p-6 flex flex-col items-start gap-4">
                                <div className="w-10 h-10 bg-[#0B192C] text-emerald-300 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-display font-bold text-slate-900">{c.name}</div>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">
                                        {c.sub}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="nn-section bg-white" data-testid="testimonials-section">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Client Reviews</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
                                Words from the plants and refineries we serve.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            Feedback from PSU refineries, mining operators and power plants
                            we&rsquo;ve partnered with over multi-year hazardous-waste and testing programs.
                        </p>
                    </div>

                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 bg-white">
                        {TESTIMONIALS.map((t, i) => (
                            <article
                                key={i}
                                data-testid={`testimonial-${i}`}
                                className="p-8 md:p-10 flex flex-col bg-white"
                            >
                                <div className="flex items-center justify-between">
                                    <Quote className="w-8 h-8 text-[#047857]" strokeWidth={1.6} />
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                        {t.sector}
                                    </span>
                                </div>
                                <blockquote className="mt-6 font-display text-lg md:text-xl leading-[1.35] tracking-tight text-slate-900">
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>
                                <div className="mt-8 pt-5 border-t border-slate-200 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#0B192C] text-emerald-300 flex items-center justify-center font-display font-black text-sm">
                                        {t.client.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("")}
                                    </div>
                                    <div>
                                        <div className="font-display font-bold text-slate-900 text-sm">{t.client}</div>
                                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#047857] mt-0.5">
                                            Verified engagement
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBanner />

            <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
        </>
    );
}
