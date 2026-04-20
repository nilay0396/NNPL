import { Truck, FlaskConical, Cog, Recycle, ShieldCheck } from "lucide-react";

const steps = [
    { icon: Truck, label: "Pickup", code: "01", desc: "Authorised transport with e-manifest" },
    { icon: FlaskConical, label: "Testing", code: "02", desc: "NABL lab characterisation" },
    { icon: Cog, label: "Treatment", code: "03", desc: "Engineered pre-treatment" },
    { icon: Recycle, label: "Recycling / Disposal", code: "04", desc: "Co-processing or secure TSDF" },
    { icon: ShieldCheck, label: "Compliance", code: "05", desc: "Manifest closure & CPCB reports" },
];

export default function ProcessFlow({ dark = false }) {
    return (
        <div className={`relative ${dark ? "text-white" : "text-slate-900"}`} data-testid="process-flow">
            <div className="grid grid-cols-1 md:grid-cols-5 nn-grid-border">
                {steps.map((s, i) => (
                    <div
                        key={s.label}
                        className={`relative p-6 md:p-7 ${dark ? "bg-transparent" : "bg-white"}`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${dark ? "text-emerald-300" : "text-[#047857]"}`}>
                                Step {s.code}
                            </span>
                            <span className={`w-8 h-8 flex items-center justify-center border ${dark ? "border-white/15 text-white" : "border-slate-200 text-slate-500"}`}>
                                <s.icon className="w-4 h-4" />
                            </span>
                        </div>
                        <h4 className={`font-display text-lg font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                            {s.label}
                        </h4>
                        <p className={`mt-2 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                            {s.desc}
                        </p>
                        {i < steps.length - 1 && (
                            <span
                                aria-hidden
                                className={`hidden md:block absolute top-1/2 -right-2 w-4 h-4 border-r border-t rotate-45 ${
                                    dark ? "border-white/30" : "border-slate-300"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
