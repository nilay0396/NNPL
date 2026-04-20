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
            className="nn-floating-whatsapp nn-pulse-ring relative fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
            <MessageCircle className="w-6 h-6" strokeWidth={2.2} />
        </a>
    );
}
