import { useEffect, useState } from "react";
import { Package, ArrowRight, Search, Loader2, FileText } from "lucide-react";
import PageHero from "../components/site/PageHero";
import CtaBanner from "../components/site/CtaBanner";
import QuoteDialog from "../components/site/QuoteDialog";
import { api } from "../lib/api";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [activeCat, setActiveCat] = useState("All");
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [quoteContext, setQuoteContext] = useState(null);

    const openQuote = (ctx = null) => {
        setQuoteContext(ctx);
        setQuoteOpen(true);
    };

    useEffect(() => {
        api.get("/products")
            .then((r) => setProducts(r.data || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
    const filtered = products.filter(
        (p) =>
            (activeCat === "All" || p.category === activeCat) &&
            (q === "" ||
                p.name.toLowerCase().includes(q.toLowerCase()) ||
                p.application.toLowerCase().includes(q.toLowerCase()))
    );

    return (
        <>
            <PageHero
                breadcrumb="Products / Speciality Chemicals"
                title="Speciality chemicals engineered for industrial workflows."
                subtitle="From water treatment chemistries to fly-ash binders and catalyst reclaimers — built in-house, batch-tested in our NABL lab."
            />

            {/* Filters */}
            <section className="bg-white border-b border-slate-200" data-testid="product-filters">
                <div className="nn-container py-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            data-testid="product-search-input"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search products, applications…"
                            className="w-full h-11 pl-10 pr-3 border border-slate-300 focus:outline-none focus:border-[#047857] text-sm"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                data-testid={`product-cat-${c.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={() => setActiveCat(c)}
                                className={`h-9 px-4 text-xs font-mono uppercase tracking-[0.15em] border transition ${
                                    activeCat === c
                                        ? "bg-[#0B192C] text-white border-[#0B192C]"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-[#047857] hover:text-[#047857]"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="nn-section bg-white" data-testid="product-grid">
                <div className="nn-container">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center text-slate-500">No products match your filter.</div>
                    ) : (
                        <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((p, i) => (
                                <div key={p.id} className="bg-white flex flex-col overflow-hidden" data-testid={`product-card-${i}`}>
                                    {p.image && (
                                        <div className="relative w-full aspect-[4/3] bg-slate-50 border-b border-slate-200 overflow-hidden">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                loading="lazy"
                                                draggable={false}
                                                className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                                            />
                                            <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] bg-white/90 backdrop-blur px-2 py-1 text-[#047857] border border-emerald-200">
                                                Batch tested
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-7 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">
                                                {p.category}
                                            </span>
                                            <Package className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <h3 className="font-display text-xl font-black text-slate-900 tracking-tight">
                                            {p.name}
                                        </h3>
                                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                                        <div className="mt-5 space-y-2 text-xs">
                                            <div>
                                                <span className="font-mono uppercase tracking-[0.15em] text-slate-500">Application · </span>
                                                <span className="text-slate-800">{p.application}</span>
                                            </div>
                                            <div>
                                                <span className="font-mono uppercase tracking-[0.15em] text-slate-500">Industry · </span>
                                                <span className="text-slate-800">{p.industry}</span>
                                            </div>
                                            {p.approvals && (
                                                <div>
                                                    <span className="font-mono uppercase tracking-[0.15em] text-slate-500">Approvals · </span>
                                                    <span className="text-[#047857] font-semibold">{p.approvals}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-6 pt-5 border-t border-slate-200 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openQuote({ product: p.name, docRequested: "TDS", docUrl: p.tds_url || undefined })}
                                                data-testid={`product-tds-btn-${i}`}
                                                className="flex-1 inline-flex items-center justify-center gap-2 h-10 border border-slate-300 text-xs font-mono uppercase tracking-[0.15em] text-slate-700 hover:border-[#047857] hover:text-[#047857]"
                                            >
                                                <FileText className="w-3.5 h-3.5" /> Request TDS
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openQuote({ product: p.name, docRequested: "SDS", docUrl: p.sds_url || undefined })}
                                                data-testid={`product-sds-btn-${i}`}
                                                className="flex-1 inline-flex items-center justify-center gap-2 h-10 border border-slate-300 text-xs font-mono uppercase tracking-[0.15em] text-slate-700 hover:border-[#047857] hover:text-[#047857]"
                                            >
                                                <FileText className="w-3.5 h-3.5" /> Request SDS
                                            </button>
                                        </div>
                                        <button
                                            data-testid={`product-enquire-btn-${i}`}
                                            onClick={() => openQuote({ product: p.name })}
                                            className="mt-3 inline-flex items-center justify-center gap-2 h-10 bg-[#047857] text-white text-sm font-semibold hover:bg-[#065F46]"
                                        >
                                            Enquire <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <CtaBanner
                eyebrow="Bulk enquiry"
                title="Need a product sample or bulk quote?"
                primaryLabel="Submit Product Enquiry"
                defaultType="product"
            />
            <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} defaultType="product" context={quoteContext} />
        </>
    );
}
