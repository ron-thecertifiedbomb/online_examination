import React from 'react';
import { Terminal, Cpu, Music, Shield, ArrowRight, Zap } from "lucide-react";
import Link from 'next/link';

// Interface to match your data structure in data/blogContent.ts
interface BioDigitalProps {
    data: {
        header: {
            title: string;
            label: string;
            priority: string;
        };
        hooks: {
            intro: string;
        };
        contentBlocks: Array<{
            id: string;
            type: string;
            icon: string;
            title: string;
            text: string;
            quote?: string;
            subText?: string;
            protocols?: string[];
        }>;
    };
}

export default function BioDigitalShift({ data }: BioDigitalProps) {
    // Safety check for SSR
    if (!data) return null;

    // Map icons to the schema strings
    const IconMap: Record<string, React.ReactNode> = {
        cpu: <Cpu size={20} />,
        music: <Music size={20} />,
        shield: <Shield size={20} />
    };

    return (
        <div className="font-sans text-zinc-400 leading-relaxed antialiased">

            {/* --- DYNAMIC HEADER --- */}
            <header className="mb-16 border-b border-zinc-900 pb-12">
                <div className="flex items-center gap-3 mb-8 text-emerald-500 font-mono tracking-widest">
                    <Terminal size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                        System.Log // {data.header.label}
                    </span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[0.85] uppercase">
                    {data.header.title.split(': ')[0]}: <br />
                    <span className="text-emerald-500">{data.header.title.split(': ')[1]}</span>
                </h1>

                <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-widest font-bold font-mono">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        Auth: Lizard_Interactive
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600">
                        <Zap size={12} className="text-emerald-500" />
                        {data.header.priority}
                    </div>
                </div>
            </header>

            {/* --- DYNAMIC CONTENT BLOCKS --- */}
            <div className="space-y-20 text-lg md:text-xl text-left font-light">
                {data.contentBlocks.map((block) => (
                    <section key={block.id} className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-zinc-900 rounded-lg text-emerald-500">
                                {IconMap[block.icon] || <Zap size={20} />}
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] font-mono">
                                {block.id}. {block.title}
                            </h2>
                        </div>

                        <p className="leading-relaxed text-zinc-300">{block.text}</p>

                        {/* RENDER QUOTE */}
                        {block.quote && (
                            <blockquote className="border-l-4 border-emerald-500 bg-emerald-500/[0.03] p-10 rounded-r-3xl italic text-white text-2xl md:text-3xl font-medium tracking-tight">
                                "{block.quote}"
                            </blockquote>
                        )}

                        {/* RENDER SUBTEXT */}
                        {block.subText && (
                            <p className="leading-relaxed font-normal text-zinc-400 italic border-l border-zinc-800 pl-6">
                                {block.subText}
                            </p>
                        )}

                        {/* RENDER PROTOCOLS */}
                        {block.protocols && (
                            <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.5em] mb-8 font-mono">
                                    Engine_Protocol_v3.2.6
                                </p>
                                <ul className="space-y-6 text-zinc-100 text-base md:text-lg">
                                    {block.protocols.map((p, i) => (
                                        <li key={i} className="flex gap-5 items-start">
                                            <span className="text-emerald-500 font-mono text-xs mt-1">[+]</span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                ))}

                {/* --- STATIC BRAND FOOTER --- */}
                <footer className="mt-40 pt-20 border-t border-zinc-900">
                    <div className="p-12 bg-emerald-600 rounded-[3.5rem] text-black shadow-[0_40px_100px_rgba(16,185,129,0.15)] group relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 italic">
                                The Lizard Perspective
                            </h3>
                            <p className="font-medium text-xl md:text-2xl mb-10 max-w-2xl opacity-90 leading-tight tracking-tight">
                                AI is the ultimate co-processor. It is the most powerful tool ever handed to the "Lizard" brain
                                to help it execute at a global scale.
                            </p>
                            <Link href="/tools" className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all">
                                Explore System_Utilities <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="absolute -right-16 -bottom-16 text-black/10 select-none pointer-events-none text-[20rem] font-black italic tracking-tighter">
                            200
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}