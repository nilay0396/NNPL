import { Download, ShieldCheck, Award, BadgeCheck, FlaskConical } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";
import { ACCREDITATION } from "../lib/labScope";

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const certs = [
    {
        name: "NABL Accreditation",
        body: "National Accreditation Board for Testing and Calibration Laboratories",
        type: "Lab Accreditation",
        standard: ACCREDITATION.standard,
        number: ACCREDITATION.certificateNumber,
        validFrom: formatDate(ACCREDITATION.validFrom),
        validTo: formatDate(ACCREDITATION.validTo),
        icon: FlaskConical,
        featured: true,
        file: "/assets/certs/nabl-scope.pdf",
    },
    {
        name: "GPCB Hazardous Waste Authorisation",
        body: "Jharkhand State Pollution Control Board",
        type: "Authorisation",
        standard: "Hazardous & Other Wastes (M & TBM) Rules, 2016",
        file: "/assets/certs/hw-authorisation.pdf",
    },
    {
        name: "CPCB Co-processing Compliance",
        body: "Central Pollution Control Board",
        type: "Guideline Compliance",
        standard: "CPCB Co-processing Guidelines",
        file: "/assets/certs/cpcb-coprocessing.pdf",
    },
    {
        name: "ISO 9001:2015",
        body: "Quality Management System · TÜV / BSI",
        type: "Management System",
        standard: "ISO 9001:2015",
        file: "/assets/certs/iso9001.pdf",
    },
    {
        name: "ISO 14001:2015",
        body: "Environmental Management · TÜV / BSI",
        type: "Management System",
        standard: "ISO 14001:2015",
        file: "/assets/certs/iso14001.pdf",
    },
    {
        name: "ISO 45001:2018",
        body: "Occupational Health & Safety · TÜV / BSI",
        type: "Management System",
        standard: "ISO 45001:2018",
        file: "/assets/certs/iso45001.pdf",
    },
    {
        name: "Factory Licence",
        body: "Directorate of Industrial Safety & Health",
        type: "Statutory Licence",
        file: "/assets/certs/factory.pdf",
    },
    {
        name: "CGWA Ground Water NOC",
        body: "Central Ground Water Authority",
        type: "NOC",
        file: "/assets/certs/cgwa.pdf",
    },
];

export default function Certifications() {
    const featured = certs.find((c) => c.featured);
    const rest = certs.filter((c) => !c.featured);

    return (
        <>
            <PageHero
                breadcrumb="Compliance / Certifications"
                title="Regulatory-grade, accredited and auditable."
                subtitle="Every statutory authorisation, accreditation and ISO certification — available for download or tender submission on request."
            />

            {/* Featured NABL card */}
            {featured && (
                <section className="relative bg-slate-50 border-b border-slate-200" data-testid="cert-featured-nabl">
                    <div className="nn-container py-14 md:py-16">
                        <div className="nn-eyebrow mb-4">Primary Accreditation</div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                            <div className="lg:col-span-7 bg-[#0B192C] text-white p-8 md:p-10 relative overflow-hidden">
                                <div className="absolute inset-0 nn-dashed-grid opacity-40" />
                                <div className="nn-grain" />
                                <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#047857]/20 blur-3xl" aria-hidden />
                                <div className="relative">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="nn-eyebrow-light">{featured.type}</div>
                                        <div className="w-14 h-14 bg-white/5 border border-white/15 flex items-center justify-center">
                                            <FlaskConical className="w-6 h-6 text-emerald-300" strokeWidth={1.7} />
                                        </div>
                                    </div>
                                    <h2 className="mt-10 font-display text-3xl md:text-4xl font-black tracking-tight text-white leading-[1.05]">
                                        {featured.name}
                                    </h2>
                                    <p className="mt-3 text-slate-300 text-sm">{featured.body}</p>

                                    <dl className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 pt-6 border-t border-white/10">
                                        <MetaCell label="Standard" value={featured.standard} />
                                        <MetaCell label="Certificate No." value={featured.number} accent />
                                        <MetaCell label="Valid From" value={featured.validFrom} />
                                        <MetaCell label="Valid Till" value={featured.validTo} accent />
                                        <MetaCell label="Laboratory" value="NilayNarayan Polychem LLP" wide />
                                    </dl>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <a
                                            href={featured.file}
                                            onClick={(e) => e.preventDefault()}
                                            data-testid="cert-featured-download"
                                            className="inline-flex items-center gap-2 h-11 px-5 bg-[#047857] text-white font-semibold hover:bg-[#059669]"
                                        >
                                            <Download className="w-4 h-4" /> Download NABL Scope
                                        </a>
                                        <a
                                            href="/services/nabl-lab"
                                            className="inline-flex items-center gap-2 h-11 px-5 border border-white/20 text-white font-semibold hover:bg-white/5"
                                        >
                                            View Lab Scope
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 bg-white border border-slate-200 p-8 md:p-10">
                                <div className="nn-eyebrow mb-3">What this covers</div>
                                <h3 className="font-display text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                    Accredited testing across six sample families.
                                </h3>
                                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                                    {[
                                        "Ambient Air & Stack Emission",
                                        "Soil, Sediment & Waste",
                                        "Wastewater, Effluent & Sewage",
                                        "Drinking, Ground, Packaged & Surface Water",
                                        "Ambient & Source Noise · Site Testing",
                                    ].map((s) => (
                                        <li key={s} className="flex items-start gap-2.5">
                                            <BadgeCheck className="w-4 h-4 text-[#047857] mt-0.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                            Accredited determinations
                                        </div>
                                        <div className="font-display text-3xl font-black text-slate-900 tracking-tight mt-1">
                                            {ACCREDITATION.totalClaim}
                                        </div>
                                    </div>
                                    <ShieldCheck className="w-8 h-8 text-[#047857]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Other certifications */}
            <section className="nn-section bg-white" data-testid="certs-list">
                <div className="nn-container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
                        <div className="lg:col-span-7">
                            <div className="nn-eyebrow mb-3">Authorisations & Approvals</div>
                            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                Statutory authorisations and ISO management systems.
                            </h2>
                        </div>
                        <p className="lg:col-span-5 text-slate-600">
                            Signed PDF copies are shared via secure link on tender request.
                            Placeholders below are refreshed whenever a renewal is issued.
                        </p>
                    </div>
                    <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rest.map((c, i) => (
                            <div key={c.name} className="bg-white p-7 flex flex-col" data-testid={`cert-card-${i}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                        {c.type}
                                    </span>
                                    <ShieldCheck className="w-5 h-5 text-[#047857]" />
                                </div>
                                <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">{c.name}</h3>
                                <div className="text-xs text-slate-500 mt-1">{c.body}</div>
                                {c.standard && (
                                    <div className="mt-4 text-[11px] font-mono uppercase tracking-[0.15em] text-slate-700 border border-slate-200 px-2 py-1 self-start">
                                        {c.standard}
                                    </div>
                                )}
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

function MetaCell({ label, value, accent = false, wide = false }) {
    return (
        <div className={wide ? "col-span-2 sm:col-span-3" : ""}>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
            <div className={`mt-1.5 font-display font-bold ${accent ? "text-emerald-300 text-lg" : "text-white"}`}>
                {value}
            </div>
        </div>
    );
}
