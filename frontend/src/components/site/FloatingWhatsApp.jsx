import { MessageCircle } from "lucide-react";
import { whatsappHref } from "../../lib/company";

export default function FloatingWhatsApp() {
    return (
        <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            data-testid="floating-whatsapp-btn"
            style={{
                bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
                right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
            }}
            className="nn-floating-whatsapp nn-pulse-ring fixed z-[60] mb-16 sm:mb-10 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-emerald-900/25"
        >
            <MessageCircle className="w-6 h-6" strokeWidth={2.2} />
        </a>
    );
}
