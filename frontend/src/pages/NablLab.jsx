import { useState } from "react";
import {
    Droplets,
    Wind,
    Mountain,
    Beaker,
    Volume2,
    Factory,
    ArrowRight,
    ShieldCheck,
    FileCheck2,
    Microscope,
    ClipboardCheck,
    Phone,
    ChevronRight,
    Waves,
    TestTube2,
    BadgeCheck,
} from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";
import QuoteDialog from "../components/site/QuoteDialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import {
    ACCREDITATION,
    AIR_AMBIENT,
    STACK_EMISSION,
    SOIL_SEDIMENT,
    WASTEWATER,
    WATER_MATRICES,
    WATER_REPRESENTATIVE,
    NOISE,
} from "../lib/labScope";

const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const CATEGORIES = [
    {
        key: "air",
        icon: Wind,
        name: "Ambient Air",
        desc: "Accredited ambient air monitoring for particulate and gaseous pollutants.",
        representative: ["PM2.5", "PM10", "SO2", "NO2", "O3", "Lead"],
        full: AIR_AMBIENT,
    },
    {
        key: "stack",
        icon: Factory,
        name: "Stack Emission",
        desc: "Emission stack analysis for major gases, oxygen, particulates and temperature.",
        representative: ["CO2", "CO", "NO2", "O2", "PM", "SO2"],
        full: STACK_EMISSION,
        badge: "Stack temperature covered on site",
    },
    {
        key: "soil",
        icon: Mountain,
        name: "Soil & Sediments",
        desc: "Soil and sediment characterisation for contamination and environmental assessment.",
        representative: ["pH", "Organic Carbon", "Chromium", "Lead", "Nitrate", "EC"],
        full: SOIL_SEDIMENT,
    },
    {
        key: "wastewater",
        icon: Beaker,
        name: "Wastewater · Effluent · Sewage",
        desc: "Industrial effluent and sewage testing for treatment performance and compliance.",
        representative: ["BOD", "COD", "Oil & Grease", "TSS", "pH", "Hexavalent Cr"],
        full: WASTEWATER,
    },
    {
        key: "water",
        icon: Droplets,
        name: "Water Testing",
        desc: "Testing support across drinking, ground, packaged drinking and surface water matrices.",
        representative: ["pH", "TDS", "Hardness", "Turbidity", "Fluoride", "Chloride"],
        matrices: Object.keys(WATER_MATRICES),
        subline: "Surface water scope also includes BOD and DO.",
        full: Array.from(new Set(Object.values(WATER_MATRICES).flat())),
    },
    {
        key: "noise",
        icon: Volume2,
        name: "Noise Monitoring",
        desc: "On-site environmental noise assessment for ambient and source noise.",
        representative: ["Ambient Noise", "Source Noise"],
        full: NOISE,
    },
];

const USE_CASES = [
    { icon: ShieldCheck, t: "Environmental Monitoring Programs" },
    { icon: Beaker, t: "ETP / STP Performance Testing" },
    { icon: Wind, t: "Stack & Ambient Air Compliance" },
    { icon: Mountain, t: "Soil & Waste Site Assessment" },
    { icon: Droplets, t: "Water Quality & Industrial Utility Testing" },
];

const ASSURANCES = [
    { icon: TestTube2, t: "Sample Collection Support", d: "Trained field personnel for industrial sites." },
    { icon: Microscope, t: "Site Monitoring Support", d: "Noise, stack temperature and ambient monitoring on-site." },
    { icon: BadgeCheck, t: "Accredited Laboratory Methods", d: "Testing as per the ISO/IEC 17025:2017 scope." },
    { icon: ClipboardCheck, t: "Compliance-Oriented Reporting", d: "Reports structured for regulatory & tender use." },
];

