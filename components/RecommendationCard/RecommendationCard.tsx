"use client";

import { Box, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface SpecEntry {
    label: string;
    value: string;
}

interface Recommendation {
    id: string;
    name: string;
    brand: string;
    description: string;
    image?: string; // Optional image support
    specs: SpecEntry[];
}

interface RecommendationProps {
    items?: Recommendation[];
    category?: string;
}

export default function RecommendationCard({ items, category }: RecommendationProps) {
    const isGearRelated = category === "GEAR" || category === "LISTING";

    if (!items || items.length === 0 || !isGearRelated) return null;

    return (
        <div className="mt-12 space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Box size={16} className="text-emerald-500" />
                <h4 className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500">
                    Recommended_Hardware_Provisioning
                </h4>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group bg-[#080808] border border-zinc-900 p-6 hover:border-emerald-500/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-zinc-800 group-hover:border-emerald-500/20 transition-colors" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <span className="font-mono text-[8px] text-emerald-500/60 uppercase tracking-widest">
                                    {item.brand} // REF_{item.id.toUpperCase()}
                                </span>
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">
                                    {item.name}
                                </h3>
                                <p className="text-zinc-500 text-xs leading-relaxed max-w-md italic">
                                    {item.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2 border-l border-zinc-900 pl-6">
                                {item.specs?.map((spec, sIdx) => (
                                    <div
                                        key={sIdx}
                                        className="flex items-center gap-3 text-zinc-400 font-mono text-[9px] uppercase tracking-wider"
                                    >
                                        <div className="w-1 h-1 bg-emerald-500/40 rounded-full" />
                                        <span className="text-zinc-500">{spec.label}:</span>
                                        <span className="text-zinc-300">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors">
                                <ShoppingCart size={14} />
                                Acquire
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}