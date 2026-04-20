import { Link } from "react-router-dom";
import { ArrowRight, Recycle, FlaskConical } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";

export default function Services() {
    return (
        <>
            <PageHero
                breadcrumb="Services"
                title="Two service pillars. One integrated operator."
                subtitle="We operate only in two categories, deeply — so our clients get engineering-grade delivery instead of a generic contracting interface."
            />

            <section className="nn-section bg-white" data-testid="services-parent">
                <div className="nn-container grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/services/hazardous-waste" className="nn-card p-10 group" data-testid="services-haz-card">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">Pillar 01</span>
                            <Recycle className="w-6 h-6 text-slate-400 group-hover:text-[#047857] transition" />
                        </div>
                        <h2 className="mt-10 font-display text-3xl md:text-4xl font-black text-slate-900 leading-[1.05]">
                            Hazardous Waste<br />Management Solutions
                        </h2>
                        <p className="mt-5 text-slate-600 leading-relaxed">
                            Authorised, end-to-end hazardous and industrial waste handling —
                            including TSDF, co-processing, recycling and value recovery
                            programs designed for large industrial buyers and PSU tenders.
                        </p>
                        <div className="mt-8 nn-link-arrow">Explore More <ArrowRight className="w-4 h-4" /></div>
                    </Link>

                    <Link to="/services/nabl-lab" className="nn-card p-10 group" data-testid="services-nabl-card">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">Pillar 02</span>
                            <FlaskConical className="w-6 h-6 text-slate-400 group-hover:text-[#047857] transition" />
                        </div>
                        <h2 className="mt-10 font-display text-3xl md:text-4xl font-black text-slate-900 leading-[1.05]">
                            NABL Accredited<br />Environmental Lab
                        </h2>
                        <p className="mt-5 text-slate-600 leading-relaxed">
                            Comprehensive NABL accredited testing for water, air, soil and
                            hazardous waste — with rapid turnaround, legally defensible
                            reports and on-site sampling support.
                        </p>
                        <div className="mt-8 nn-link-arrow">Explore More <ArrowRight className="w-4 h-4" /></div>
                    </Link>
                </div>
            </section>

            <CtaBanner />
        </>
    );
}
