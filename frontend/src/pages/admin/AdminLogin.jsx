import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { api, formatApiError } from "../../lib/api";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("nn_admin_token")) {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("nn_admin_token", data.access_token);
            localStorage.setItem("nn_admin_user", JSON.stringify(data.user));
            navigate("/admin/dashboard");
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white" data-testid="admin-login-page">
            {/* Left brand panel */}
            <div className="relative hidden lg:flex bg-[#0B192C] text-white overflow-hidden flex-col p-12">
                <div className="absolute inset-0 nn-dashed-grid opacity-50" />
                <div className="nn-grain" />
                <div className="relative flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#047857] flex items-center justify-center">
                        <span className="font-display font-black text-white text-lg">NN</span>
                    </div>
                    <div className="font-display font-bold text-lg tracking-tight">NilayNarayan Polychem LLP</div>
                </div>
                <div className="relative mt-auto">
                    <div className="nn-eyebrow-light mb-4">Internal Console</div>
                    <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tight leading-[1.05]">
                        Secure operations dashboard for the NN Polychem team.
                    </h1>
                    <p className="mt-6 text-slate-300 max-w-md">
                        Review incoming enquiries, vendor applications and dispatch priorities
                        — from one unified, audit-logged console.
                    </p>
                </div>
            </div>

            {/* Right form */}
            <div className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-3 mb-10 lg:hidden">
                        <div className="w-10 h-10 bg-[#0B192C] text-white flex items-center justify-center">
                            <span className="font-display font-black text-sm">NN</span>
                        </div>
                        <div className="font-display font-bold">NN Polychem Admin</div>
                    </div>
                    <div className="nn-eyebrow mb-3">Admin Login</div>
                    <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
                        Sign in to your console.
                    </h2>
                    <p className="mt-3 text-slate-600">
                        Use your administrator credentials. Contact operations if access is needed.
                    </p>
                    <form onSubmit={submit} className="mt-10 space-y-4" data-testid="admin-login-form">
                        <div>
                            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Email</label>
                            <input
                                data-testid="admin-login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full h-11 px-3 border border-slate-300 focus:outline-none focus:border-[#047857]"
                                placeholder="admin@nilaynarayan.com"
                            />
                        </div>
                        <div>
                            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Password</label>
                            <input
                                data-testid="admin-login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full h-11 px-3 border border-slate-300 focus:outline-none focus:border-[#047857]"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2" data-testid="admin-login-error">{error}</div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="admin-login-submit"
                            className="w-full h-12 bg-[#047857] text-white font-semibold hover:bg-[#065F46] disabled:opacity-60 inline-flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