export default function NablLab() {
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [quoteContext, setQuoteContext] = useState(null);

    const openQuote = (ctx = null) => {
        setQuoteContext(ctx);
        setQuoteOpen(true);
    };

    // Map internal card keys to the human-facing sample_category value
    const categoryToSample = {
        air: "Ambient Air",
        stack: "Stack Emission",
        soil: "Soil & Sediments",
        wastewater: "Wastewater / Effluent / Sewage",
        water: "Water Testing",
        noise: "Noise Monitoring",
    };

    return (
        <>
            {/* Credibility Hero */}
            <PageHero
                breadcrumb="Services / NABL Accredited Lab"
                title="NABL Accredited Environmental & Industrial Testing."
                subtitle="Accredited testing and monitoring support for air, water, soil, wastewater, stack emissions and on-site environmental compliance."
            />

            {/* Trust strip sitting on top of white, just below dark hero */}
            <section className="relative bg-white border-b border-slate-200" data-testid="nabl-trust-strip">
                <div className="nn-container py-6">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                        <TrustChip label={ACCREDITATION.standard} accent />
                        <TrustChip label={`Certificate No. ${ACCREDITATION.certificateNumber}`} />
                        <TrustChip label={`Valid till ${formatDate(ACCREDITATION.validTo)}`} />
                        <TrustChip label={ACCREDITATION.totalClaim} />
                        <div className="ml-auto flex flex-wrap gap-2">
                            <button
                                onClick={() => openQuote()}
                                data-testid="nabl-request-top"
                                className="inline-flex items-center gap-2 h-10 px-5 bg-[#047857] text-white text-sm font-semibold hover:bg-[#065F46]"
                            >
                                Request Testing <ArrowRight className="w-4 h-4" />
                            </button>
                            <a
                                href="#lab-contact"
                                className="hidden md:inline-flex items-center h-10 px-2 text-sm font-semibold text-[#047857] hover:underline"
                            >
                                Talk to Lab Team →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why clients care */}
            <section className="nn-section bg-white" data-testid="nabl-why">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Why clients choose our lab</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Accredited testing across air, water, soil, wastewater, stack and site monitoring.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600 leading-relaxed">
                            Designed for manufacturers, infrastructure projects, consultants,
                            refineries, treatment facilities and compliance-driven industrial operations.
                        </p>
                    </div>

                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-3 bg-white">
                        {[
                            { icon: FileCheck2, t: "Regulatory-ready reports", d: "Structured for CPCB / JSPCB submissions, CTO renewals and tender filing." },
                            { icon: Microscope, t: "Environmental monitoring support", d: "Ambient air, noise and site-condition monitoring with industrial response." },
                            { icon: Beaker, t: "Waste & water characterisation", d: "Effluent, sludge, soil and water matrices — end-to-end analytical depth." },
                        ].map((w) => (
                            <div key={w.t} className="p-7 md:p-8 bg-white">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                        Client value
                                    </span>
                                    <w.icon className="w-6 h-6 text-[#047857]" strokeWidth={1.6} />
                                </div>
                                <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">{w.t}</h3>
                                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{w.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6 Category cards */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="nabl-categories">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
                        <div className="lg:col-span-8">
                            <div className="nn-eyebrow mb-3">Accredited Testing Scope</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.05]">
                                Six sample families. One accredited laboratory.
                            </h2>
                        </div>
                        <p className="lg:col-span-4 text-slate-600">
                            Each card below shows representative accredited parameters.
                            Expand any card for the full parameter list.
                        </p>
                    </div>

                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white">
                        {CATEGORIES.map((c) => (
                            <article
                                key={c.key}
                                data-testid={`nabl-cat-card-${c.key}`}
                                className="relative p-7 bg-white flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                        {c.key === "water" ? "Matrix group" : "Category"}
                                    </span>
                                    <div className="w-11 h-11 flex items-center justify-center border border-slate-200 text-[#047857]">
                                        <c.icon className="w-5 h-5" strokeWidth={1.7} />
                                    </div>
                                </div>
                                <h3 className="font-display text-xl font-black text-slate-900 tracking-tight leading-tight">
                                    {c.name}
                                </h3>
                                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{c.desc}</p>

                                {c.matrices && (
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {c.matrices.map((m) => (
                                            <span
                                                key={m}
                                                className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-700 border border-slate-300 px-2 py-1 bg-white"
                                            >
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {c.badge && (
                                    <div className="mt-4 inline-flex items-center self-start gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-[#047857] bg-emerald-50 border border-emerald-200 px-2.5 py-1">
                                        <BadgeCheck className="w-3 h-3" /> {c.badge}
                                    </div>
                                )}

                                <div className="mt-5 pt-5 border-t border-slate-100">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-3">
                                        Representative parameters
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {c.representative.map((p) => (
                                            <span
                                                key={p}
                                                className="text-xs font-medium text-slate-800 bg-slate-100 px-2 py-1"
                                            >
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {c.subline && (
                                    <p className="mt-4 text-xs text-slate-500 italic">{c.subline}</p>
                                )}

                                <button
                                    onClick={() => setExpanded(c)}
                                    data-testid={`nabl-cat-view-full-${c.key}`}
                                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#047857] hover:text-[#065F46] self-start"
                                >
                                    View full scope
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Water matrices detail */}
            <section className="nn-section bg-white" data-testid="nabl-water-detail">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3 flex items-center gap-2">
                                <Waves className="w-3.5 h-3.5" /> Water Scope
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.05]">
                                Water testing across multiple matrices.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            Drinking, ground, packaged drinking and surface water — each matrix
                            has its own accredited parameter panel tuned for the expected use-case.
                        </p>
                    </div>

                    <Tabs defaultValue="Drinking Water" className="w-full" data-testid="water-tabs">
                        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-0 bg-transparent p-0 border-b border-slate-200 rounded-none">
                            {Object.keys(WATER_MATRICES).map((m) => (
                                <TabsTrigger
                                    key={m}
                                    value={m}
                                    data-testid={`water-tab-${m.replace(/\s+/g, "-").toLowerCase()}`}
                                    className="rounded-none border-b-2 border-transparent bg-transparent data-[state=active]:border-[#047857] data-[state=active]:text-[#047857] data-[state=active]:shadow-none text-slate-600 font-display font-semibold px-5 py-3 text-sm"
                                >
                                    {m}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {Object.entries(WATER_MATRICES).map(([m, all]) => (
                            <TabsContent key={m} value={m} className="mt-8">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-5">
                                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857] mb-3">
                                            {m}
                                        </div>
                                        <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                            {WATER_REPRESENTATIVE[m].length} key parameters typically requested.
                                        </h3>
                                        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                                            Full accredited panel of {all.length} parameters is available.
                                            Scope to your use-case by selecting a subset at enquiry.
                                        </p>
                                        <button
                                            onClick={() => openQuote({ sampleCategory: "Water Testing", waterMatrix: m })}
                                            data-testid={`water-enquire-${m.replace(/\s+/g, "-").toLowerCase()}`}
                                            className="mt-6 inline-flex items-center gap-2 h-10 px-5 bg-[#0B192C] text-white text-sm font-semibold hover:bg-[#132744]"
                                        >
                                            Enquire {m} Test <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="lg:col-span-7">
                                        <div className="border border-slate-200">
                                            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                                                    Commercially Requested · Top {WATER_REPRESENTATIVE[m].length}
                                                </span>
                                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#047857]">
                                                    Full scope: {all.length}
                                                </span>
                                            </div>
                                            <div className="p-5 flex flex-wrap gap-2">
                                                {WATER_REPRESENTATIVE[m].map((p) => (
                                                    <span
                                                        key={p}
                                                        className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1"
                                                    >
                                                        <span className="w-1.5 h-1.5 bg-[#047857] rounded-full" />
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>

                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="all" className="border-t border-slate-200">
                                                    <AccordionTrigger
                                                        data-testid={`water-show-all-${m.replace(/\s+/g, "-").toLowerCase()}`}
                                                        className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-700 no-underline hover:no-underline"
                                                    >
                                                        Show complete accredited parameter list
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-5 pb-5">
                                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                                            {all.map((p) => (
                                                                <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                                                                    <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0" />
                                                                    {p}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Use cases */}
            <section className="relative bg-[#0B192C] text-white overflow-hidden" data-testid="nabl-use-cases">
                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                <div className="nn-grain" />
                <div className="relative nn-container py-20 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow-light mb-3">Industrial Use Cases</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-white leading-[1.05]">
                                Typical client requirements we support.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-300">
                            A business-friendly framing of the accredited scope — mapped to the
                            testing programs industrial EHS and compliance teams actually run.
                        </p>
                    </div>

                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        {USE_CASES.map((u, i) => (
                            <div
                                key={u.t}
                                className="p-6 md:p-7"
                                style={{ borderRight: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <u.icon className="w-5 h-5 text-emerald-400" strokeWidth={1.7} />
                                </div>
                                <h3 className="font-display font-bold text-white leading-tight">{u.t}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Assurances strip */}
            <section className="nn-section bg-white" data-testid="nabl-assurances">
                <div className="nn-container">
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white">
                        {ASSURANCES.map((a) => (
                            <div key={a.t} className="p-7 bg-white">
                                <div className="w-11 h-11 bg-[#0B192C] text-emerald-300 flex items-center justify-center">
                                    <a.icon className="w-5 h-5" strokeWidth={1.7} />
                                </div>
                                <h3 className="mt-6 font-display font-bold text-slate-900 leading-tight">{a.t}</h3>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section id="lab-contact" className="relative bg-[#0B192C] text-white overflow-hidden" data-testid="nabl-cta">
                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                <div className="nn-grain" />
                <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#047857]/20 blur-3xl" aria-hidden />
                <div className="relative nn-container py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow-light mb-3">Engage the lab</div>
                            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.05]">
                                Need accredited testing support?
                            </h2>
                            <p className="mt-5 text-slate-300 max-w-xl">
                                Tell us your sample type, plant or project context and turnaround
                                expectation — we will respond with a scoped quote and sampling plan.
                            </p>
                        </div>
                        <div className="lg:col-span-5 flex flex-col sm:flex-row flex-wrap gap-3 justify-start lg:justify-end">
                            <button
                                onClick={() => openQuote()}
                                data-testid="nabl-cta-quote"
                                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#047857] text-white font-semibold hover:bg-[#059669]"
                            >
                                Request a Quote <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => openQuote()}
                                data-testid="nabl-cta-sample"
                                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10"
                            >
                                Submit Sample Enquiry
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expand-full-scope modal */}
            <Dialog open={!!expanded} onOpenChange={(v) => !v && setExpanded(null)}>
                <DialogContent className="sm:max-w-[640px] p-0 rounded-none border border-slate-200" data-testid="nabl-scope-modal">
                    {expanded && (
                        <>
                            <div className="bg-[#0B192C] text-white p-6 relative overflow-hidden">
                                <div className="absolute inset-0 nn-dashed-grid opacity-60" />
                                <div className="relative">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300 mb-2">
                                        Full accredited scope
                                    </div>
                                    <DialogHeader>
                                        <DialogTitle className="font-display text-2xl font-black text-white tracking-tight">
                                            {expanded.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <p className="text-slate-300 text-sm mt-2 max-w-md">{expanded.desc}</p>
                                </div>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">
                                    {expanded.full.length} accredited parameters
                                </div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    {expanded.full.map((p) => (
                                        <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className="w-1.5 h-1.5 bg-[#047857] rounded-full mt-2 shrink-0" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => {
                                            const cat = categoryToSample[expanded.key] || null;
                                            setExpanded(null);
                                            openQuote(cat ? { sampleCategory: cat } : null);
                                        }}
                                        data-testid="nabl-scope-modal-quote"
                                        className="inline-flex items-center gap-2 h-10 px-5 bg-[#047857] text-white text-sm font-semibold hover:bg-[#065F46]"
                                    >
                                        Request this testing <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} defaultType="lab_testing" context={quoteContext} />
        </>
    );
}

function TrustChip({ label, accent = false }) {
    return (
        <div
            className={`inline-flex items-center gap-2 h-9 px-3 border ${
                accent
                    ? "border-[#047857] bg-emerald-50 text-[#065F46]"
                    : "border-slate-300 bg-white text-slate-800"
            }`}
        >
            <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-semibold">
                {label}
            </span>
        </div>
    );
}
