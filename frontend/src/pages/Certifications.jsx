import { Download, ShieldCheck, Award, BadgeCheck } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";

const certs = [
    { name: "GPCB Hazardous Waste Authorisation", body: "Gujarat Pollution Control Board", type: "Authorisation", file: "/assets/certs/gpcb.pdf" },
    { name: "CPCB Co-processing Compliance", body: "Central Pollution Control Board", type: "Guideline Compliance", file: "/assets/certs/cpcb.pdf" },
    { name: "NABL Accreditation ISO/IEC 17025", body: "National Accreditation Board", type: "Lab Accreditation", file: "/assets/certs/nabl.pdf" },
    { name: "ISO 9001:2015 Quality", body: "TÜV / BSI", type: "Management System", file: "/assets/certs/iso9001.pdf" },
    { name: "ISO 14001:2015 Environmental", body: "TÜV / BSI", type: "Management System", file: "/assets/certs/iso14001.pdf" },
    { name: "ISO 45001:2018 Occupational H&S", body: "TÜV / BSI", type: "Management System", file: "/assets/certs/iso45001.pdf" },
    { name: "Factory Licence", body: "Directorate of Industrial Safety & Health", type: "Statutory Licence", file: "/assets/certs/factory.pdf" },
    { name: "CGWA Ground Water NOC", body: "Central Ground Water Authority", type: "NOC", file: "/assets/certs/cgwa.pdf" },
];

export default function Certifications() {
    return (
        <>
            <PageHero
                breadcrumb="Compliance / Certifications"
                title="Regulatory-grade, accredited and auditable."
                subtitle="Every statutory authorisation, accreditation and ISO certification — available for download or tender submission on request."
            />

            <section className="nn-section bg-white" data-testid="certs-list">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Accreditations & Approvals</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Eight critical certificates on one page.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            Certificates below are representative placeholders. The current
                            signed PDF copies are shared via secure link on tender request.
                        </p>
                    </div>
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {certs.map((c, i) => (
                            <div key={c.name} className="bg-white p-7 flex flex-col" data-testid={`cert-card-${i}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                        {c.type}
                                    </span>
                                    <ShieldCheck className="w-5 h-5 text-[#047857]" />
                                </div>
                                <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">{c.name}</h3>
                                <div className="text-xs text-slate-500 mt-1">{c.body}</div>
                                <a
                                    href={c.file}
                                    onClick={(e) => e.preventDefault()}
                                    data-testid={`cert-download-${i}`}
                                    className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#047857] hover:text-[#065F46]"
                                >
                                    <Download className="w-4 h-4" /> Download Certificate
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative bg-[#0B192C] text-white overflow-hidden" data-testid="cert-strip">
                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                <div className="nn-grain" />
                <div className="relative nn-container py-20 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { i: Award, t: "Audit-Ready", d: "Documents maintained for statutory and third-party audit readiness at all times." },
                        { i: BadgeCheck, t: "Tender-Compatible", d: "Stamped, signed, scanned copies accepted by PSU e-procurement portals." },
                        { i: ShieldCheck, t: "Safety-First", d: "All operational staff under documented safety training and PPE protocols." },
                    ].map((s) => (
                        <div key={s.t} className="border border-white/10 p-7">
                            <s.i className="w-6 h-6 text-emerald-400" />
                            <div className="mt-6 font-display text-xl font-bold">{s.t}</div>
                            <p className="mt-2 text-sm text-slate-300">{s.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            <CtaBanner
                eyebrow="Tender support"
                title="Need certificates for tender submission?"
                primaryLabel="Request Documents"
                defaultType="contact"
            />
        </>
    );
}
