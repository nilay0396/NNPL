import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader2, CheckCircle2 } from "lucide-react";
import SelectOrType from "./SelectOrType";
import { api, formatApiError } from "../../lib/api";
import {
    SERVICE_OPTIONS,
    WASTE_CATEGORY_OPTIONS,
    PICKUP_FREQUENCY_OPTIONS,
    SAMPLE_CATEGORY_OPTIONS,
    WATER_MATRIX_OPTIONS,
    SAMPLING_OPTIONS,
    TAT_OPTIONS,
    PRODUCT_OPTIONS,
    PACKAGING_OPTIONS,
    PRODUCT_REQ_TYPE_OPTIONS,
} from "../../lib/enquiryOptions";

const VARIANTS = {
    contact: {
        title: "Send us a message",
        subtitle: "Share your requirement — we'll respond within one business day.",
        eyebrow: "General Enquiry",
    },
    quote: {
        title: "Request a quote",
        subtitle: "Submit your requirement and our commercial team will revert within one business day.",
        eyebrow: "Get a Quote",
    },
    waste_pickup: {
        title: "Request a waste pickup",
        subtitle: "Tell us the waste category, tonnage and pickup frequency — we'll respond with a scoped proposal.",
        eyebrow: "Waste Pickup Enquiry",
    },
    lab_testing: {
        title: "Request accredited testing",
        subtitle: "Describe your samples and turnaround expectation. Our lab team will send a scoped quote.",
        eyebrow: "NABL Lab Enquiry",
    },
    product: {
        title: "Product enquiry",
        subtitle: "Tell us the product, quantity and packaging — we will share a commercial proposal.",
        eyebrow: "Product Enquiry",
    },
    sample: {
        title: "Submit a sample enquiry",
        subtitle: "Share sample details and required parameters — we'll schedule pickup or receipt.",
        eyebrow: "Sample Enquiry",
    },
};

function emptyDetails() {
    return {
        waste_category: "",
        estimated_tonnage: "",
        pickup_frequency: "",
        pickup_location: "",
        sample_category: "",
        water_matrix: "",
        sample_count: "",
        sampling: "",
        turnaround: "",
        product: "",
        quantity: "",
        packaging: "",
        requirement_type: "",
        delivery_pincode: "",
        document_requested: "",
    };
}

/**
 * EnquiryDialog — smart enquiry form.
 * Kept as default export `QuoteDialog` name so all existing callers keep working.
 *
 * Props:
 *  - open, onOpenChange
 *  - defaultType: "contact" | "quote" | "waste_pickup" | "lab_testing" | "product" | "sample"
 *  - context: { product?, sampleCategory?, waterMatrix?, wasteCategory?, service? } auto-fill hints
 */
