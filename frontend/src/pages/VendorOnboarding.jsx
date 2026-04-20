import { useState } from "react";
import { Loader2, CheckCircle2, Building2 } from "lucide-react";
import PageHero from "../components/site/PageHero";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { api, formatApiError } from "../lib/api";

export default function VendorOnboarding() {
    const [form, setForm] = useState({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        gst_number: "",
        category: "",
        address: "",
        website: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/vendors", form);
            setDone(true);
            setForm({
                company_name: "",
                contact_person: "",
                email: "",
                phone: "",
                gst_number: "",
                category: "",
                address: "",
                website: "",
                description: "",
            });
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHero
                breadcrumb="Vendors / Onboarding"
                title="Become an NN Polychem empanelled vendor."
                subtitle="Material suppliers, logistics partners and sub-contractors can apply here. Our procurement team reviews applications on a rolling basis."
            />

            <section className="nn-section bg-white" data-testid="vendor-onboarding-section">
                <div className="nn-container grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <div className="nn-eyebrow mb-3">Why Empanel</div>
                        <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-[1.15]">
                            Long-term contracts. Clear payment terms.
                        </h2>
                        <ul className="mt-8 space-y-4">
                            {[
                                "Direct procurement for industrial chemicals & consumables",
                                "Transport partners for authorised hazardous waste movement",
                                "Civil / electrical / mechanical sub-contracting",
                                "NABL lab consumable suppliers",
                            ].map((t) => (
                                <li key={t} className="flex items-start gap-3 text-sm text-slate-700">
                                    <Building2 className="w-4 h-4 text-[#047857] mt-1" />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="border border-slate-200 p-8 md:p-10">
                            {done ? (
                                <div className="py-10 flex flex-col items-center text-center" data-testid="vendor-success">
                                    <CheckCircle2 className="w-12 h-12 text-[#047857]" />
                                    <h3 className="font-display text-2xl font-black mt-4 text-slate-900">Application received</h3>
                                    <p className="text-slate-600 mt-2 max-w-md">
                                        Our procurement team will review your submission and reach out
                                        for document verification if shortlisted.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-4" data-testid="vendor-form">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input required data-testid="vendor-input-company" placeholder="Company name *" value={form.company_name} onChange={update("company_name")} className="rounded-none h-11 border-slate-300" />
                                        <Input required data-testid="vendor-input-contact" placeholder="Contact person *" value={form.contact_person} onChange={update("contact_person")} className="rounded-none h-11 border-slate-300" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input required type="email" data-testid="vendor-input-email" placeholder="Email *" value={form.email} onChange={update("email")} className="rounded-none h-11 border-slate-300" />
                                        <Input required data-testid="vendor-input-phone" placeholder="Phone *" value={form.phone} onChange={update("phone")} className="rounded-none h-11 border-slate-300" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input data-testid="vendor-input-gst" placeholder="GST number" value={form.gst_number} onChange={update("gst_number")} className="rounded-none h-11 border-slate-300" />
                                        <Input required data-testid="vendor-input-category" placeholder="Category (chemicals, transport, civil…) *" value={form.category} onChange={update("category")} className="rounded-none h-11 border-slate-300" />
                                    </div>
                                    <Input data-testid="vendor-input-website" placeholder="Website" value={form.website} onChange={update("website")} className="rounded-none h-11 border-slate-300" />
                                    <Textarea required rows={3} data-testid="vendor-input-address" placeholder="Registered address *" value={form.address} onChange={update("address")} className="rounded-none border-slate-300" />
                                    <Textarea rows={4} data-testid="vendor-input-description" placeholder="Brief capability / product description" value={form.description} onChange={update("description")} className="rounded-none border-slate-300" />
                                    {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</div>}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        data-testid="vendor-submit-btn"
                                        className="w-full h-12 bg-[#047857] text-white font-semibold hover:bg-[#065F46] disabled:opacity-60 inline-flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        Submit Application
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
