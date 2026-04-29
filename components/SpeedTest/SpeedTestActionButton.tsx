"use client";

import { Play, RefreshCw } from "lucide-react";
import type { SpeedTestResults } from "./types";

interface SpeedTestActionButtonProps {
    testing: boolean;
    results: SpeedTestResults;
    onStart: () => void;
}

export function SpeedTestActionButton({ testing, results, onStart }: SpeedTestActionButtonProps) {
    return (
        <button
            onClick={onStart}
            disabled={testing}
            className="group relative w-full overflow-hidden rounded-2xl border border-emerald-400/40 bg-emerald-950/40 px-4 sm:px-6 py-3.5 sm:py-4 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/90 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-green-500/25 to-emerald-400/15 opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute -inset-x-10 -top-16 h-24 rotate-6 bg-white/20 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
            <span className="relative z-10 flex items-center justify-center gap-3">
                {testing ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-emerald-300" />
                ) : (
                    <Play className="h-5 w-5 text-emerald-300 transition-transform duration-300 group-hover:translate-x-0.5" />
                )}
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.14em] sm:tracking-[0.18em]">
                    {testing
                        ? "Analyzing Network..."
                        : results.ping || results.download || results.upload
                            ? "Test Again"
                            : "Start Diagnostic"}
                </span>
            </span>
        </button>
    );
}
