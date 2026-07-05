import { CLIENTS } from "../../lib/clients";

// Only the clients whose logo files exist under /public/clients/.
// Maithon Power has no logo in the brochure, so we exclude it from the marquee.
const LOGO_SLUGS = new Set([
    "iocl",
    "tata-mpl-jv",
    "bccl",
    "dvc",
    "indane",
    "indian-railways",
    "technip-energies",
    "acc-cement",
    "gail",
    "coal-india",
    "oil-india",
    "hurl",
    "titan",
    "alkem",
    "glenmark",
    "microlabs",
    "zydus",
]);

const LOGOS = CLIENTS.filter((c) => LOGO_SLUGS.has(c.slug));

/**
 * ClientMarquee — subtle auto-scrolling logo strip.
 * Dark hero-aligned band with grayscale + hover-to-pause.
 */
export default function ClientMarquee() {
    // Duplicate the array so the track can loop seamlessly.
    const track = [...LOGOS, ...LOGOS];
    return (
        <div
            data-testid="client-marquee"
            className="nn-marquee relative border-t border-white/10 bg-[#0B192C] py-6 overflow-hidden"
        >
            {/* Left/right fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#0B192C] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#0B192C] to-transparent z-10" />

            <div className="nn-container mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-emerald-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300">
                    Trusted by 150+ industrial clients · mining · cement · steel · pharma · refineries · power · PSUs
                </span>
            </div>

            <div className="nn-marquee-track flex gap-14 md:gap-20 items-center whitespace-nowrap">
                {track.map((c, i) => (
                    <div
                        key={`${c.slug}-${i}`}
                        title={c.name}
                        className="shrink-0 h-12 md:h-14 flex items-center"
                        data-testid={`marquee-logo-${c.slug}`}
                    >
                        <img
                            src={`/clients/${c.slug}.png`}
                            alt={c.name}
                            draggable={false}
                            className="max-h-12 md:max-h-14 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300 select-none brightness-125 contrast-125"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
