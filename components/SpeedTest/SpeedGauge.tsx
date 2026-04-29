"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { TestPhase } from "./types";

interface SpeedGaugeProps {
    phase: TestPhase;
    displaySpeed: number;
    strokeProgress: number;
    testing: boolean;
    phaseText: string;
    centerContent?: ReactNode;
}

export function SpeedGauge({
    phase,
    displaySpeed,
    strokeProgress,
    testing,
    phaseText,
    centerContent
}: SpeedGaugeProps) {
    return (
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="downloadStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="45%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                    <linearGradient id="uploadStrokeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-white/5"
                />

                {phase !== "idle" && displaySpeed > 0 && (
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke={`url(#${phase === "upload" ? "uploadStrokeGradient" : "downloadStrokeGradient"})`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: strokeProgress }}
                        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
                        transform="rotate(90 50 50)"
                    />
                )}
            </svg>

            <div className="text-center z-10">
                {centerContent ?? (
                    <motion.div
                        key={displaySpeed}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight"
                    >
                        {testing && phase !== "idle" ? displaySpeed.toFixed(displaySpeed > 100 ? 1 : 2) : "GO"}
                    </motion.div>
                )}
                <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">
                    {phaseText}
                    {phase !== "idle" && " Mbps"}
                </div>
            </div>
        </div>
    );
}
