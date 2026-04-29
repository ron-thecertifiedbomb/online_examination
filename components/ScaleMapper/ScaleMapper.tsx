"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Layers, ChevronRight, Zap } from 'lucide-react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const TUNING = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E indices in NOTES

export default function ScaleMapper() {
    const [selectedKey, setSelectedKey] = useState('E');
    const [showCAGED, setShowCAGED] = useState(false);

    // High-performance scale calculation
    const getScaleNotes = (key: string) => {
        const rootIdx = NOTES.indexOf(key);
        const intervals = [0, 2, 4, 5, 7, 9, 11]; // Major Scale
        return intervals.map(i => NOTES[(rootIdx + i) % 12]);
    };

    const scaleNotes = getScaleNotes(selectedKey);

    return (
        <div className="w-full max-w-5xl mx-auto bg-[#050505] border border-zinc-900 p-8 overflow-hidden relative">
            {/* 1. HUD HEADER */}
            <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Crosshair size={14} className="text-emerald-500 animate-spin-slow" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Scale.Matrix_v1.0</h2>
                    </div>
                    <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
                        Status: Mapping_{selectedKey}_Major_Frequencies
                    </p>
                </div>

                <div className="flex gap-4">
                    <select
                        value={selectedKey}
                        onChange={(e) => setSelectedKey(e.target.value)}
                        className="bg-black border border-zinc-800 text-white font-mono text-xs p-2 outline-none focus:border-emerald-500 transition-colors"
                    >
                        {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button
                        onClick={() => setShowCAGED(!showCAGED)}
                        className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${showCAGED ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-black text-zinc-500 border-zinc-800 hover:text-white'
                            }`}
                    >
                        <Layers size={12} /> {showCAGED ? 'CAGED_ON' : 'CAGED_OFF'}
                    </button>
                </div>
            </div>

            {/* 2. THE SVG FRETBOARD MATRIX */}
            <div className="relative overflow-x-auto no-scrollbar py-10">
                <svg width="1000" height="200" viewBox="0 0 1000 200" className="min-w-full">
                    {/* Fretboard Wood */}
                    <rect width="1000" height="180" fill="#0a0a0a" />

                    {/* Frets */}
                    {Array.from({ length: 23 }).map((_, i) => (
                        <line
                            key={i}
                            x1={i * 43.5} y1="0" x2={i * 43.5} y2="180"
                            stroke="#1a1a1a" strokeWidth={i === 0 ? "4" : "1"}
                        />
                    ))}

                    {/* Strings & Notes Mapping */}
                    {TUNING.map((stringRoot, sIdx) => (
                        <g key={sIdx}>
                            <line x1="0" y1={15 + sIdx * 30} x2="1000" y2={15 + sIdx * 30} stroke="#18181b" strokeWidth="1" />
                            {Array.from({ length: 22 }).map((_, fIdx) => {
                                const noteName = NOTES[(stringRoot + fIdx) % 12];
                                const isScaleNote = scaleNotes.includes(noteName);
                                const isRoot = noteName === selectedKey;

                                if (!isScaleNote) return null;

                                return (
                                    <motion.g
                                        key={fIdx}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <circle
                                            cx={fIdx * 43.5 + 21.75}
                                            cy={15 + sIdx * 30}
                                            r="10"
                                            fill={isRoot ? "#10b981" : "#000"}
                                            stroke={isRoot ? "#10b981" : "#3f3f46"}
                                            strokeWidth="1.5"
                                        />
                                        <text
                                            x={fIdx * 43.5 + 21.75}
                                            y={15 + sIdx * 30 + 3}
                                            textAnchor="middle"
                                            fontSize="8"
                                            fontFamily="monospace"
                                            fontWeight="bold"
                                            fill={isRoot ? "#000" : "#fff"}
                                        >
                                            {noteName}
                                        </text>
                                    </motion.g>
                                );
                            })}
                        </g>
                    ))}
                </svg>
            </div>

            {/* 3. DIAGNOSTIC FOOTER */}
            <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center opacity-40">
                <div className="flex gap-6 text-[8px] font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Zap size={10} /> Mode: Ionian</span>
                    <span className="flex items-center gap-1"><ChevronRight size={10} /> Engine: SVG_Render_V1</span>
                </div>
                <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}