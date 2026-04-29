"use client";

interface Niche {
    tag: string;
    title: string;
    desc: string;
    label: string;
}

interface ServicesCardsProps {
    niches: Niche[];
}

export default function ServicesCards({ niches }: ServicesCardsProps) {
    return (
        <div className="flex flex-col gap-6 md:gap-8 relative z-20 max-w-3xl mx-auto lg:max-w-4xl w-full">
            {niches.map((niche, i) => (
                <div key={i} className="group relative block w-full cursor-pointer">

                    {/* Card Body */}
                    <div className="relative z-10 w-full p-6 md:p-10 bg-[#080808] border border-zinc-900 md:hover:border-emerald-500/40 transition-all duration-500 md:hover:translate-x-2 active:scale-[0.99] overflow-hidden">

                        {/* Massive Background Ghost Tag */}
                        <span className="absolute -right-4 -top-2 text-7xl md:text-8xl font-black text-white/[0.02] group-hover:text-emerald-500/[0.04] transition-all duration-700 uppercase pointer-events-none italic">
                            {niche.tag}
                        </span>

                        {/* Title */}
                        <h3 className="text-2xl md:text-4xl font-black text-white mb-3 uppercase group-hover:text-emerald-400 transition-colors duration-300 tracking-tighter">
                            {niche.title}
                        </h3>

                        {/* Description */}
                        <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-light">
                            {niche.desc}
                        </p>

                        {/* Bottom Interaction Bar */}
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 group-hover:text-emerald-500/80 transition-all duration-300">
                            <span className="group-hover:translate-x-3 transition-transform duration-500 ease-out">
                                {niche.label}
                            </span>
                            <div className="h-[1px] flex-1 bg-zinc-900 group-hover:bg-emerald-500/20 transition-all duration-500" />
                            <div className="w-2 h-2 rounded-full border border-zinc-800 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-500" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}