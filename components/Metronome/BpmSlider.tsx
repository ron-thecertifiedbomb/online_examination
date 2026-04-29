
import React from 'react';

interface BpmSliderProps {
    bpm: number;
    setBpm: (bpm: number) => void;
}

export const BpmSlider: React.FC<BpmSliderProps> = ({
    bpm,
    setBpm
}) => (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-zinc-500 uppercase">Tempo Control</span>
            <span className="text-xs font-mono text-emerald-500">{bpm}</span>
        </div>
        <input
            type="range" min={30} max={240} value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-900 appearance-none cursor-pointer rounded-full accent-emerald-500"
        />
    </div>
);
