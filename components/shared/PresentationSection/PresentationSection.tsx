'use client';

import React, { useRef } from "react";
import { motion, useInView, Variants, useScroll, useTransform } from "framer-motion";

// --- Types ---
interface Step {
    id: string | number;
    title: string;
    subtitle: string;
    paragraph: string;
    frustrations: string[];
    solutions: string[];
}

interface PresentationProps {
    data: {
        heading1: string;
        description: string;
        steps: Step[];
    };
    badge?: string;
}

// --- Animation Constants ---
const SURGICAL_EASE = [0.16, 1, 0.3, 1] as const;

const STAGGER_CONTAINER: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
};

const CARD_VARIANTS: Variants = {
    initial: { opacity: 0, y: 40, filter: "blur(10px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: SURGICAL_EASE }
    }
};

// --- Sub-Components ---
function StatusBadge({ text }: { text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-widest text-emerald-400 uppercase backdrop-blur-xl"
        >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            {text}
        </motion.div>
    );
}

function PresentationCard({ step, index }: { step: Step; index: number }) {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.1 });

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });
    const yNumber = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    return (
        <motion.div
            ref={cardRef}
            variants={CARD_VARIANTS}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="relative grid grid-cols-1 md:grid-cols-[1.2fr,2fr] gap-10 md:gap-24 py-12 md:py-20 border-b border-white/5 last:border-none"
        >
            {/* Context Area */}
            <div className="md:sticky md:top-40 h-fit space-y-4 md:space-y-6">
                <div className="space-y-2">
                    <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-emerald-500 uppercase">
                        {step.title}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-white leading-tight md:leading-[0.9]">
                        {step.subtitle}
                    </h3>
                </div>
                <p className="max-w-md text-base md:text-lg text-zinc-400 leading-relaxed font-light">
                    {step.paragraph}
                </p>
            </div>

            {/* Comparison Area */}
            <div className="space-y-6 md:space-y-10">
                <motion.div
                    whileHover={{ x: 6 }}
                    className="group p-6 md:p-8 rounded-2xl md:rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-950/10 to-transparent transition-all"
                >
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="h-px w-6 md:w-8 bg-red-500/50" />
                        <h4 className="text-[10px] md:text-sm font-bold tracking-widest text-red-500 uppercase">The Bottleneck</h4>
                    </div>
                    <ul className="space-y-3 md:space-y-4">
                        {step.frustrations.map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-400 text-sm leading-relaxed italic">
                                <span className="text-red-500/50">/</span> {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ x: -6 }}
                    className="group relative overflow-hidden p-6 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-zinc-900/40 backdrop-blur-sm transition-all hover:border-emerald-500/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="h-px w-6 md:w-8 bg-emerald-500" />
                        <h4 className="text-[10px] md:text-sm font-bold tracking-widest text-emerald-400 uppercase">The Precision</h4>
                    </div>
                    <ul className="space-y-3 md:space-y-4">
                        {step.solutions.map((item, i) => (
                            <li key={i} className="flex gap-3 text-zinc-100 text-sm font-medium leading-relaxed">
                                <span className="text-emerald-500">→</span> {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Large background number - Hidden on Mobile for clean layout */}
            <motion.span
                style={{ y: yNumber }}
                className="hidden md:block absolute -left-20 top-0 text-[18rem] font-black text-white/[0.03] -z-10 select-none pointer-events-none tracking-tighter"
            >
                0{index + 1}
            </motion.span>
        </motion.div>
    );
}

export default function PresentationSection({ data, badge = "System Protocol 01" }: PresentationProps) {
    const { heading1, description, steps } = data;

    return (
        <section className="relative w-full bg-black py-20 md:py-32 overflow-hidden">
            <div className="absolute top-0 left-1/4 -z-10 h-[300px] md:h-[600px] w-[300px] md:w-[600px] bg-emerald-900/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />

            <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
                <motion.div
                    variants={STAGGER_CONTAINER}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="mb-16 md:mb-32"
                >
                    <StatusBadge text={badge} />

                    {/* FIXED: Reduced text size on mobile and adjusted leading to prevent overlap */}
                    <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-[1] md:leading-[0.85] mb-6 md:mb-10">
                        {heading1}
                    </h1>

                    <p className="max-w-3xl text-lg md:text-2xl text-zinc-500 leading-relaxed font-light">
                        {description}
                    </p>
                </motion.div>

                <div className="relative">
                    {steps.map((step, index) => (
                        <PresentationCard key={step.id || index} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}