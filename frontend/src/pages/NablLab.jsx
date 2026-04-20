import { useState } from "react";
import { Droplets, Wind, Mountain, FlaskConical, CheckCircle2, Clock, FileText, ArrowRight, Beaker } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";
import QuoteDialog from "../components/site/QuoteDialog";

const LAB_IMG =
    "https://static.prod-images.emergentagent.com/jobs/07dc2c71-76dd-4bb3-b84f-ee529563dce1/images/74a82acf2b38e23257c524e80361e30d55e42d0d0c0279ee7add42a143e5f5d5.png";

const categories = [
    {
        icon: Droplets,
        code: "01",
        title: "Water Testing",
        items: ["Drinking water", "Ground water", "Surface water", "Industrial effluent", "STP / ETP samples"],
    },
    {
        icon: Wind,
        code: "02",
        title: "Air & Emission",
        items: ["Ambient air quality", "Stack emission", "Workplace air", "VOCs & PAH", "Noise monitoring"],
    },
    {
        icon: Mountain,
        code: "03",
        title: "Soil Testing",
        items: ["Heavy metals", "Nutrient profile", "Contamination screening", "Leachate analysis", "Physicochemical"],
    },
    {
        icon: Beaker,
        code: "04",
        title: "Hazardous Waste",
        items: ["TCLP analysis", "Calorific value", "Characterisation", "Metal content", "Reactivity"],
    },
];

const scopeItems = [
    "NABL accredited as per ISO/IEC 17025:2017",
    "Scope covering chemical, environmental and microbiological",
    "Instrumentation: AAS, GC-MS, HPLC, ICP-OES, UV-VIS",
    "Trained chemists, microbiologists & environmental scientists",
    "Legally defensible reports accepted by CPCB/SPCB",
];

export default function NablLab() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <PageHero
                breadcrumb="Services / NABL Lab"
                title="NABL accredited environmental testing."
                subtitle="Water, air, soil and hazardous waste analysis — with on-site sample collection, rapid turnaround and tender-grade documentation."
            />

            {/* Categories */}
            <section className="nn-section bg-white" data-testid="nabl-categories">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Testing Categories</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Four parameter families. One lab.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            Every sample is barcoded, chain-of-custody logged and routed through
                            calibrated instruments by qualified chemists.
                        </p>
                    </div>
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {categories.map((c) => (
                            <div key={c.title} className="bg-white p-7">
                                <div className="flex items-center justify-between mb-7">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                        Cat {c.code}
                                    </span>
                                    <div className="w-10 h-10 flex items-center justify-center border border-slate-200 text-[#047857]">
                                        <c.icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">
                                    {c.title}
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                    {c.items.map((i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-1 h-1 bg-[#047857] rounded-full mt-2" />
                                            {i}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lab image + NABL scope */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="nabl-scope">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6">
                        <img src={LAB_IMG} alt="Environmental testing lab" className="w-full h-[460px] object-cover" />
                    </div>
                    <div className="lg:col-span-6">
                        <div className="nn-eyebrow mb-3">NABL Scope</div>
                        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            Accredited. Instrumented. Accountable.
                        </h2>
                        <ul className="mt-8 space-y-3">
                            {scopeItems.map((s) => (
                                <li key={s} className="flex items-start gap-3 bg-white border border-slate-200 p-4">
                                    <CheckCircle2 className="w-5 h-5 text-[#047857] mt-0.5 shrink-0" />
                                    <span className="text-slate-800 text-sm">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Sample collection / TAT / Reports */}
            <section className="nn-section bg-white" data-testid="nabl-ops">
                <div className="nn-container nn-grid-border grid grid-cols-1 md:grid-cols-3">
                    {[
                        {
                            icon: FlaskConical,
                            title: "Sample Collection",
                            desc: "Trained field teams collect samples on-site with GPS-tagged manifests and temperature-controlled transport where required.",
                            code: "Ops 01",
                        },
                        {
                            icon: Clock,
                            title: "Turnaround Time",
                            desc: "Standard reports in 5–7 working days. Express TAT of 48–72 hours available for routine parameter sets.",
                            code: "Ops 02",
                        },
                        {
                            icon: FileText,
                            title: "Reports & Compliance",
                            desc: "NABL-stamped, signed PDF reports. Assistance on CPCB submissions, consent-to-operate, EIA and EC compliance.",
                            code: "Ops 03",
                        },
                    ].map((b) => (
                        <div key={b.title} className="p-8 bg-white">
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">{b.code}</span>
                                <b.icon className="w-6 h-6 text-[#047857]" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">{b.title}</h3>
                            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Industries */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="nabl-industries">
                <div className="nn-container">
                    <div className="nn-eyebrow mb-3">Industries Served</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-3xl mb-10">
                        Trusted for tender-grade environmental reporting.
                    </h2>
                    <div className="nn-grid-border grid grid-cols-2 md:grid-cols-4 bg-white">
                        {["Refineries", "Cement", "Steel", "Pharma", "Power", "Municipalities", "Food", "Government"].map((i) => (
                            <div key={i} className="p-6 font-display font-semibold text-slate-900">{i}</div>
                        ))}
                    </div>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <button
                            data-testid="nabl-request-btn"
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 h-11 px-6 bg-[#047857] text-white font-semibold hover:bg-[#065F46]"
                        >
                            Request Testing <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            data-testid="nabl-sample-btn"
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 h-11 px-6 border border-slate-300 text-slate-900 font-semibold hover:bg-slate-100"
                        >
                            Submit Sample Enquiry
                        </button>
                    </div>
                </div>
            </section>

            <CtaBanner
                eyebrow="Lab services"
                title="Need a fast-turnaround NABL test?"
                primaryLabel="Request Testing"
                defaultType="lab_testing"
            />
            <QuoteDialog open={open} onOpenChange={setOpen} defaultType="lab_testing" />
        </>
    );
}
