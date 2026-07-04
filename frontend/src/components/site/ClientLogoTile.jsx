import { useState } from "react";

/**
 * ClientLogoTile — tries /public/clients/<slug>.(png|svg|jpg).
 * Falls back to a clean branded text tile with the company name.
 */
export default function ClientLogoTile({ slug, name, sector }) {
    // Try png first; on error we'll cycle to a text tile.
    const [failed, setFailed] = useState(false);
    const src = `/clients/${slug}.png`;
    return (
        <div
            data-testid={`client-tile-${slug}`}
            data-shield="on"
            className="relative bg-white h-28 md:h-32 flex flex-col items-center justify-center px-4 group"
        >
            {!failed ? (
                <img
                    src={src}
                    alt={name}
                    className="max-h-14 max-w-[75%] object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition"
                    onError={() => setFailed(true)}
                    draggable={false}
                />
            ) : (
                <div className="text-center">
                    <div className="font-display font-black text-slate-800 text-sm md:text-[15px] tracking-tight leading-tight">
                        {name}
                    </div>
                    {sector && (
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
                            {sector}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
