import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center bg-white" data-testid="not-found">
            <div className="nn-container text-center">
                <div className="nn-eyebrow mb-4">Error 404</div>
                <h1 className="font-display text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
                    Page not found.
                </h1>
                <p className="mt-4 text-slate-600 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    data-testid="notfound-home-link"
                    className="inline-flex items-center mt-8 h-11 px-6 bg-[#047857] text-white font-semibold hover:bg-[#065F46]"
                >
                    Back to Home
                </Link>
            </div>
        </section>
    );
}
