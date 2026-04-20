export default function PageHero({ eyebrow, title, subtitle, breadcrumb }) {
    return (
        <section className="relative bg-[#0B192C] text-white overflow-hidden" data-testid="page-hero">
            <div className="absolute inset-0 nn-dashed-grid opacity-60" />
            <div className="nn-grain" />
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#047857]/15 blur-3xl" aria-hidden />
            <div className="relative nn-container pt-16 md:pt-24 pb-14 md:pb-20">
                {breadcrumb && (
                    <div className="nn-eyebrow-light mb-5">{breadcrumb}</div>
                )}
                {eyebrow && !breadcrumb && <div className="nn-eyebrow-light mb-5">{eyebrow}</div>}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.02] text-white max-w-4xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-6 text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
