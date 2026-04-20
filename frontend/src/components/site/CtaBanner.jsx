import { useState } from "react";
import QuoteDialog from "./QuoteDialog";
import { ArrowRight, Phone } from "lucide-react";
import { COMPANY } from "../../lib/company";

export default function CtaBanner({
    eyebrow = "Ready to engage",
    title = "Need waste disposal or testing support?",
    subtitle = "Speak to our compliance team for a site assessment, quote, or tender support.",
    primaryLabel = "Request a Quote",
    defaultType = "quote",
}) {
    const [open, setOpen] = useState(false);
    return (
        <section className="relative bg-[#0B192C] text-white overflow-hidden" data-testid="cta-banner">
            <div className="nn-grain" />
            <div className="absolute inset-0 nn-dashed-grid opacity-60" />
            <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#047857]/20 blur-3xl" aria-hidden />
            <div className="relative nn-container py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                <div className="lg:col-span-7">
                    <div className="nn-eyebrow-light mb-3">{eyebrow}</div>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight text-white max-w-2xl">
                        {title}
                    </h2>
                    <p className="mt-5 text-slate-300 text-base md:text-lg max-w-xl">{subtitle}</p>
                </div>
                <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 justify-start lg:justify-end">
                    <button
                        data-testid="cta-banner-primary-btn"
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#047857] text-white font-semibold hover:bg-[#059669] transition-colors"
                    >
                        {primaryLabel}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                        href={`tel:${COMPANY.phoneRaw}`}
                        data-testid="cta-banner-call-btn"
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        Call {COMPANY.phone}
                    </a>
                </div>
            </div>
            <QuoteDialog open={open} onOpenChange={setOpen} defaultType={defaultType} />
        </section>
    );
}
