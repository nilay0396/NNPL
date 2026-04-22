import { Target, Compass, Wrench, FlaskConical, Truck, Users, Award, Factory } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";

const INFRA_IMG =
    "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function About() {
    return (
        <>
            <PageHero
                breadcrumb="About / Company"
                title="A decade of integrated environmental engineering."
                subtitle="NilayNarayan Polychem LLP is a tender-grade environmental infrastructure company serving cement, steel, refineries, pharma, power and government sectors across India."
            />

            {/* Vision / Mission */}
            <section className="nn-section bg-white" data-testid="about-vm">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="nn-eyebrow mb-3">Our North Star</div>
                        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            Purpose, precision, and permanence.
                        </h2>
                    </div>
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="nn-card p-8">
                            <Target className="w-6 h-6 text-[#047857]" />
                            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Mission</h3>
                            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                                Enable zero-landfill outcomes for Indian industry through co-processing,
                                material recovery and compliant disposal pathways — with transparent
                                digital manifests.
                            </p>
                        </div>
                        <div className="nn-card p-8">
                            <Compass className="w-6 h-6 text-[#047857]" />
                            <h3 className="mt-6 font-display text-xl font-bold text-slate-900">Vision</h3>
                            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                                To be the most trusted integrated environmental infrastructure partner
                                for India's largest industrial groups, PSUs and government bodies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infrastructure */}
            <section className="nn-section bg-slate-50 border-y border-slate-200" data-testid="about-infra">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6">
                        <div className="relative">
                            <img src={INFRA_IMG} alt="Industrial warehouse" className="w-full h-[440px] object-cover" />
                            <div className="absolute -bottom-6 -right-6 hidden md:block bg-[#0B192C] text-white p-6 w-64">
                                <div className="nn-eyebrow-light mb-2">Facility</div>
                                <div className="font-display text-2xl font-black">25 Acres</div>
                                <div className="text-xs text-slate-300 mt-1">Integrated TSDF + Lab campus</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-6">
                        <div className="nn-eyebrow mb-3">Infrastructure</div>
                        <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            A single operational campus — plant, lab and logistics.
                        </h2>
                        <p className="mt-5 text-slate-600 leading-relaxed">
                            Our integrated site is engineered to handle inbound hazardous waste,
                            characterise it through an on-site NABL lab, and dispatch it through
                            co-processing, recycling or secure disposal — without external handoffs.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {[
                                { icon: Factory, t: "TSDF Unit", d: "Secured landfill & storage" },
                                { icon: FlaskConical, t: "NABL Lab", d: "Analytical testing core" },
                                { icon: Wrench, t: "Pre-treatment", d: "Neutralisation & stabilisation" },
                                { icon: Truck, t: "Logistics Fleet", d: "Authorised transport" },
                            ].map((i) => (
                                <div key={i.t} className="border border-slate-200 p-5 bg-white">
                                    <i.icon className="w-5 h-5 text-[#047857]" />
                                    <div className="font-display font-bold mt-3 text-slate-900">{i.t}</div>
                                    <div className="text-xs text-slate-500 mt-1">{i.d}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="nn-section bg-white" data-testid="about-leadership">
                <div className="nn-container">
                    <div className="nn-eyebrow mb-3">Leadership & Legacy</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-3xl">
                        Led by engineers. Backed by industrial veterans.
                    </h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { n: "Managing Partner", r: "Industrial Operations & Strategy", y: "25+ yrs" },
                            { n: "Technical Director", r: "Chemical Engineering & Lab", y: "20+ yrs" },
                            { n: "Compliance Head", r: "Regulatory & Government Liaison", y: "18+ yrs" },
                        ].map((l) => (
                            <div key={l.n} className="nn-card p-8">
                                <div className="w-16 h-16 bg-[#0B192C] text-emerald-300 font-display font-black text-2xl flex items-center justify-center">
                                    NN
                                </div>
                                <div className="mt-6 font-display font-bold text-slate-900 text-lg">{l.n}</div>
                                <div className="text-sm text-slate-600 mt-1">{l.r}</div>
                                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                    {l.y} experience
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Numbers */}
            <section className="relative bg-[#0B192C] text-white overflow-hidden" data-testid="about-numbers">
                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                <div className="nn-grain" />
                <div className="relative nn-container py-20 md:py-24">
                    <div className="nn-eyebrow-light mb-3">By The Numbers</div>
                    <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.05] max-w-3xl mb-12">
                        Scale that speaks to industrial buyers.
                    </h2>
                    <div className="nn-grid-border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                        <div className="grid grid-cols-2 md:grid-cols-4">
                            {[
                                { k: "2,04,000", l: "TPA authorised capacity", icon: Truck },
                                { k: "5", l: "Waste categories · Schedule I–III", icon: Award },
                                { k: "17,000", l: "MT / month sanctioned intake", icon: FlaskConical },
                                { k: "NABL", l: "Accredited environmental lab", icon: Users },
                            ].map((s) => (
                                <div key={s.l} className="p-7 md:p-8 border-r border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                                    <s.icon className="w-5 h-5 text-emerald-400" />
                                    <div className="mt-8 font-display text-4xl md:text-5xl font-black tracking-tight">
                                        {s.k}
                                    </div>
                                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                        {s.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <CtaBanner
                eyebrow="Partner with us"
                title="Looking for a long-term environmental partner?"
                subtitle="We onboard industrial clients through site visits, requirement scoping and pilot batches. Let's start the conversation."
            />
        </>
    );
}
