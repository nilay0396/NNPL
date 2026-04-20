import { useState } from "react";
import { ArrowRight, CheckCircle2, Recycle, Flame, Beaker, Truck, ShieldCheck, Factory } from "lucide-react";
import PageHero from "../components/site/PageHero";
import ProcessFlow from "../components/site/ProcessFlow";
import CtaBanner from "../components/site/CtaBanner";
import QuoteDialog from "../components/site/QuoteDialog";

const HAZ_IMG =
    "https://images.pexels.com/photos/8770248/pexels-photo-8770248.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const tsdfScope = [
    "Secured landfill with engineered HDPE liner system",
    "Stabilisation & solidification (S/S) pre-disposal",
    "Incineration-ready waste segregation",
    "Digital manifest & disposal certificate issuance",
    "Continuous leachate & groundwater monitoring",
    "GPS-tracked authorised transport fleet",
];

const coProcessingScope = [
    "Cement kiln alternative fuel resources (AFR)",
    "High-calorific liquid & solid waste preparation",
    "Blend design with NABL lab characterisation",
    "Co-processing logistics & AFR handoffs",
    "CPCB & GPCB co-processing documentation",
];

const recyclingScope = [
    "Used oil & lubricant re-refining",
    "Solvent distillation & reuse",
    "Spent catalyst metal reclamation",
    "Plastic & packaging resource recovery",
    "By-product upcycling for industrial users",
];

const valueRecovery = [
    { t: "Base & Precious Metals", d: "Recovery from spent catalysts, sludges and plating residues." },
    { t: "Solvents & Oils", d: "Distillation of contaminated solvents and re-refining of used oils." },
    { t: "Energy Value", d: "High-calorific wastes redirected to cement kilns as AFR." },
    { t: "Inorganic Residues", d: "Stabilised and reused as construction-grade material where permitted." },
];

const wasteCategories = [
    "Spent Solvents & Oils",
    "Paint Sludge & Residues",
    "Chemical Sludge",
    "Spent Catalysts",
    "Contaminated Packaging",
    "ETP Sludge",
    "Process Residues",
    "Lab Chemicals",
    "Spent Resins",
    "Acid & Alkali Residues",
    "Plating Sludge",
    "Fly Ash Residues",
];

const industries = ["Cement", "Steel", "Refineries", "Chemicals", "Pharma", "Power", "Automotive", "Government"];

const regulatory = [
    "Hazardous & Other Wastes (M & TBM) Rules, 2016",
    "CPCB guidelines for co-processing",
    "SPCB / GPCB operational authorisations",
    "E-manifest & online filing compliance",
    "Form 3 / Form 10 documentation",
];

