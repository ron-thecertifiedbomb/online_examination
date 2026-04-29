"use client";

import { motion } from "framer-motion";
import type { FramerSlide } from "./types";

type FramerPresentationPanelsProps = {
    slides: FramerSlide[];
    currentSlide: FramerSlide;
    currentIndex: number;
    showPanels: boolean;
    quickFacts: string[];
    actionChecklist: string[];
    onSelectSlide: (index: number) => void;
    onTogglePanels: () => void;
};

function panelCardClassName(isActive: boolean) {
    return `rounded-xl border p-3 text-left transition-all sm:rounded-2xl sm:p-4 ${
        isActive ? "border-emerald-500/50 bg-white/5" : "border-white/5 bg-transparent hover:border-white/10"
    }`;
}

export function FramerPresentationPanels({
    slides,
    currentSlide,
    currentIndex,
    showPanels,
    quickFacts,
    actionChecklist,
    onSelectSlide,
    onTogglePanels,
}: FramerPresentationPanelsProps) {
    return (
        <>
            <div className="flex justify-end">
                <button
                    onClick={onTogglePanels}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white sm:text-xs"
                    aria-expanded={showPanels}
                    aria-controls="framer-presentation-panels"
                >
                    {showPanels ? "Hide Panels" : "Show Panels"}
                </button>
            </div>

            {showPanels && (
                <div id="framer-presentation-panels" className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => onSelectSlide(index)}
                                className={panelCardClassName(currentIndex === index)}
                            >
                                <div className="mb-1 text-[9px] font-mono text-zinc-600">METRIC_0{index + 1}</div>
                                <div
                                    className={`text-[11px] font-bold uppercase tracking-wide sm:text-xs ${
                                        currentIndex === index ? "text-white" : "text-zinc-500"
                                    }`}
                                >
                                    {slide.id}
                                </div>
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={`${currentSlide.id}-tip`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                    >
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400/80">Pro Tip</div>
                        <p className="mt-2 text-sm text-zinc-200 sm:text-base">{currentSlide.tip}</p>
                    </motion.div>

                    <motion.div
                        key={`${currentSlide.id}-extras`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
                    >
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">Quick Facts</div>
                            <ul className="mt-3 space-y-2">
                                {quickFacts.map((fact) => (
                                    <li key={fact} className="flex items-start gap-2 text-sm text-zinc-200">
                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                        <span>{fact}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                                Action Checklist
                            </div>
                            <ul className="mt-3 space-y-2">
                                {actionChecklist.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-200">
                                        <span className="mt-0.5 text-emerald-400">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
