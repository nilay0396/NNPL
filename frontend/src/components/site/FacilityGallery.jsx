import { useState, useEffect, useRef } from "react";

const SLIDES = [
    {
        src: "/facility/main-plant.jpg",
        title: "Main Plant",
        caption: "Integrated production, storage & handling",
    },
    {
        src: "/facility/nabl-lab.jpg",
        title: "Quality Control / NABL Laboratory",
        caption: "ISO/IEC 17025 analytical testing suite",
    },
    {
        src: "/facility/water-treatment.jpg",
        title: "Water Treatment Plant",
        caption: "Effluent neutralisation & polishing",
    },
    {
        src: "/facility/incinerator.jpg",
        title: "High-Temperature Incinerator",
        caption: "Thermal destruction of hazardous waste",
    },
    {
        src: "/facility/plastic-processing.jpg",
        title: "Plastic Waste Processing Plant",
        caption: "Shredding, extrusion & recycled granule line",
    },
    {
        src: "/facility/ball-mill.jpg",
        title: "Ball Mill / Crusher Unit",
        caption: "Size-reduction for downstream recovery streams",
    },
    {
        src: "/facility/ewaste-processing.jpg",
        title: "E-Waste Processing Plant",
        caption: "Segregation, dismantling & metal recovery",
    },
    {
        src: "/facility/effluent-treatment.jpg",
        title: "Effluent Treatment Plant (ETP)",
        caption: "Washing area, ETP & closed-loop water reuse",
    },
];

const ROTATE_MS = 5000;

/**
 * FacilityGallery — auto-rotating hero + click-to-jump thumbnails.
 * Designed to sit inside the "Infrastructure" section on /about.
 */
export default function FacilityGallery() {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef(null);
    const total = SLIDES.length;

    useEffect(() => {
        if (paused) return undefined;
        timer.current = setInterval(() => setIdx((i) => (i + 1) % total), ROTATE_MS);
        return () => clearInterval(timer.current);
    }, [paused, total]);

    const current = SLIDES[idx];

    return (
        <div
            className="relative"
            data-testid="facility-gallery"
            data-shield="on"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Main slide */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900">
                {SLIDES.map((s, i) => (
                    <img
                        key={s.src}
                        src={s.src}
                        alt={s.title}
                        loading={i === 0 ? "eager" : "lazy"}
                        draggable={false}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-in-out ${
                            i === idx ? "opacity-100" : "opacity-0"
                        }`}
                        data-testid={`facility-slide-${i}`}
                    />
                ))}

                {/* bottom-gradient scrim + caption */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B192C]/95 via-[#0B192C]/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6" data-testid="facility-caption">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300 mb-1.5">
                        Facility · {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </div>
                    <div className="font-display text-white text-xl md:text-2xl font-black tracking-tight leading-tight">
                        {current.title}
                    </div>
                    <div className="text-xs md:text-sm text-slate-300 mt-1">{current.caption}</div>
                </div>

                {/* progress bar */}
                <div className="absolute top-0 left-0 h-1 w-full bg-white/10">
                    <div
                        key={idx + (paused ? "-p" : "")}
                        className={`h-full bg-emerald-400 ${paused ? "" : "nn-facility-progress"}`}
                        style={{ animationDuration: `${ROTATE_MS}ms` }}
                    />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-2 md:gap-2.5">
                {SLIDES.map((s, i) => (
                    <button
                        key={s.src}
                        type="button"
                        onClick={() => setIdx(i)}
                        aria-label={s.title}
                        title={s.title}
                        data-testid={`facility-thumb-${i}`}
                        className={`relative aspect-[16/10] overflow-hidden bg-slate-100 transition ${
                            i === idx
                                ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-50"
                                : "opacity-70 hover:opacity-100"
                        }`}
                    >
                        <img
                            src={s.src}
                            alt=""
                            loading="lazy"
                            draggable={false}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
