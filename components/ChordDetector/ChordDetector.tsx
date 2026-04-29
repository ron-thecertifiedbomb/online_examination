'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Upload, Activity, Music, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrecisionChordAnalyzer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [currentChord, setCurrentChord] = useState('--');
    const [chromaData, setChromaData] = useState<number[]>(new Array(12).fill(0));

    const audioCtx = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | undefined>(undefined);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && audioRef.current) {
            audioRef.current.src = URL.createObjectURL(file);
            setFileName(file.name);
            setIsPlaying(false);
            setCurrentChord('IDLE');
        }
    };

    const togglePlayback = async () => {
        if (!audioRef.current?.src) return;
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyser.current = audioCtx.current.createAnalyser();
            const source = audioCtx.current.createMediaElementSource(audioRef.current);
            source.connect(analyser.current);
            analyser.current.connect(audioCtx.current.destination);
            // 8192 is slow but surgically accurate for low-end chord frequencies
            analyser.current.fftSize = 8192;
            analyser.current.smoothingTimeConstant = 0.8;
        }

        if (isPlaying) {
            audioRef.current.pause();
            cancelAnimationFrame(animationRef.current!);
        } else {
            await audioCtx.current.resume();
            audioRef.current.play();
            analyze();
        }
        setIsPlaying(!isPlaying);
    };

    const analyze = () => {
        if (!analyser.current) return;
        const bufferLength = analyser.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const process = () => {
            analyser.current!.getByteFrequencyData(dataArray);
            const sampleRate = audioCtx.current!.sampleRate;
            const newChroma = new Array(12).fill(0);

            // SURGICAL BINNING: Map frequencies to 12-tone chroma
            for (let i = 0; i < bufferLength; i++) {
                const freq = i * (sampleRate / analyser.current!.fftSize);

                // Chords usually live between 60Hz (Bass) and 1200Hz (Melody)
                if (freq > 60 && freq < 1200) {
                    // Standard MIDI-style tuning conversion: 12 * log2(f / 440) + 69
                    const semitone = 12 * Math.log2(freq / 440) + 69;
                    const noteIdx = Math.floor(semitone) % 12;
                    // Add amplitude to the specific note bin
                    newChroma[noteIdx] += dataArray[i];
                }
            }

            // Normalize and smooth the visualization
            const maxVal = Math.max(...newChroma) || 1;
            const normalized = newChroma.map(v => (v / maxVal) * 100);
            setChromaData(normalized);

            // ACCURACY LOGIC: Find Root and Quality
            const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const rootIdx = normalized.indexOf(Math.max(...normalized));

            if (normalized[rootIdx] > 50) {
                // Check for Minor 3rd (3 semitones) vs Major 3rd (4 semitones)
                const minor3rd = normalized[(rootIdx + 3) % 12];
                const major3rd = normalized[(rootIdx + 4) % 12];
                const quality = minor3rd > major3rd ? 'm' : '';

                // Only update if the signal is clear enough
                if (normalized[rootIdx] > 70) {
                    setCurrentChord(`${notes[rootIdx]}${quality}`);
                }
            }

            animationRef.current = requestAnimationFrame(process);
        };
        process();
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6 bg-[#050505] border border-zinc-900 rounded-3xl font-mono shadow-2xl">
            {/* HUD Status */}
            <div className="flex justify-between items-center mb-10 opacity-60">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                    <span className="text-[9px] text-emerald-500 font-black tracking-[0.3em] uppercase">
                        {isPlaying ? 'FFT_PRECISION_ON' : 'BUFFER_WAITING'}
                    </span>
                </div>
                <div className="flex gap-2">
                    <div className="w-4 h-[1px] bg-zinc-800 self-center" />
                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">8192_SAMPLES</span>
                </div>
            </div>

            {/* Chord Readout */}
            <div className="relative flex flex-col items-center py-16 bg-zinc-950/50 border-y border-zinc-900/30 mb-8 overflow-hidden rounded-xl">
                <div className="absolute top-4 left-6 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500/50" />
                    <span className="text-[7px] text-zinc-600 uppercase tracking-[0.3em]">Spectral_Chroma_Engine</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentChord}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-8xl font-black tracking-tighter ${isPlaying ? 'text-white' : 'text-zinc-900'}`}
                    >
                        {currentChord}
                    </motion.div>
                </AnimatePresence>

                {/* Accuracy Chromagram */}
                <div className="mt-12 flex gap-1 sm:gap-2 items-end h-20 w-full px-8 sm:px-12">
                    {chromaData.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3">
                            <div className="w-full bg-zinc-900 h-full relative overflow-hidden">
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full bg-emerald-500"
                                    animate={{ height: `${isPlaying ? val : 2}%` }}
                                    style={{
                                        opacity: val > 60 ? 1 : 0.3,
                                        boxShadow: val > 80 ? '0 0 20px #10b98144' : 'none'
                                    }}
                                />
                            </div>
                            <span className="text-[7px] text-zinc-500 font-black">
                                {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center justify-center gap-3 px-6 py-4 border border-zinc-800 bg-zinc-900/40 text-[9px] text-zinc-500 font-black uppercase tracking-widest cursor-pointer hover:bg-zinc-800 hover:text-white transition-all">
                    <Upload className="w-3 h-3" />
                    {fileName ? 'Switch' : 'Upload'}
                    <input type="file" onChange={handleFileUpload} accept="audio/*" className="hidden" />
                </label>

                <button
                    onClick={togglePlayback}
                    disabled={!fileName}
                    className={`px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all
                        ${!fileName ? 'opacity-10 cursor-not-allowed' : 'active:scale-95 shadow-xl'}
                        ${isPlaying ? 'bg-red-600 text-white' : 'bg-emerald-500 text-black'}
                    `}
                >
                    {isPlaying ? 'Halt_Process' : 'Start_Sync'}
                </button>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-zinc-900/50 pt-6">
                <div className="flex gap-4">
                    <div className="space-y-1">
                        <p className="text-[6px] text-zinc-600 uppercase font-mono tracking-widest">Resolution</p>
                        <p className="text-[9px] text-white font-bold tracking-tighter italic">High_Fi</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[6px] text-zinc-600 uppercase font-mono tracking-widest">Buffer</p>
                        <p className="text-[9px] text-white font-bold tracking-tighter italic">Linear</p>
                    </div>
                </div>
                <span className="text-[7px] text-zinc-800 uppercase tracking-widest">Lizard_Interactive_Precision_DSP</span>
            </div>

            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" crossOrigin="anonymous" />
        </div>
    );
}