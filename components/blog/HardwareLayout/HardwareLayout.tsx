import { motion } from 'framer-motion';
import Image from 'next/image';
import { Monitor } from "lucide-react";

export const HardwareLayout = ({ content }: { content: any }) => (
    <div className="grid grid-cols-1 gap-12">
        {content.recommendations?.map((item: any) => (
            <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 border border-zinc-900 bg-zinc-900/10 hover:border-emerald-500/30 transition-all group"
            >
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                    {/* --- IMAGE CONTAINER --- */}
                    <div className="relative w-full lg:w-1/3 aspect-video bg-zinc-950 overflow-hidden border border-zinc-800 ">
                        {item.imageUrl ? (
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700"
                                sizes="(max-w-768px) 100vw, 33vw"
                            />
                        ) : (
                            /* Fallback kung walang image found sa path */
                            <Monitor size={48} className="text-zinc-800" />
                        )}
                    </div>

                    {/* --- DETAILS --- */}
                    <div className="flex-1">
                        <span className="text-emerald-500 font-mono text-[10px] font-black tracking-widest">
                            {item.brand} // {item.specs.bestFor}
                        </span>
                        <h3 className="text-4xl font-black uppercase my-2 tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                            {item.name}
                        </h3>
                        <p className="text-zinc-500 text-sm mb-6 font-bold leading-relaxed uppercase">
                            {item.description}
                        </p>

                        <div className="bg-black p-4 border border-zinc-900 font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex justify-between items-center">
                            <div className="flex flex-col gap-1">
                                <span className="text-zinc-700 text-[8px]">Processor</span>
                                <span>{item.specs.cpu}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-zinc-700 text-[8px]">Memory</span>
                                <span>{item.specs.ram}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
    </div>
);