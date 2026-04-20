import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    LayoutDashboard,
    Inbox,
    Briefcase,
    Loader2,
    RefreshCw,
    Mail,
    Phone,
    Building2,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { api, formatApiError } from "../../lib/api";

const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "enquiries", label: "Enquiries", icon: Inbox },
    { id: "vendors", label: "Vendors", icon: Briefcase },
];

export default function AdminDashboard() {
    const [tab, setTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [enquiries, setEnquiries] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("nn_admin_user") || "{}");

    const loadAll = async () => {
        setLoading(true);
        setError("");
        try {
            const [s, e, v] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/enquiries"),
                api.get("/vendors"),
            ]);
            setStats(s.data);
            setEnquiries(e.data);
            setVendors(v.data);
        } catch (err) {
            const msg = formatApiError(err);
            setError(msg);
            if (err?.response?.status === 401) {
                localStorage.removeItem("nn_admin_token");
                navigate("/admin/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("nn_admin_token")) {
            navigate("/admin/login");
            return;
        }
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        localStorage.removeItem("nn_admin_token");
        localStorage.removeItem("nn_admin_user");
        navigate("/admin/login");
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/enquiries/${id}`, { status });
            setEnquiries((list) => list.map((x) => (x.id === id ? { ...x, status } : x)));
            // refresh stats
            const s = await api.get("/admin/stats");
            setStats(s.data);
        } catch (err) {
            setError(formatApiError(err));
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50" data-testid="admin-dashboard">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0B192C] text-white flex-shrink-0 hidden md:flex flex-col relative">
                <div className="nn-grain" />
                <div className="relative p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#047857] flex items-center justify-center">
                            <span className="font-display font-black">NN</span>
                        </div>
                        <div>
                            <div className="font-display font-bold leading-tight">Admin</div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">Console</div>
                        </div>
                    </div>
                </div>
                <nav className="relative flex-1 p-3">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            data-testid={`admin-nav-${t.id}`}
                            onClick={() => setTab(t.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition ${
                                tab === t.id ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"
                            }`}
                        >
                            <t.icon className="w-4 h-4" />
                            {t.label}
                        </button>
                    ))}
                </nav>
                <div className="relative p-4 border-t border-white/10 text-xs">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Signed in as</div>
                    <div className="truncate text-white mt-1">{user?.email || "admin"}</div>
                    <button
                        data-testid="admin-logout-btn"
                        onClick={logout}
                        className="mt-4 w-full flex items-center justify-center gap-2 h-9 border border-white/20 hover:bg-white/5"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-200">
                    <div className="flex items-center justify-between px-6 md:px-8 h-16">
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Operations</div>
                            <h1 className="font-display font-black text-slate-900 text-lg tracking-tight">
                                {tabs.find((t) => t.id === tab)?.label}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={loadAll}
                                data-testid="admin-refresh-btn"
                                className="h-10 px-4 inline-flex items-center gap-2 border border-slate-300 text-sm hover:bg-slate-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                            </button>
                            <button
                                data-testid="admin-logout-top"
                                onClick={logout}
                                className="h-10 px-4 md:hidden inline-flex items-center gap-2 border border-slate-300 text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile tabs */}
                    <div className="md:hidden border-t border-slate-200 flex overflow-x-auto">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap ${
                                    tab === t.id ? "text-[#047857] border-b-2 border-[#047857]" : "text-slate-600"
                                }`}
                            >
                                <t.icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-x-auto">
                    {error && (
                        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</div>
                    )}
                    {loading && !stats ? (
                        <div className="py-24 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <>
                            {tab === "overview" && <Overview stats={stats} enquiries={enquiries} />}
                            {tab === "enquiries" && <Enquiries items={enquiries} onUpdate={updateStatus} />}
                            {tab === "vendors" && <Vendors items={vendors} />}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

function Overview({ stats, enquiries }) {
    if (!stats) return null;
    const recent = enquiries.slice(0, 5);
    return (
        <div data-testid="admin-overview">
            <div className="nn-grid-border grid grid-cols-2 lg:grid-cols-4 bg-white mb-8">
                {[
                    { k: "Total Enquiries", v: stats.total_enquiries },
                    { k: "New Enquiries", v: stats.new_enquiries, accent: true },
                    { k: "Vendor Applications", v: stats.total_vendors },
                    { k: "Enquiry Types", v: (stats.by_type || []).length },
                ].map((s) => (
                    <div key={s.k} className="p-6">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{s.k}</div>
                        <div className={`mt-6 font-display text-4xl font-black tracking-tight ${s.accent ? "text-[#047857]" : "text-slate-900"}`}>
                            {s.v}
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 border border-slate-200 bg-white">
                    <div className="p-5 border-b border-slate-200">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Recent enquiries</div>
                        <div className="font-display font-bold text-slate-900 mt-1">Latest 5</div>
                    </div>
                    <div>
                        {recent.length === 0 ? (
                            <div className="p-8 text-slate-500 text-sm">No enquiries yet.</div>
                        ) : (
                            recent.map((e) => (
                                <div key={e.id} className="p-5 border-b border-slate-100 last:border-b-0 flex items-start gap-4">
                                    <div className="w-9 h-9 bg-slate-100 flex items-center justify-center font-display font-bold text-slate-700 text-sm flex-shrink-0">
                                        {e.name?.[0]?.toUpperCase() || "N"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-slate-900 truncate">{e.name}</span>
                                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#047857] border border-[#047857] px-1.5 py-0.5">
                                                {e.enquiry_type}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 truncate">{e.email} · {e.phone}</div>
                                        <div className="text-sm text-slate-700 mt-2 line-clamp-2">{e.message}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="lg:col-span-5 border border-slate-200 bg-white">
                    <div className="p-5 border-b border-slate-200">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Enquiries by type</div>
                        <div className="font-display font-bold text-slate-900 mt-1">Distribution</div>
                    </div>
                    <div className="p-5 space-y-3">
                        {(stats.by_type || []).length === 0 ? (
                            <div className="text-slate-500 text-sm">No data yet.</div>
                        ) : (
                            stats.by_type.map((t) => {
                                const max = Math.max(...stats.by_type.map((x) => x.count));
                                const pct = (t.count / max) * 100;
                                return (
                                    <div key={t.type}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600">{t.type}</span>
                                            <span className="font-display font-bold text-slate-900">{t.count}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-[#047857]" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusPill({ status }) {
    const map = {
        new: "bg-emerald-50 text-emerald-700 border-emerald-200",
        in_progress: "bg-amber-50 text-amber-700 border-amber-200",
        closed: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
        <span className={`font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 border ${map[status] || map.new}`}>
            {status}
        </span>
    );
}

function Enquiries({ items, onUpdate }) {
    if (items.length === 0) {
        return <div className="border border-slate-200 bg-white p-10 text-center text-slate-500">No enquiries yet.</div>;
    }
    return (
        <div className="border border-slate-200 bg-white" data-testid="admin-enquiries-list">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            <th className="px-4 py-3">Submitted</th>
                            <th className="px-4 py-3">Name / Company</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Message</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((e) => (
                            <tr key={e.id} className="border-b border-slate-100" data-testid={`enquiry-row-${e.id}`}>
                                <td className="px-4 py-3 align-top whitespace-nowrap text-xs text-slate-500 font-mono">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {new Date(e.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <div className="font-semibold text-slate-900">{e.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Building2 className="w-3 h-3" /> {e.company || "—"}
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#047857] border border-[#047857] px-1.5 py-0.5">
                                        {e.enquiry_type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 align-top text-xs text-slate-600">
                                    <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {e.email}</div>
                                    <div className="flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {e.phone}</div>
                                </td>
                                <td className="px-4 py-3 align-top max-w-xs">
                                    <div className="line-clamp-3 text-slate-700">{e.message}</div>
                                    {e.service_required && (
                                        <div className="mt-1 text-xs text-slate-500 font-mono uppercase tracking-wide">
                                            {e.service_required}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 align-top"><StatusPill status={e.status} /></td>
                                <td className="px-4 py-3 align-top">
                                    <select
                                        data-testid={`enquiry-status-${e.id}`}
                                        value={e.status}
                                        onChange={(ev) => onUpdate(e.id, ev.target.value)}
                                        className="text-xs h-8 px-2 border border-slate-300 bg-white"
                                    >
                                        <option value="new">new</option>
                                        <option value="in_progress">in_progress</option>
                                        <option value="closed">closed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Vendors({ items }) {
    if (items.length === 0) {
        return <div className="border border-slate-200 bg-white p-10 text-center text-slate-500">No vendor applications yet.</div>;
    }
    return (
        <div className="nn-grid-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white" data-testid="admin-vendors-list">
            {items.map((v) => (
                <div key={v.id} className="p-6 bg-white" data-testid={`vendor-card-${v.id}`}>
                    <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#047857]">{v.category}</span>
                        <CheckCircle2 className="w-4 h-4 text-slate-300" />
                    </div>
                    <h4 className="font-display text-lg font-black text-slate-900">{v.company_name}</h4>
                    <div className="text-sm text-slate-600 mt-1">{v.contact_person}</div>
                    <div className="mt-4 space-y-1 text-xs text-slate-600 font-mono">
                        <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {v.email}</div>
                        <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {v.phone}</div>
                        {v.gst_number && <div>GST · {v.gst_number}</div>}
                    </div>
                    {v.description && (
                        <p className="mt-4 text-sm text-slate-700 line-clamp-3">{v.description}</p>
                    )}
                    <div className="mt-5 text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                        {new Date(v.created_at).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
