import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Download, Globe } from "lucide-react";
import { COMPANY, whatsappHref } from "../../lib/company";
import { downloadBrochure } from "../../lib/download";

export default function Footer() {
    return (
        <footer className="relative bg-[#0B192C] text-slate-200 overflow-hidden" data-testid="site-footer">
            <div className="absolute inset-0 nn-dashed-grid opacity-60" />
            <div className="nn-grain" />
            <div className="relative nn-container py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-14 h-14 bg-white p-1 flex items-center justify-center">
                                <img src={COMPANY.logo} alt={COMPANY.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <div className="font-display font-bold text-white text-lg tracking-tight">
                                    NilayNarayan Polychem LLP
                                </div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
                                    Integrated Environmental Solutions
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                            Authorised hazardous waste management, speciality chemicals manufacturing and
                            NABL accredited environmental testing — under one integrated operations roof.
                        </p>
                        <button
                            type="button"
                            onClick={downloadBrochure}
                            data-testid="footer-brochure-btn"
                            className="inline-flex items-center gap-2 mt-6 h-10 px-5 bg-white/5 border border-white/15 text-white text-sm font-semibold hover:bg-[#047857] hover:border-[#047857] transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download Corporate Brochure
                        </button>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300 mb-4">
                            Company
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-300">
                            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                            <li><Link to="/certifications" className="hover:text-white">Certifications</Link></li>
                            <li><Link to="/vendor-onboarding" className="hover:text-white">Vendors</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300 mb-4">
                            Services
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-300">
                            <li><Link to="/services/hazardous-waste" className="hover:text-white">Hazardous Waste Management</Link></li>
                            <li><Link to="/services/nabl-lab" className="hover:text-white">NABL Lab Services</Link></li>
                            <li><Link to="/products" className="hover:text-white">Speciality Chemicals</Link></li>
                            <li><Link to="/industries" className="hover:text-white">Industries Served</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300 mb-4">
                            Contact
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                                <span>
                                    {COMPANY.address.line1}<br />
                                    {COMPANY.address.line2}
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-emerald-400" />
                                <a href={`tel:${COMPANY.phoneRaw}`} className="hover:text-white font-mono">{COMPANY.phone}</a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-emerald-400" />
                                <a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Globe className="w-4 h-4 text-emerald-400" />
                                <a
                                    href={COMPANY.websiteUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    data-testid="footer-website-link"
                                    className="hover:text-white font-mono"
                                >
                                    {COMPANY.website}
                                </a>
                            </li>
                        </ul>
                        <a
                            href={whatsappHref()}
                            target="_blank"
                            rel="noreferrer"
                            data-testid="footer-whatsapp-btn"
                            className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#25D366] hover:text-white"
                        >
                            Chat on WhatsApp →
                        </a>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500">
                    <div className="font-mono">
                        © {new Date().getFullYear()} NilayNarayan Polychem LLP. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 font-mono flex-wrap">
                        <span>PAN: {COMPANY.pan}</span>
                        <span className="w-px h-3 bg-white/20" />
                        <span>GST: {COMPANY.gst}</span>
                        <span className="w-px h-3 bg-white/20" />
                        <Link to="/admin/login" className="hover:text-slate-300" data-testid="footer-admin-link">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
