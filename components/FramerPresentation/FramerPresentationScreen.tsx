"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { FramerSlide } from "./types";

type FramerPresentationScreenProps = {
    currentSlide: FramerSlide;
    currentIndex: number;
    slideCount: number;
    progress: number;
    isPlaying: boolean;
    onPrev: () => void;
    onNext: () => void;
    onTogglePlayback: () => void;
};

export function FramerPresentationScreen({
    currentSlide,
    currentIndex,
    slideCount,
    progress,
    isPlaying,
    onPrev,
    onNext,
    onTogglePlayback,
}: FramerPresentationScreenProps) {
    return (
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:aspect-video sm:rounded-3xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center sm:p-12"
                >
                    <div
                        className="absolute inset-0 opacity-10 blur-[120px]"
                        style={{ backgroundColor: currentSlide.color }}
                    />
                    <motion.div
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 sm:mb-6 sm:text-xs"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <currentSlide.icon size={14} style={{ color: currentSlide.color }} />
                        {currentSlide.id}
                    </motion.div>

                    <motion.h2
                        className="mb-3 text-3xl font-black tracking-tighter text-white sm:mb-4 sm:text-4xl md:text-6xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {currentSlide.title}
                    </motion.h2>

                    <motion.p
                        className="max-w-xs px-2 font-mono text-xs text-zinc-400 sm:max-w-md sm:px-0 sm:text-sm md:text-lg"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {currentSlide.desc}
                    </motion.p>

                    <motion.div
                        className="mt-5 grid w-full max-w-sm grid-cols-2 gap-2 sm:mt-7 sm:max-w-2xl sm:gap-3"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-left backdrop-blur-sm">
                            <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-500">Stats</div>
                            <div className="mt-1 text-xs font-semibold text-white sm:text-sm">{currentSlide.stats}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-left backdrop-blur-sm">
                            <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-500">Impact</div>
                            <div className="mt-1 text-xs font-semibold text-white sm:text-sm">{currentSlide.impact}</div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-4 sm:p-6">
                <div className="mb-4 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10 sm:mb-6">
                    <motion.div
                        className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-400 sm:text-xs">
                        Slide {currentIndex + 1} / {slideCount}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onPrev}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95 sm:h-11 sm:w-11"
                            aria-label="Previous slide"
                        >
                            <SkipBack size={20} />
                        </button>
                        <button
                            onClick={onTogglePlayback}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
                            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                        >
                            {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1" />}
                        </button>
                        <button
                            onClick={onNext}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95 sm:h-11 sm:w-11"
                            aria-label="Next slide"
                        >
                            <SkipForward size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
