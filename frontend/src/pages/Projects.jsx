import { FileText, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";

const cases = [
    {
        tag: "Government Tender",
        title: "Integrated hazardous waste disposal for a State PSU cluster",
        sector: "Public Sector · Multi-site",
        volume: "11,200 MT / year",
        problem: "Legacy hazardous waste spread across 6 state-PSU sites with inconsistent manifests, failed CPCB audits and rising landfill liability.",
        solution: "Consolidated pickup schedule, unified digital manifest, on-site characterisation via NABL lab, co-processing diversion where eligible, and secure TSDF disposal for residues.",
        outcome: "Audit-clean closure of legacy inventory, 42% diversion to co-processing and a single dashboard across all six sites.",
    },
    {
        tag: "Cement Co-processing",
        title: "AFR blend program with a leading cement plant",
        sector: "Cement · Western India",
        volume: "8,500 MT alt-fuel",
        problem: "Plant required a consistent, calorific-qualified alternate fuel stream with full CPCB documentation from a single source.",
        solution: "NABL characterisation + blend design + co-processing logistics executed by NN Polychem under annual contract.",
        outcome: "Thermal substitution rate improvement; emissions profile maintained within licensed limits across four quarters.",
    },
    {
        tag: "Pharma Cluster",
        title: "ETP sludge recycling for a pharma industrial cluster",
        sector: "Pharma · 9 plants",
        volume: "3,100 MT / year",
        problem: "Member units of the cluster faced rising landfill costs and variable sludge quality across plants.",
        solution: "Standardised sampling SOP, central NABL testing, engineered stabilisation, and diversion of eligible fractions to co-processing.",
        outcome: "18% cost reduction, zero audit non-conformities, single point-of-accountability across 9 plants.",
    },
    {
        tag: "Refinery",
        title: "Spent catalyst metal recovery campaign",
        sector: "Refinery · Single site",
        volume: "420 MT catalyst",
        problem: "Stockpiled spent catalysts with unknown residual metal value and storage liability.",
        solution: "Batch-wise characterisation, metal recovery routing through licensed reclaimers, and TSDF disposal for inert residues.",
        outcome: "Recovered base-metal value offset the entire program cost; site liability cleared.",
    },
];

export default function Projects() {
    return (
        <>
            <PageHero
                breadcrumb="Projects / Case Studies"
                title="Projects executed. Tenders closed. Outcomes documented."
                subtitle="A representative sample of PSU and large-corporate programs delivered by NN Polychem — each built on the same manifest-to-disposal backbone."
            />

            <section className="nn-section bg-white" data-testid="projects-list">
                <div className="nn-container">
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 bg-white">
                        {cases.map((c, i) => (
                            <article key={c.title} className="bg-white p-8 md:p-10 flex flex-col" data-testid={`case-study-${i}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857] border border-[#047857] px-2 py-1">
                                        {c.tag}
                                    </span>
                                    <FileText className="w-5 h-5 text-slate-400" />
                                </div>
                                <h3 className="mt-10 font-display text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    {c.title}
                                </h3>
                                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono uppercase tracking-[0.15em]">
                                    <div><span className="text-slate-500">Sector · </span><span className="text-slate-900">{c.sector}</span></div>
                                    <div><span className="text-slate-500">Volume · </span><span className="text-[#047857]">{c.volume}</span></div>
                                </div>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <Block label="Problem" text={c.problem} />
                                    <Block label="Solution" text={c.solution} />
                                    <Block label="Outcome" text={c.outcome} accent />
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-4 h-4 text-[#047857]" />
                                        <span className="text-sm font-semibold text-slate-900">Measurable before / after impact</span>
                                    </div>
                                    <button className="nn-link-arrow" data-testid={`case-request-${i}`}>
                                        Request full case study <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBanner
                eyebrow="Similar problem?"
                title="Share your use case — we'll propose a structured program."
                defaultType="contact"
            />
        </>
    );
}

function Block({ label, text, accent }) {
    return (
        <div className={`p-5 border ${accent ? "border-[#047857] bg-emerald-50/40" : "border-slate-200"}`}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                <CheckCircle2 className="w-3.5 h-3.5" /> {label}
            </div>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">{text}</p>
        </div>
    );
}
