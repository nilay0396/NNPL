import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";
import { useLocation } from "react-router-dom";

export default function SiteLayout({ children }) {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]);
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
