import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import QuoteDialog from "./QuoteDialog";
import { COMPANY } from "../../lib/company";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    {
        label: "Services",
        children: [
            { to: "/services", label: "All Services" },
            { to: "/services/hazardous-waste", label: "Hazardous Waste Mgmt." },
            { to: "/services/nabl-lab", label: "NABL Lab Services" },
        ],
    },
    { to: "/products", label: "Products" },
    { to: "/industries", label: "Industries" },
    { to: "/certifications", label: "Certifications" },
    { to: "/projects", label: "Projects" },
    { to: "/vendor-onboarding", label: "Vendors" },
    { to: "/contact", label: "Contact" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setOpenDropdown(false);
    }, [pathname]);

    return (
        <>
            <header
                data-testid="site-header"
                className={`fixed top-0 left-0 right-0 z-50 transition-all ${
                    scrolled
                        ? "bg-white/95 backdrop-blur-xl border-b border-slate-200"
                        : "bg-white/80 backdrop-blur-md border-b border-transparent"
                }`}
            >
                <div className="nn-container flex items-center justify-between h-16 md:h-20">
                    <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-[#0B192C] text-white">
                            <span className="font-display font-black text-lg tracking-tighter">NN</span>
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#047857]" />
                        </div>
                        <div className="hidden sm:flex flex-col leading-none">
                            <span className="font-display font-bold text-[15px] text-slate-900 tracking-tight">
                                NilayNarayan Polychem
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mt-0.5">
                                Polychem LLP · Est. Industrial
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) =>
                            item.children ? (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenDropdown(true)}
                                    onMouseLeave={() => setOpenDropdown(false)}
                                >
                                    <button
                                        data-testid={`nav-${item.label.toLowerCase()}-trigger`}
                                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#047857] transition-colors"
                                    >
                                        {item.label}
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    {openDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 shadow-lg py-2">
                                            {item.children.map((c) => (
                                                <NavLink
                                                    key={c.to}
                                                    to={c.to}
                                                    data-testid={`nav-dropdown-${c.label.replace(/\s+/g, "-").toLowerCase()}`}
                                                    className={({ isActive }) =>
                                                        `block px-4 py-2.5 text-sm transition-colors ${
                                                            isActive
                                                                ? "text-[#047857] bg-emerald-50 font-semibold"
                                                                : "text-slate-700 hover:bg-slate-50 hover:text-[#047857]"
                                                        }`
                                                    }
                                                >
                                                    {c.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    data-testid={`nav-${item.label.toLowerCase()}`}
                                    className={({ isActive }) =>
                                        `px-3 py-2 text-sm font-medium transition-colors ${
                                            isActive ? "text-[#047857]" : "text-slate-700 hover:text-[#047857]"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            )
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <a
                            href={`tel:${COMPANY.phoneRaw}`}
                            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#047857] transition-colors"
                            data-testid="header-call-btn"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="font-mono text-xs">{COMPANY.phone}</span>
                        </a>
                        <button
                            data-testid="header-get-quote-btn"
                            onClick={() => setQuoteOpen(true)}
                            className="hidden sm:inline-flex items-center h-10 px-5 bg-[#047857] text-white text-sm font-semibold hover:bg-[#065F46] transition-colors"
                        >
                            Get Quote
                        </button>
                        <button
                            data-testid="mobile-menu-toggle"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="lg:hidden border-t border-slate-200 bg-white" data-testid="mobile-menu">
                        <nav className="nn-container py-4 flex flex-col">
                            {navItems.map((item) =>
                                item.children ? (
                                    <div key={item.label} className="py-2 border-b border-slate-100">
                                        <div className="font-display font-bold text-slate-900 mb-2">{item.label}</div>
                                        {item.children.map((c) => (
                                            <Link
                                                key={c.to}
                                                to={c.to}
                                                data-testid={`mobile-nav-${c.label.replace(/\s+/g, "-").toLowerCase()}`}
                                                className="block py-2 text-sm text-slate-600 hover:text-[#047857]"
                                            >
                                                {c.label}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                                        className="py-3 text-sm font-medium text-slate-800 border-b border-slate-100"
                                    >
                                        {item.label}
                                    </Link>
                                )
                            )}
                            <button
                                data-testid="mobile-get-quote-btn"
                                onClick={() => {
                                    setQuoteOpen(true);
                                    setMobileOpen(false);
                                }}
                                className="mt-4 h-11 bg-[#047857] text-white font-semibold"
                            >
                                Get Quote
                            </button>
                        </nav>
                    </div>
                )}
            </header>
            <div aria-hidden className="h-16 md:h-20" />
            <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
        </>
    );
}
