"use client";

export default function Footer() {
    // Increased opacity from 30% to 60% for better visibility
    const statusColor = "text-emerald-500/60";

    return (
        <footer className="w-full pt-10 pb-16 md:py-10 bg-black text-white border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Status: Changed zinc-700 (too dark) to zinc-500 */}
                <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-bold text-center md:text-left">
                    No ego: <span className={statusColor}>Just skill-to-build</span>
                </p>

                {/* Copyright: Increased brightness and slightly larger text for mobile readability */}
                <p className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase text-center md:text-right">
                    © {new Date().getFullYear()} <span className="text-zinc-400">Lizard Interactive Online</span>
                </p>

            </div>
        </footer>
    );
}