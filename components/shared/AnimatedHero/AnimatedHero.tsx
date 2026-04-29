import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const words = ["Innovation", "Open Source", "Reliability", "Simplicity", "Solutions"];

export default function AnimatedHero() {
    return (
        <section className="relative flex  flex-col items-center overflow-hidden px-6 py-18 text-center">
      
          
            <div className="mx-auto max-w-6xl text-center">
                {/* Badge - Emerald Reverted */}
                {/* <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.625rem] md:text-lg font-medium  text-zinc-200 backdrop-blur-xl"
                >
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    System Status: Operational
                </motion.div> */}

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold tracking-tighter text-white sm:text-7xl md:text-8xl uppercase"
                >
                    {/* Lizard Interactive Online <br /> */}
                    <TextLoop items={words} />
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto mt-8 max-w-3xl text-md leading-relaxed text-zinc-400 md:text-xl"
                >
                    Forging high-fidelity digital products with
                    <span className="relative mx-1 inline-block text-emerald-500 font-bold tracking-tight pb-1">
                        predatory speed
                        <motion.span
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
     
                            className="absolute bottom-0 left-0 w-full border-b-[0.5px] border-emerald-500/40 origin-left"
                        />
                    </span>
                    and <span className="text-white font-medium">surgical precision.</span>
                </motion.p>

                {/* <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <button className="group relative flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-black transition-all hover:bg-emerald-50 active:scale-95">
                        Start Building
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-8 py-3.5 font-bold text-white transition-colors hover:bg-white/10 hover:border-white/20">
                        View Source
                    </button>
                </motion.div> */}
            </div>
        </section>
    );
}

// Reusable Sub-Component
function TextLoop({ items }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [items]);

    return (
        <span className="relative inline-flex h-[1.1em] flex-col overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.span
                    key={items[index]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 18,
                        mass: 0.8
                    }}
                    className="text-emerald-500 pb-2"
                >
                    {items[index]}
                </motion.span>
                    {items[index]}
           
            </AnimatePresence>
        </span>
    );
}