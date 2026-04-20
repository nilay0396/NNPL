import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { api, formatApiError } from "../../lib/api";

const services = [
    { value: "hazardous_waste", label: "Hazardous Waste Disposal" },
    { value: "tsdf", label: "TSDF Services" },
    { value: "co_processing", label: "Co-processing" },
    { value: "recycling", label: "Recycling / Value Recovery" },
    { value: "nabl_lab", label: "NABL Lab Testing" },
    { value: "products", label: "Speciality Chemicals" },
    { value: "other", label: "Other" },
];

export default function QuoteDialog({ open, onOpenChange, defaultType = "quote", defaultService }) {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        service_required: defaultService || "",
        message: "",
    });

    const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/enquiries", {
                ...form,
                enquiry_type: defaultType,
                source_page: typeof window !== "undefined" ? window.location.pathname : "",
            });
            setDone(true);
            setTimeout(() => {
                onOpenChange(false);
                setDone(false);
                setForm({ name: "", company: "", email: "", phone: "", service_required: "", message: "" });
            }, 1800);
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] p-0 rounded-none border border-slate-200" data-testid="quote-dialog">
                <div className="bg-[#0B192C] text-white p-6 relative overflow-hidden">
                    <div className="nn-dashed-grid absolute inset-0 opacity-60" />
                    <div className="relative">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300 mb-2">
                            Request a Quote
                        </div>
                        <DialogHeader>
                            <DialogTitle className="font-display text-2xl font-bold text-white tracking-tight">
                                Talk to our industrial experts
                            </DialogTitle>
                            <DialogDescription className="text-slate-300 text-sm mt-1">
                                Submit your requirement and we'll respond within 1 business day.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {done ? (
                    <div className="p-8 flex flex-col items-center text-center" data-testid="quote-success">
                        <CheckCircle2 className="w-12 h-12 text-[#047857]" />
                        <h3 className="font-display text-xl font-bold mt-3">Enquiry Received</h3>
                        <p className="text-slate-600 text-sm mt-2">
                            Thank you. Our team will reach out to you shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="p-6 space-y-4" data-testid="quote-form">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                data-testid="quote-input-name"
                                required
                                placeholder="Full name *"
                                value={form.name}
                                onChange={update("name")}
                                className="rounded-none h-11 border-slate-300"
                            />
                            <Input
                                data-testid="quote-input-company"
                                placeholder="Company"
                                value={form.company}
                                onChange={update("company")}
                                className="rounded-none h-11 border-slate-300"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                data-testid="quote-input-email"
                                required
                                type="email"
                                placeholder="Email *"
                                value={form.email}
                                onChange={update("email")}
                                className="rounded-none h-11 border-slate-300"
                            />
                            <Input
                                data-testid="quote-input-phone"
                                required
                                placeholder="Phone *"
                                value={form.phone}
                                onChange={update("phone")}
                                className="rounded-none h-11 border-slate-300"
                            />
                        </div>
                        <Select
                            value={form.service_required}
                            onValueChange={(v) => setForm((f) => ({ ...f, service_required: v }))}
                        >
                            <SelectTrigger data-testid="quote-select-service" className="rounded-none h-11 border-slate-300">
                                <SelectValue placeholder="Service required" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {services.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            data-testid="quote-input-message"
                            required
                            placeholder="Describe your requirement *"
                            value={form.message}
                            onChange={update("message")}
                            rows={4}
                            className="rounded-none border-slate-300"
                        />
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="quote-submit-btn"
                            className="w-full h-12 bg-[#047857] text-white font-semibold hover:bg-[#065F46] disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Submit Enquiry
                        </button>
                        <p className="text-[11px] text-slate-500 text-center">
                            By submitting, you agree to be contacted regarding your enquiry.
                        </p>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
