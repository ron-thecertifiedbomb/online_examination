"use client";

import { motion } from "framer-motion";

export default function Hero({ homeContent }: { homeContent: any[] }) {
    const heading = homeContent.find(b => b.type === "heading");
    const highlightWord = heading?.highlight || "";
    const paragraph = homeContent.find(b => b.type === "paragraph");

    return (
        <section className="relative w-full max-w-full overflow-hidden flex flex-col items-center justify-center py-12 md:py-24 gap-6">

            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

            {heading && (
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center text-[clamp(2.5rem,12vw,9rem)] font-black tracking-tighter uppercase leading-[0.85] antialiased cursor-default break-words z-10"
                >
                    {highlightWord ? (
                        heading.content.split(highlightWord).map((part, i) => (
                            <span key={i} className="block text-center w-full">
                                {part}
                                {i === 0 && (
                                    <span className="text-emerald-500 inline-block drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                        {highlightWord}
                                    </span>
                                )}
                            </span>
                        ))
                    ) : (
                        <span className="block text-center">{heading.content}</span>
                    )}
                </motion.h1>
            )}

            {paragraph && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-balance text-base md:text-xl text-zinc-500 max-w-3xl font-normal text-center px-6 leading-relaxed tracking-wide z-10"
                >
                    {paragraph.content}
                </motion.p>
            )}

            {/* Aesthetic Divider */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                className="h-[1px] bg-emerald-500/30 mt-4"
            />
        </section>
    );
}