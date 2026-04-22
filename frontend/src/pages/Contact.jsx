import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Loader2, CheckCircle2, Clock } from "lucide-react";
import PageHero from "../components/site/PageHero";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api, formatApiError } from "../lib/api";
import { COMPANY, whatsappHref } from "../lib/company";

const services = [
    "Hazardous Waste Disposal",
    "TSDF Services",
    "Co-processing",
    "Recycling / Value Recovery",
    "NABL Lab Testing",
    "Speciality Chemicals",
    "Tender / Empanelment",
    "Other",
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", service_required: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/enquiries", { ...form, enquiry_type: "contact", source_page: "/contact" });
            setDone(true);
            setForm({ name: "", company: "", email: "", phone: "", service_required: "", message: "" });
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHero
                breadcrumb="Contact"
                title="Let's build your environmental compliance program."
                subtitle="Reach our industrial response team via phone, WhatsApp, email or the form below. We respond within one business day."
            />

            <section className="nn-section bg-white" data-testid="contact-main">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Contact info */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="nn-eyebrow mb-3">Direct Channels</div>
                        <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-[1.15]">
                            One call away from an industrial response team.
                        </h2>
                        <div className="mt-8 space-y-4">
                            {COMPANY.phones.map((p) => (
                                <a
                                    key={p.raw}
                                    href={`tel:${p.raw}`}
                                    data-testid={`contact-call-btn-${p.label.toLowerCase()}`}
                                    className="nn-card p-5 flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 bg-[#0B192C] text-emerald-300 flex items-center justify-center">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">{p.label}</div>
                                        <div className="font-display font-bold text-slate-900">{p.number}</div>
                                    </div>
                                </a>
                            ))}
                            <a
                                href={whatsappHref()}
                                target="_blank"
                                rel="noreferrer"
                                data-testid="contact-whatsapp-btn"
                                className="nn-card p-5 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-[#25D366] text-[#0B192C] flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">WhatsApp</div>
                                    <div className="font-display font-bold text-slate-900">Message our team</div>
                                </div>
                            </a>
                            <a
                                href={`mailto:${COMPANY.email}`}
                                data-testid="contact-email-btn"
                                className="nn-card p-5 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-[#047857] text-white flex items-center justify-center">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">Email</div>
                                    <div className="font-display font-bold text-slate-900 truncate">{COMPANY.email}</div>
                                </div>
                            </a>
                        </div>

                        <div className="mt-8 p-6 border border-slate-200 bg-slate-50">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#047857] mt-0.5" />
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">Registered Office</div>
                                    <div className="mt-1 font-display font-bold text-slate-900">{COMPANY.name}</div>
                                    <div className="text-sm text-slate-600 mt-1">
                                        {COMPANY.address.line1}<br />
                                        {COMPANY.address.line2}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
                                <Clock className="w-3.5 h-3.5" /> Mon – Sat · 09:00 to 18:30 IST
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-7">
                        <div className="border border-slate-200 p-8 md:p-10 bg-white" data-testid="contact-form-wrapper">
                            {done ? (
                                <div className="py-10 flex flex-col items-center text-center" data-testid="contact-success">
                                    <CheckCircle2 className="w-12 h-12 text-[#047857]" />
                                    <h3 className="font-display text-2xl font-black mt-4 text-slate-900">Enquiry received</h3>
                                    <p className="text-slate-600 mt-2 max-w-md">
                                        Thank you for reaching out. A member of our industrial response team
                                        will contact you within one business day.
                                    </p>
                                    <button
                                        onClick={() => setDone(false)}
                                        data-testid="contact-send-another-btn"
                                        className="mt-6 h-10 px-6 border border-slate-300 text-sm font-semibold hover:bg-slate-50"
                                    >
                                        Send another enquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-4" data-testid="contact-form">
                                    <div className="nn-eyebrow">Send a message</div>
                                    <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">
                                        Share your requirement
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <Input data-testid="contact-input-name" required placeholder="Full name *" value={form.name} onChange={update("name")} className="rounded-none h-11 border-slate-300" />
                                        <Input data-testid="contact-input-company" placeholder="Company" value={form.company} onChange={update("company")} className="rounded-none h-11 border-slate-300" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input data-testid="contact-input-email" required type="email" placeholder="Email *" value={form.email} onChange={update("email")} className="rounded-none h-11 border-slate-300" />
                                        <Input data-testid="contact-input-phone" required placeholder="Phone *" value={form.phone} onChange={update("phone")} className="rounded-none h-11 border-slate-300" />
                                    </div>
                                    <Select value={form.service_required} onValueChange={(v) => setForm((f) => ({ ...f, service_required: v }))}>
                                        <SelectTrigger data-testid="contact-select-service" className="rounded-none h-11 border-slate-300">
                                            <SelectValue placeholder="Service required" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            {services.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <Textarea data-testid="contact-input-message" required rows={5} placeholder="Describe your requirement *" value={form.message} onChange={update("message")} className="rounded-none border-slate-300" />
                                    {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</div>}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        data-testid="contact-submit-btn"
                                        className="w-full h-12 bg-[#047857] text-white font-semibold hover:bg-[#065F46] disabled:opacity-60 inline-flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        Submit Enquiry
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="relative bg-slate-50 border-t border-slate-200" data-testid="contact-map-section">
                <div className="nn-container py-10">
                    <div className="flex items-end justify-between mb-4 gap-4 flex-wrap">
                        <div>
                            <div className="nn-eyebrow mb-2">Our Location</div>
                            <div className="font-display font-bold text-slate-900 text-lg leading-tight">
                                {COMPANY.address.line1}
                            </div>
                            <div className="text-sm text-slate-600">{COMPANY.address.line2}</div>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address.mapsQuery)}`}
                            target="_blank"
                            rel="noreferrer"
                            data-testid="contact-open-maps-btn"
                            className="inline-flex items-center gap-2 h-10 px-5 border border-slate-300 bg-white text-sm font-semibold text-slate-900 hover:border-[#047857] hover:text-[#047857]"
                        >
                            Open in Google Maps
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                        </a>
                    </div>
                    <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden bg-[#0B192C]">
                        <iframe
                            data-testid="contact-map-iframe"
                            title="NilayNarayan Polychem LLP — Kandra Industrial Area, Govindpur, Jharkhand"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(COMPANY.address.mapsQuery)}&output=embed`}
                            className="absolute inset-0 w-full h-full grayscale contrast-[1.1]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
