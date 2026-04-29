"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Utility {
    name: string;
    slug: string;
    description?: string;
    category?: string;
}

interface UtilityCardsProps {
    items: Utility[];
}

export default function UtilityCards({ items }: UtilityCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((util, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <Link
                        href={`/utilities/${util.slug}`}
                        className="group relative block p-8 md:p-10 bg-[#080808] border border-zinc-900 transition-all duration-500 hover:border-emerald-500/50 overflow-hidden h-full shadow-2xl"
                    >
                        {/* Background HUD Accent */}
                        <span className="absolute -right-4 -top-2 text-7xl font-black text-white/[0.01] uppercase select-none group-hover:text-emerald-500/[0.03] transition-all">
                            Mod_{idx + 1}
                        </span>

                        <div className="flex flex-col h-full justify-between space-y-12">
                            <div className="space-y-4">
                                <div className="w-6 h-[1.5px] bg-emerald-500 opacity-40 group-hover:w-12 transition-all duration-500" />

                                <div className="flex flex-col gap-1">
                                    {util.category && (
                                        <span className="text-[8px] text-emerald-500/50 font-mono tracking-[0.3em] uppercase">
                                            {util.category}_System
                                        </span>
                                    )}
                                    {/* Simple title without dots */}
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                                        {util.name}
                                    </h3>
                                </div>

                                <p className="text-zinc-600 text-[10px] uppercase tracking-widest leading-relaxed font-mono">
                                    {util.description || `Initialize optimized ${util.name.toLowerCase()} interface.`}
                                </p>
                            </div>

                            {/* Interaction Bar */}
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-zinc-800 group-hover:text-white transition-all">
                                <span className="group-hover:translate-x-2 transition-transform">Initialize</span>
                                <div className="flex-1 h-[1px] bg-zinc-900 group-hover:bg-emerald-500/30" />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity italic">200_OK</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}