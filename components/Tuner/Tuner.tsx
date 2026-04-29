/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mic, MicOff, Music, Zap } from 'lucide-react';
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

const STANDARD_TUNING = [
    { string: '6', note: 'E', octave: 2, frequency: 82.41, displayNote: 'E2' },
    { string: '5', note: 'A', octave: 2, frequency: 110.00, displayNote: 'A2' },
    { string: '4', note: 'D', octave: 3, frequency: 146.83, displayNote: 'D3' },
    { string: '3', note: 'G', octave: 3, frequency: 196.00, displayNote: 'G3' },
    { string: '2', note: 'B', octave: 3, frequency: 246.94, displayNote: 'B3' },
    { string: '1', note: 'E', octave: 4, frequency: 329.63, displayNote: 'E4' }
];

// YIN Pitch Detection Logic (Condensed for UI focus)
class YINPitchDetector {
    private threshold: number = 0.1;
    detect(buffer: Float32Array, sampleRate: number): number {
        if (buffer.length < 2048) return -1;
        let maxVal = 0;
        for (let i = 0; i < buffer.length; i++) maxVal = Math.max(maxVal, Math.abs(buffer[i]));
        if (maxVal < 0.005) return -1;

        const diff = new Float32Array(buffer.length / 2);
        let runningSum = 0;
        for (let tau = 0; tau < diff.length; tau++) {
            let sum = 0;
            for (let i = 0; i < buffer.length - tau; i++) {
                const delta = buffer[i] - buffer[i + tau];
                sum += delta * delta;
            }
            diff[tau] = sum;
            if (tau > 0) {
                runningSum += diff[tau];
                const cmndf = diff[tau] * tau / runningSum;
                if (cmndf < this.threshold && tau > 15) return sampleRate / tau;
            }
        }
        return -1;
    }
}

export default function PolytuneTuner() {
    const [targetNote, setTargetNote] = useState('E2');
    const [cents, setCents] = useState(0);
    const [frequency, setFrequency] = useState(0);
    const [isDetected, setIsDetected] = useState(false);
    const [active, setActive] = useState(false);
    const [volume, setVolume] = useState(0);
    const [detectedString, setDetectedString] = useState<number>(-1);

    const audioCtx = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const pitchDetector = useRef(new YINPitchDetector());

    const startTuning = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
            });
            streamRef.current = stream;
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyser.current = audioCtx.current.createAnalyser();
            analyser.current.fftSize = 4096;
            const source = audioCtx.current.createMediaStreamSource(stream);
            source.connect(analyser.current);
            setActive(true);
            updatePitch();
        } catch (err) {
            console.error(err);
        }
    };

    const stopTuning = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioCtx.current) audioCtx.current.close();
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        setActive(false);
        setIsDetected(false);
    };

    const updatePitch = () => {
        if (!analyser.current || !audioCtx.current) return;
        const buffer = new Float32Array(analyser.current.fftSize);
        analyser.current.getFloatTimeDomainData(buffer);

        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length);
        setVolume(rms);

        if (rms > 0.01) {
            const pitch = pitchDetector.current.detect(buffer, audioCtx.current.sampleRate);
            if (pitch > 50 && pitch < 1200) {
                setFrequency(pitch);
                let minDiff = Infinity;
                let closestIndex = 0;
                STANDARD_TUNING.forEach((note, i) => {
                    const diff = Math.abs(Math.log2(pitch / note.frequency));
                    if (diff < minDiff) { minDiff = diff; closestIndex = i; }
                });
                const target = STANDARD_TUNING[closestIndex];
                const rawCents = 1200 * Math.log2(pitch / target.frequency);
                setCents(Math.round(rawCents));
                setTargetNote(target.displayNote);
                setDetectedString(closestIndex);
                setIsDetected(true);
            } else {
                setIsDetected(false);
            }
        } else {
            setIsDetected(false);
        }
        animationRef.current = requestAnimationFrame(updatePitch);
    };

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-xl mx-auto">
            <ToolHeader title="Pitch Engine" />

            {/* TUNER HUD - Matches Unit Converter Result Area */}
            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">Target Frequency</p>
                <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div className="flex items-baseline">
                        <span className={`text-6xl font-black tabular-nums tracking-tighter transition-colors ${isDetected && Math.abs(cents) < 3 ? 'text-emerald-500' : 'text-white'}`}>
                            {isDetected ? targetNote : "--"}
                        </span>
                        <span className="text-xl font-black text-zinc-500 ml-3 uppercase tracking-tighter">
                            {isDetected ? `${frequency.toFixed(1)}Hz` : "Ready"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className={`w-4 h-4 ${isDetected ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                            {isDetected ? `${cents > 0 ? '+' : ''}${cents} Cents` : 'Awaiting_Signal'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-6">
                {/* Visual Tuning Meter */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[160px] relative">
                    <div className="flex items-end justify-center gap-1.5 w-full h-24">
                        {Array.from({ length: 41 }).map((_, i) => {
                            const segmentCents = i - 20;
                            const isActive = isDetected && Math.abs(cents - segmentCents) < 1;
                            const isCenter = segmentCents === 0;
                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: isActive ? (isCenter ? 80 : 60) : (isCenter ? 20 : 10),
                                        backgroundColor: isActive ? (isCenter ? '#10b981' : '#f59e0b') : '#18181b'
                                    }}
                                    className="w-1.5 rounded-full"
                                />
                            );
                        })}
                    </div>
                    <div className="w-full flex justify-between mt-4 px-2 text-[8px] font-mono text-zinc-700 uppercase tracking-[0.2em]">
                        <span>Flat (-)</span>
                        <span>Perfect</span>
                        <span>Sharp (+)</span>
                    </div>
                </div>

                {/* String Indicator Grid */}
                <div className="grid grid-cols-6 gap-2">
                    {STANDARD_TUNING.map((s, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-xl border text-center transition-all ${detectedString === idx ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}
                        >
                            <div className="text-[10px] font-mono">{s.note}</div>
                            <div className="text-[8px] opacity-50 uppercase">{s.string}</div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-[1fr,auto] gap-4">
                    <button
                        onClick={active ? stopTuning : startTuning}
                        className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95 ${active
                                ? 'bg-zinc-900 border border-red-500/50 text-red-500 hover:bg-red-500/10'
                                : 'bg-emerald-500 text-black hover:bg-emerald-400'
                            }`}
                    >
                        {active ? <MicOff size={18} /> : <Mic size={18} />}
                        {active ? 'Kill_Engine' : 'Ignite_Sensor'}
                    </button>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl px-6 flex items-center gap-4">
                        <div className="h-12 w-1 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ height: `${volume * 200}%` }}
                                className="w-full bg-emerald-500 bottom-0"
                            />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase vertical-text">Gain</span>
                    </div>
                </div>
            </div>
        </Panel>
    );
}