"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";

// This interface must match what you pass from the slug page
interface BlogContentProps {
    article: {
        id: string;
        title: string;
        category: string;
        image: string;
        createdAt: string;
        sections: {
            heading: string;
            content: string;
            items?: {
                name: string;
                image?: string;
                description: string;
                details: { label: string; value: string }[];
            }[];
        }[];
    };
}

export default function BlogContent({ article }: BlogContentProps) {
    if (!article) return null;

    return (
        <div className="space-y-24">
            {article.sections?.map((section, sIdx) => (
                <section key={sIdx} className="space-y-12">

                    {/* Text Content */}
                    <div className="max-w-3xl space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-4">
                            <span className="text-emerald-500/50 text-sm font-mono">0{sIdx + 1}</span>
                            {section.heading}
                        </h2>
                        {/* ✅ Removed italic class */}
                        <p className="text-zinc-400 leading-relaxed border-l border-zinc-900 pl-6">
                            {section.content}
                        </p>
                    </div>

                    {/* Items Grid (Laptops, Cars, AI Principles) */}
                    {section.items && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {section.items.map((item, iIdx) => (
                                <motion.div
                                    key={iIdx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-[#050505] border border-zinc-900 p-6 hover:border-emerald-500/30 transition-all"
                                >
                                    {item.image && (
                                        <div className="relative aspect-video mb-6 border border-zinc-800 grayscale hover:grayscale-0 transition-all">
                                            <Image src={`/${item.image}`} alt={item.name} fill className="object-cover" />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-black uppercase text-white mb-2">{item.name}</h3>
                                    <p className="text-zinc-500 text-xs mb-4">{item.description}</p>

                                    <div className="space-y-1 border-t border-zinc-900 pt-4">
                                        {item.details.map((detail, dIdx) => (
                                            <div key={dIdx} className="flex justify-between text-[10px] font-mono uppercase">
                                                <span className="text-zinc-600">{detail.label}</span>
                                                <span className="text-emerald-400">{detail.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            ))}
        </div>
    );
}