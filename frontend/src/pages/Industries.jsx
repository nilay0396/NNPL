import { Factory, Building2, Zap, TestTube2, FlaskConical, Truck, ShieldCheck, Landmark, Wrench } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";
import ClientLogoTile from "../components/site/ClientLogoTile";
import { CLIENTS } from "../lib/clients";

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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Our Clients</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Trusted by 150+ industrial clients — PSUs, pharma majors and manufacturing leaders.
                            </h2>
                            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#047857]" data-testid="clients-tagline">
                                150+ clients · Mining · Cement · Steel · Pharma · Refineries · Power · PSUs
                            </p>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            A representative selection of active corporate and PSU clients — with
                            engagements spanning multi-site pan-India waste management, NABL testing
                            and speciality chemicals supply.
                        </p>
                    </div>

                    <div className="nn-grid-border grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-white">
                        {CLIENTS.map((c) => (
                            <ClientLogoTile key={c.slug} slug={c.slug} name={c.name} sector={c.sector} />
                        ))}
                    </div>

                    <div className="mt-10 nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white">
                        {CLIENTS.slice(0, 6).map((c) => (
                            <div key={`${c.slug}-detail`} className="p-6" data-testid={`client-detail-${c.slug}`}>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[#047857]" />
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                        {c.sector}
                                    </span>
                                </div>
                                <h3 className="mt-4 font-display font-bold text-slate-900">{c.name}</h3>
                                <p className="mt-1 text-xs text-slate-500 font-mono">{c.locations}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-6 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                        Client marks are the property of respective owners — displayed for reference only.
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
