import { motion } from 'framer-motion';
import { Activity, Zap, Shield } from "lucide-react";

export const ProductionLayout = ({ content }: { content: any }) => (
    <div className="space-y-32">
        {content.contentBlocks?.map((block: any) => (
            <motion.section key={block.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex flex-col md:flex-row gap-8">
                <div className="p-3 bg-zinc-900 border border-zinc-800 text-emerald-500 h-fit">
                    {block.icon === 'zap' ? <Zap size={24} /> : <Activity size={24} />}
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">{block.title}</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">{block.text}</p>
                    {block.type === 'protocol' && (
                        <div className="bg-zinc-900 border border-zinc-900 font-mono">
                            {block.protocols?.map((p: string, i: number) => (
                                <div key={i} className="bg-black p-4 border-b border-zinc-900 flex gap-4 hover:bg-emerald-500/5 transition-colors">
                                    <span className="text-emerald-500 font-black">P_0{i + 1}</span>
                                    <span className="text-zinc-500 text-[11px] uppercase tracking-widest">{p}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>
        ))}
    </div>
);