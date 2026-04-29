// File: components/shared/Footer/Footer.tsx
"use client";

export default function Footer() {
    return (
        <footer className="w-full pt-12 pb-16 md:py-10 bg-transparent border-t border-zinc-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* --- SIMPLIFIED BRANDING --- */}
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <p className="text-[10px] tracking-[0.35em] text-emerald-600 uppercase font-black">
                        ENGINEERING <span className="text-zinc-400">HUB</span>
                    </p>
                    <p className="text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
                        No ego: <span className="text-zinc-400 font-bold">Just skill-to-build</span>
                    </p>
                </div>

                {/* --- COPYRIGHT & MISSION --- */}
                <div className="flex flex-col md:items-end gap-1">
                    <p className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase text-center md:text-right">
                        © {new Date().getFullYear()} <span className="text-zinc-600 font-bold">RonDev</span>
                    </p>
                    <p className="text-[9px] tracking-[0.2em] text-zinc-400 uppercase text-center md:text-right">
                        Built for <span className="text-zinc-900 font-bold">Scalable Education</span>
                    </p>
                </div>

            </div>
        </footer>
    );
}