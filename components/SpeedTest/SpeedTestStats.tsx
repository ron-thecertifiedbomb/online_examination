"use client";

import { Clock, Download, Upload, type LucideIcon } from "lucide-react";
import type { SpeedTestResults } from "./types";

interface SpeedTestStatsProps {
    results: SpeedTestResults;
}

export function SpeedTestStats({ results }: SpeedTestStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-md">
            <StatBox label="Ping" value={results.ping} unit="ms" icon={Clock} color="text-zinc-300" />
            <StatBox label="Down" value={results.download} unit="Mbps" icon={Download} color="text-emerald-500" />
            <StatBox label="Up" value={results.upload} unit="Mbps" icon={Upload} color="text-blue-500" />
        </div>
    );
}

function StatBox({ label, value, unit, icon: Icon, color }: {
    label: string;
    value: string | null;
    unit: string;
    icon: LucideIcon;
    color: string;
}) {
    return (
        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-center transition-all hover:bg-white/[0.05]">
            <div className="flex items-center justify-center gap-1.5 text-zinc-500 mb-2">
                <Icon size={12} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-xl font-bold tabular-nums ${color}`}>
                {value || "--"}
                <span className="text-[8px] ml-1 opacity-40 font-normal">{value ? unit : ""}</span>
            </div>
        </div>
    );
}