export default function HazardousWaste() {
    const [quoteOpen, setQuoteOpen] = useState(false);
    return (
        <>
            <PageHero
                breadcrumb="Services / Hazardous Waste Management"
                title="Authorised, end-to-end hazardous waste management."
                subtitle="TSDF, co-processing, recycling and value recovery — with full regulatory documentation for industrial and government clients."
            />

            {/* Intro with image */}
            <section className="nn-section bg-white" data-testid="haz-intro">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6">
                        <img src={HAZ_IMG} alt="Hazardous waste handling" className="w-full h-[460px] object-cover" />
                    </div>
                    <div className="lg:col-span-6">
                        <div className="nn-eyebrow mb-3">Scope of capability</div>
                        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            One operator, full chain-of-custody.
                        </h2>
                        <p className="mt-5 text-slate-600 leading-relaxed">
                            We own the entire hazardous waste chain — from site assessment and
                            categorisation to pickup, pre-treatment, disposal and regulatory filings.
                            That eliminates multi-vendor handoffs and reduces compliance risk for your
                            site's EHS team.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                data-testid="haz-pickup-btn"
                                onClick={() => setQuoteOpen(true)}
                                className="inline-flex items-center gap-2 h-11 px-6 bg-[#047857] text-white font-semibold hover:bg-[#065F46]"
                            >
                                Request Waste Pickup <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                data-testid="haz-quote-btn"
                                onClick={() => setQuoteOpen(true)}
                                className="inline-flex items-center gap-2 h-11 px-6 border border-slate-300 text-slate-900 font-semibold hover:bg-slate-100"
                            >
                                Get Quote
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Four scope pillars */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="haz-pillars">
                <div className="nn-container">
                    <div className="nn-eyebrow mb-3">Capabilities</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-3xl mb-10">
                        Four integrated waste pathways.
                    </h2>
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 bg-white">
                        <Pillar
                            icon={Truck}
                            code="01"
                            title="TSDF Services Scope"
                            items={tsdfScope}
                            testId="pillar-tsdf"
                        />
                        <Pillar
                            icon={Flame}
                            code="02"
                            title="Co-processing Scope"
                            items={coProcessingScope}
                            testId="pillar-coprocessing"
                        />
                        <Pillar
                            icon={Recycle}
                            code="03"
                            title="Recycling & Value Addition"
                            items={recyclingScope}
                            testId="pillar-recycling"
                        />
                        <Pillar
                            icon={Beaker}
                            code="04"
                            title="Hazardous Waste Handling"
                            items={[
                                "Segregation & labelling as per rules",
                                "Authorised packaging & transit",
                                "Pre-treatment at site or TSDF",
                                "Emergency response & spill support",
                            ]}
                            testId="pillar-handling"
                        />
                    </div>
                </div>
            </section>

            {/* Value Recovery */}
            <section className="nn-section bg-white" data-testid="haz-value-recovery">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Value Recovery Solutions</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Turning waste into recovered value.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            Where possible, we divert waste away from disposal into structured
                            material or energy recovery — improving your circular-economy metrics.
                        </p>
                    </div>
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {valueRecovery.map((v, i) => (
                            <div key={v.t} className="bg-white p-7">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                    {String(i + 1).padStart(2, "0")} · Recovery
                                </span>
                                <h3 className="mt-6 font-display text-lg font-bold text-slate-900">{v.t}</h3>
                                <p className="mt-2 text-sm text-slate-600">{v.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Waste Categories */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="haz-categories">
                <div className="nn-container">
                    <div className="nn-eyebrow mb-3">Waste Categories Handled</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-3xl mb-10">
                        We accept a wide classification of industrial waste.
                    </h2>
                    <div className="nn-grid-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-white">
                        {wasteCategories.map((w, i) => (
                            <div key={w} className="p-5 flex items-center gap-3">
                                <span className="font-mono text-[10px] text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                                <span className="font-display font-semibold text-slate-900">{w}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Flow dark */}
            <section className="relative bg-[#0B192C] overflow-hidden" data-testid="haz-process">
                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                <div className="nn-grain" />
                <div className="relative nn-container py-20 md:py-24">
                    <div className="nn-eyebrow-light mb-3">Process Flow</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-white leading-[1.1] max-w-3xl mb-10">
                        Full chain-of-custody, digitally documented.
                    </h2>
                    <ProcessFlow dark />
                </div>
            </section>

            {/* Industries + Regulatory */}
            <section className="nn-section bg-white" data-testid="haz-industries">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-14">
                    <div className="lg:col-span-6">
                        <div className="nn-eyebrow mb-3">Industries Served</div>
                        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            Sectors we actively serve.
                        </h2>
                        <div className="mt-8 nn-grid-border grid grid-cols-2">
                            {industries.map((i) => (
                                <div key={i} className="p-5 flex items-center gap-3 bg-white">
                                    <Factory className="w-4 h-4 text-[#047857]" />
                                    <span className="font-display font-semibold text-slate-900">{i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-6">
                        <div className="nn-eyebrow mb-3">Regulatory Compliance</div>
                        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            Tender-grade documentation, default.
                        </h2>
                        <ul className="mt-8 space-y-3">
                            {regulatory.map((r) => (
                                <li key={r} className="flex items-start gap-3 p-4 border border-slate-200">
                                    <ShieldCheck className="w-5 h-5 text-[#047857] mt-0.5 shrink-0" />
                                    <span className="text-slate-800 text-sm">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <CtaBanner
                eyebrow="Waste disposal"
                title="Need a site assessment or tender-ready quote?"
                primaryLabel="Request Waste Pickup"
                defaultType="waste_pickup"
            />
            <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} defaultType="waste_pickup" />
        </>
    );
}

function Pillar({ icon: Icon, code, title, items, testId }) {
    return (
        <div className="p-8 bg-white" data-testid={testId}>
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                    Capability {code}
                </span>
                <div className="w-10 h-10 flex items-center justify-center border border-slate-200 text-[#047857]">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <h3 className="mt-8 font-display text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <ul className="mt-5 space-y-2.5">
                {items.map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#047857] shrink-0" />
                        {i}
                    </li>
                ))}
            </ul>
        </div>
    );
}
