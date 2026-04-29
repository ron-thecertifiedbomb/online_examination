"use client";

import React from "react";
import { Play, Square } from "lucide-react";
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";
import { useMetronome } from "./useMetronome";
import { MetronomeDisplay } from "./MetronomeDisplay";
import { BpmSlider } from "./BpmSlider";
import { GridControls } from "./GridControls";

export default function Metronome() {
    const {
        bpm, setBpm,
        beatsPerBar, setBeatsPerBar,
        isRunning, toggleMetronome,
        onTap,
        visualBeat,
        subdivision, setSubdivision
    } = useMetronome();
    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-xl mx-auto">
            <ToolHeader title="METRONOME" />

            <MetronomeDisplay
                bpm={bpm}
                isRunning={isRunning}
                beatsPerBar={beatsPerBar}
                visualBeat={visualBeat}
                subdivision={subdivision}
            />

            <div className="w-full space-y-8">
                <BpmSlider bpm={bpm} setBpm={setBpm} />

                <GridControls
                    beatsPerBar={beatsPerBar}
                    setBeatsPerBar={setBeatsPerBar}
                    subdivision={subdivision}
                    setSubdivision={setSubdivision}
                />

                {/* Primary Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={toggleMetronome}
                        className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95 ${isRunning
                            ? 'bg-zinc-900 border border-red-500/50 text-red-500 hover:bg-red-500/10'
                            : 'bg-emerald-500 text-black hover:bg-emerald-400'
                            }`}
                    >
                        {isRunning ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        {isRunning ? 'Kill_Engine' : 'Ignite'}
                    </button>
                    <button
                        onClick={onTap}
                        className="px-8 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-500 hover:text-white hover:border-zinc-700 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
                    >
                        Tap
                    </button>
                </div>
            </div>
        </Panel>
    );
}