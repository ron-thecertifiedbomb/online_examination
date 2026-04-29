"use client";


import { Cpu, Zap, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { GearItem } from "../../../interfaces";

// We extend GearItem to include the local specs object
interface GearCardProps {
    item: GearItem & {
        // We make these optional so different gear types (Laptops vs. Cables) don't crash
        specs?: {
            cpu?: string;
            gpu?: string;
            ram?: string;
            display?: string;
            bestFor?: string; // Added to match your object
        };
    };
}
export default function GearCard({ item }: GearCardProps) {
    return (
        <div className="group relative bg-[#050505] border border-zinc-900 overflow-hidden hover:border-emerald-500/50 transition-all duration-500">

            {/* 1. AUTHENTICITY BADGE */}
            {item.isFavorite && (
                <div className="absolute top-0 right-0 z-20 bg-emerald-500 text-black px-3 py-1 flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">LIZARD_RECOMMENDED</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row h-full">
                {/* 2. IMAGE ENGINE */}
                <div className="relative w-full md:w-80 h-64 md:h-auto bg-zinc-950">
                    <Image
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        // Removed 'grayscale' and 'opacity-40' from the base classes
                        // Added a subtle hover scale effect to keep the technical "active" feel
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 opacity-100"
                        sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* 3. SYSTEM SPECS */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                        <span className="text-emerald-500 font-mono text-[9px] tracking-[0.4em] uppercase mb-2 block">
                            {item.brand} // {item.category}
                        </span>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                            {item.name}
                        </h3>
                        <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-[0.15em] mb-8 font-medium">
                            {item.description}
                        </p>

                        {/* TECHNICAL SPECS GRID */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10 border-l border-zinc-900 pl-6">
                            <div className="space-y-1">
                                <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest block">Processor</span>
                                <span className="text-[10px] text-zinc-300 font-mono uppercase">{item.specs.cpu}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest block">Memory</span>
                                <span className="text-[10px] text-zinc-300 font-mono uppercase">{item.specs.ram}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest block">Graphics</span>
                                <span className="text-[10px] text-zinc-300 font-mono uppercase">{item.specs.gpu}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest block">Display</span>
                                <span className="text-[10px] text-zinc-300 font-mono uppercase">{item.specs.display}</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. CALL TO ACTION */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-800 uppercase font-black tracking-[0.3em]">Affiliate_Link</span>
                            <span className="text-[9px] text-emerald-500/50 font-mono">Status: Verified_Source</span>
                        </div>

                        <a
                            href={item.affiliateUrl}
                            target="_blank"
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all"
                        >
                            Verify_Price <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}