export default function QuoteDialog({ open, onOpenChange, defaultType = "quote", context }) {
    const variant = VARIANTS[defaultType] || VARIANTS.quote;

    const [common, setCommon] = useState({ name: "", company: "", email: "", phone: "", message: "" });
    const [service, setService] = useState("");
    const [details, setDetails] = useState(emptyDetails());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    // Reset / auto-fill on open
    useEffect(() => {
        if (!open) return;
        setDone(false);
        setError("");
        setCommon({ name: "", company: "", email: "", phone: "", message: "" });
        setService(context?.service || "");
        setDetails({
            ...emptyDetails(),
            product: context?.product || "",
            sample_category: context?.sampleCategory || "",
            water_matrix: context?.waterMatrix || "",
            waste_category: context?.wasteCategory || "",
            document_requested: context?.docRequested || "",
        });
    }, [open, context]);

    const setC = (k) => (e) => setCommon((s) => ({ ...s, [k]: e.target.value }));
    const setD = (k) => (v) => setDetails((s) => ({ ...s, [k]: typeof v === "string" ? v : v.target.value }));

    const cleanedDetails = useMemo(() => {
        const out = {};
        Object.entries(details).forEach(([k, v]) => {
            if (v !== "" && v != null) out[k] = v;
        });
        return out;
    }, [details]);

    // Derive service_required if not explicitly picked
    const derivedService = useMemo(() => {
        if (service) return service;
        if (defaultType === "waste_pickup") return details.waste_category || "Hazardous Waste Pickup";
        if (defaultType === "lab_testing" || defaultType === "sample")
            return details.sample_category || "NABL Lab Testing";
        if (defaultType === "product") return details.product || "Speciality Chemicals";
        return null;
    }, [service, defaultType, details]);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/enquiries", {
                ...common,
                service_required: derivedService,
                enquiry_type: defaultType,
                source_page: typeof window !== "undefined" ? window.location.pathname : "",
                details: Object.keys(cleanedDetails).length ? cleanedDetails : null,
            });
            setDone(true);
            setTimeout(() => onOpenChange(false), 1600);
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const showWaste = defaultType === "waste_pickup";
    const showLab = defaultType === "lab_testing" || defaultType === "sample";
    const showProduct = defaultType === "product";
    const showService = defaultType === "quote" || defaultType === "contact";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[600px] p-0 rounded-none border border-slate-200 max-h-[92vh] overflow-y-auto"
                data-testid="enquiry-dialog"
            >
                <div className="bg-[#0B192C] text-white p-6 relative overflow-hidden">
                    <div className="nn-dashed-grid absolute inset-0 opacity-60" />
                    <div className="relative">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300 mb-2">
                            {variant.eyebrow}
                        </div>
                        <DialogHeader>
                            <DialogTitle className="font-display text-2xl font-bold text-white tracking-tight">
                                {variant.title}
                            </DialogTitle>
                            <DialogDescription className="text-slate-300 text-sm mt-1">
                                {variant.subtitle}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {done ? (
                    <div className="p-8 flex flex-col items-center text-center" data-testid="enquiry-success">
                        <CheckCircle2 className="w-12 h-12 text-[#047857]" />
                        <h3 className="font-display text-xl font-bold mt-3">Enquiry received</h3>
                        <p className="text-slate-600 text-sm mt-2 max-w-md">
                            Thank you. Our team will contact you within one business day.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="p-6 space-y-4" data-testid="enquiry-form">
                        {/* Common fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                data-testid="enquiry-input-name"
                                required
                                placeholder="Full name *"
                                value={common.name}
                                onChange={setC("name")}
                                className="rounded-none h-11 border-slate-300"
                            />
                            <Input
                                data-testid="enquiry-input-company"
                                placeholder="Company"
                                value={common.company}
                                onChange={setC("company")}
                                className="rounded-none h-11 border-slate-300"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                data-testid="enquiry-input-email"
                                required
                                type="email"
                                placeholder="Email *"
                                value={common.email}
                                onChange={setC("email")}
                                className="rounded-none h-11 border-slate-300"
                            />
                            <Input
                                data-testid="enquiry-input-phone"
                                required
                                placeholder="Phone *"
                                value={common.phone}
                                onChange={setC("phone")}
                                className="rounded-none h-11 border-slate-300"
                            />
                        </div>

                        {/* Variant-specific */}
                        {showService && (
                            <FieldLabel label="Service required">
                                <SelectOrType
                                    data-testid="field-service"
                                    value={service}
                                    onChange={setService}
                                    options={SERVICE_OPTIONS}
                                    placeholder="Select service"
                                    customPlaceholder="Type the service you need"
                                />
                            </FieldLabel>
                        )}

                        {showWaste && (
                            <>
                                <FieldLabel label="Waste category *">
                                    <SelectOrType
                                        data-testid="field-waste-category"
                                        value={details.waste_category}
                                        onChange={setD("waste_category")}
                                        options={WASTE_CATEGORY_OPTIONS}
                                        placeholder="Select waste category"
                                        customPlaceholder="Type your waste type"
                                        required
                                    />
                                </FieldLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FieldLabel label="Estimated tonnage">
                                        <Input
                                            data-testid="field-tonnage"
                                            value={details.estimated_tonnage}
                                            onChange={setD("estimated_tonnage")}
                                            placeholder="e.g. 25 MT / month"
                                            className="rounded-none h-11 border-slate-300"
                                        />
                                    </FieldLabel>
                                    <FieldLabel label="Pickup frequency">
                                        <SelectOrType
                                            data-testid="field-frequency"
                                            value={details.pickup_frequency}
                                            onChange={setD("pickup_frequency")}
                                            options={PICKUP_FREQUENCY_OPTIONS}
                                            placeholder="Frequency"
                                            customPlaceholder="Describe your schedule"
                                        />
                                    </FieldLabel>
                                </div>
                                <FieldLabel label="Pickup site / location">
                                    <Input
                                        data-testid="field-pickup-location"
                                        value={details.pickup_location}
                                        onChange={setD("pickup_location")}
                                        placeholder="Plant / site address"
                                        className="rounded-none h-11 border-slate-300"
                                    />
                                </FieldLabel>
                            </>
                        )}

                        {showLab && (
                            <>
                                <FieldLabel label="Sample category *">
                                    <SelectOrType
                                        data-testid="field-sample-category"
                                        value={details.sample_category}
                                        onChange={setD("sample_category")}
                                        options={SAMPLE_CATEGORY_OPTIONS}
                                        placeholder="Select sample type"
                                        customPlaceholder="Type your sample category"
                                        required
                                    />
                                </FieldLabel>
                                {details.sample_category === "Water Testing" && (
                                    <FieldLabel label="Water matrix">
                                        <SelectOrType
                                            data-testid="field-water-matrix"
                                            value={details.water_matrix}
                                            onChange={setD("water_matrix")}
                                            options={WATER_MATRIX_OPTIONS}
                                            placeholder="Select water matrix"
                                            customPlaceholder="Type the water matrix"
                                        />
                                    </FieldLabel>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FieldLabel label="Number of samples">
                                        <Input
                                            data-testid="field-sample-count"
                                            value={details.sample_count}
                                            onChange={setD("sample_count")}
                                            placeholder="e.g. 4 samples"
                                            className="rounded-none h-11 border-slate-300"
                                        />
                                    </FieldLabel>
                                    <FieldLabel label="Sampling">
                                        <SelectOrType
                                            data-testid="field-sampling"
                                            value={details.sampling}
                                            onChange={setD("sampling")}
                                            options={SAMPLING_OPTIONS}
                                            placeholder="Who collects?"
                                            customPlaceholder="Describe sampling logistics"
                                        />
                                    </FieldLabel>
                                </div>
                                <FieldLabel label="Turnaround preference">
                                    <SelectOrType
                                        data-testid="field-tat"
                                        value={details.turnaround}
                                        onChange={setD("turnaround")}
                                        options={TAT_OPTIONS}
                                        placeholder="Select TAT"
                                        customPlaceholder="Describe your TAT need"
                                    />
                                </FieldLabel>
                            </>
                        )}

                        {showProduct && (
                            <>
                                {details.document_requested && (
                                    <div className="text-sm bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2" data-testid="doc-request-notice">
                                        Requesting <strong>{details.document_requested}</strong> for <strong>{details.product || "the selected product"}</strong>.
                                    </div>
                                )}
                                <FieldLabel label="Product *">
                                    <SelectOrType
                                        data-testid="field-product"
                                        value={details.product}
                                        onChange={setD("product")}
                                        options={PRODUCT_OPTIONS}
                                        placeholder="Select product"
                                        customPlaceholder="Type the product / grade needed"
                                        required
                                    />
                                </FieldLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FieldLabel label="Quantity required">
                                        <Input
                                            data-testid="field-quantity"
                                            value={details.quantity}
                                            onChange={setD("quantity")}
                                            placeholder="e.g. 5 MT / month"
                                            className="rounded-none h-11 border-slate-300"
                                        />
                                    </FieldLabel>
                                    <FieldLabel label="Packaging preference">
                                        <SelectOrType
                                            data-testid="field-packaging"
                                            value={details.packaging}
                                            onChange={setD("packaging")}
                                            options={PACKAGING_OPTIONS}
                                            placeholder="Packaging"
                                            customPlaceholder="Describe packaging"
                                        />
                                    </FieldLabel>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <FieldLabel label="Requirement type">
                                        <SelectOrType
                                            data-testid="field-req-type"
                                            value={details.requirement_type}
                                            onChange={setD("requirement_type")}
                                            options={PRODUCT_REQ_TYPE_OPTIONS}
                                            placeholder="Requirement"
                                            customPlaceholder="Describe requirement"
                                        />
                                    </FieldLabel>
                                    <FieldLabel label="Delivery pincode">
                                        <Input
                                            data-testid="field-pincode"
                                            value={details.delivery_pincode}
                                            onChange={setD("delivery_pincode")}
                                            placeholder="e.g. 826010"
                                            className="rounded-none h-11 border-slate-300"
                                        />
                                    </FieldLabel>
                                </div>
                            </>
                        )}

                        <FieldLabel label={showWaste || showLab || showProduct ? "Additional notes *" : "Message *"}>
                            <Textarea
                                data-testid="enquiry-input-message"
                                required
                                placeholder={
                                    showWaste ? "Any additional context — MSDS, existing manifests, urgency…" :
                                    showLab ? "Any regulatory reference, expected parameters, plant context…" :
                                    showProduct ? "Application, current supplier, technical requirements…" :
                                    "Describe your requirement *"
                                }
                                value={common.message}
                                onChange={setC("message")}
                                rows={4}
                                className="rounded-none border-slate-300"
                            />
                        </FieldLabel>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2" data-testid="enquiry-error">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="enquiry-submit-btn"
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

function FieldLabel({ label, children }) {
    return (
        <label className="block">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1.5">
                {label}
            </div>
            {children}
        </label>
    );
}
