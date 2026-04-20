import { Factory, Building2, Zap, TestTube2, FlaskConical, Truck, ShieldCheck, Award, Landmark, Wrench } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";

const industries = [
    { icon: Factory, label: "Cement", d: "Co-processing partner for kiln AFR programs." },
    { icon: Building2, label: "Steel", d: "Sludge, scale and refractory waste management." },
    { icon: Truck, label: "Refineries", d: "Spent catalyst recovery & sludge handling." },
    { icon: FlaskConical, label: "Chemicals", d: "Solvent recovery, ETP sludge, reactor residues." },
    { icon: TestTube2, label: "Pharma", d: "Expired API, spent solvent and biohazard chains." },
    { icon: Zap, label: "Power", d: "Fly ash valorisation, oil & transformer waste." },
    { icon: Landmark, label: "Government / PSU", d: "Tender-grade execution and documentation." },
    { icon: Wrench, label: "Automotive", d: "Paint sludge, ETP sludge, used oil logistics." },
];

const logos = Array.from({ length: 12 }).map((_, i) => `Client ${String(i + 1).padStart(2, "0")}`);

export default function Industries() {
    return (
        <>
            <PageHero
                breadcrumb="Industries / Clients"
                title="Serving India's most demanding industrial buyers."
                subtitle="Our operations are engineered around the compliance and documentation expectations of large corporates, PSUs and government bodies."
            />

            <section className="nn-section bg-white" data-testid="industries-grid-section">
                <div className="nn-container">
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {industries.map((i) => (
                            <div key={i.label} className="bg-white p-8 hover:bg-slate-50 transition-colors">
                                <div className="w-12 h-12 bg-[#0B192C] text-emerald-300 flex items-center justify-center">
                                    <i.icon className="w-5 h-5" />
                                </div>
                                <h3 className="mt-7 font-display text-xl font-black text-slate-900">{i.label}</h3>
                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{i.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="client-logos-section">
                <div className="nn-container">
                    <div className="nn-eyebrow mb-3">Our Clients</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-3xl mb-10">
                        Trusted by leading industrial names.
                    </h2>
                    <div className="nn-grid-border grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-white">
                        {logos.map((c) => (
                            <div key={c} className="h-24 flex items-center justify-center">
                                <div className="font-display font-bold text-slate-400 group-hover:text-slate-700 tracking-tight">
                                    {c}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                        Client logos · Placeholder · Actual logos used with permission
                    </p>
                </div>
            </section>

            <CtaBanner
                eyebrow="Tenders & partnerships"
                title="Empanel us for your next tender."
                primaryLabel="Start Empanelment"
                defaultType="contact"
            />
        </>
    );
}
