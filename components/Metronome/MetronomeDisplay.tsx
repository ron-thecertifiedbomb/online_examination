
import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetronomeDisplayProps {
    bpm: number;
    isRunning: boolean;
    beatsPerBar: number;
    visualBeat: number;
    subdivision: number;
}

export const MetronomeDisplay: React.FC<MetronomeDisplayProps> = ({
    bpm,
    isRunning,
    beatsPerBar,
    visualBeat,
    subdivision
}) => (
    <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6">
        <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">Beats Per Minute</p>
        <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div className="flex items-baseline overflow-hidden">
                <span className="text-6xl font-black text-white tabular-nums tracking-tighter">
                    {bpm}
                </span>
                <span className="text-xl font-black text-zinc-500 ml-3 uppercase tracking-tighter">BPM</span>
            </div>
            <div className="flex items-center gap-3">
                <Activity className={`w-4 h-4 ${isRunning ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                    {isRunning ? 'Sync_Active' : 'Engine_Idle'}
                </span>
            </div>
        </div>

        {/* Visual Beat Track */}
        <div className="flex gap-2 justify-between h-14 items-end mt-8">
            {Array.from({ length: beatsPerBar }).map((_, i) => {
                const isActive = Math.floor(visualBeat / subdivision) % beatsPerBar === i;
                return (
                    <div key={i} className="flex-1 flex flex-col gap-2 items-center">
                        <motion.div
                            animate={{
                                backgroundColor: isActive ? (i === 0 ? "#ef4444" : "#10b981") : "#18181b",
                                height: isActive ? "24px" : "8px",
                            }}
                            transition={{ duration: 0.1 }}
                            className="w-full rounded-sm"
                        />
                        <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white' : 'text-zinc-800'}`}>0{i + 1}</span>
                    </div>
                );
            })}
        </div>
    </div>
);
