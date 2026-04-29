/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check, Download, RefreshCcw, Terminal, Activity, Zap, ShieldCheck } from "lucide-react";
import { generateMeshCSS } from '../../utils/gradientEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

export default function MeshGenerator() {
    const [bgColor, setBgColor] = useState("#080808");
    const [copied, setCopied] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const [points, setPoints] = useState([
        { id: '1', color: '#10b981', x: 0, y: 0, size: 100 },
        { id: '2', color: '#3b82f6', x: 100, y: 0, size: 100 },
        { id: '3', color: '#8b5cf6', x: 100, y: 100, size: 100 },
        { id: '4', color: '#f59e0b', x: 0, y: 100, size: 100 },
    ]);

    const meshStyle = generateMeshCSS(points, bgColor);

    const updatePoint = (id: string, updates: any) => {
        setPoints(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const handleExport8K = async () => {
        setIsRendering(true);
        await new Promise(r => setTimeout(r, 100));
        const canvas = document.createElement('canvas');
        canvas.width = 7680; canvas.height = 4320;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'hard-light';
        points.forEach(p => {
            const angle = Math.atan2(p.y - 50, p.x - 50);
            const x2 = canvas.width / 2 + Math.cos(angle) * canvas.width;
            const y2 = canvas.height / 2 + Math.sin(angle) * canvas.height;
            const gradient = ctx.createLinearGradient((p.x / 100) * canvas.width, (p.y / 100) * canvas.height, x2, y2);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        const link = document.createElement('a');
        link.download = `Lizard_Signal_8K_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        setIsRendering(false);
    };

    const copyCSS = () => {
        navigator.clipboard.writeText(`background-color: ${meshStyle.backgroundColor};\nbackground-image: ${meshStyle.backgroundImage};\nbackground-blend-mode: ${meshStyle.backgroundBlendMode};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-2xl mx-auto selection:bg-emerald-500 selection:text-black">
            <ToolHeader title="Mesh Engine" />

            {/* SYSTEM STATUS HUD */}
            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Synthesis Mode</span>
                        <span className="text-3xl font-black text-white tabular-nums tracking-tighter">
                            {isRendering ? "RENDERING" : "LIVE_FIELD"}
                        </span>
                    </div>
                    <Activity className={`w-6 h-6 ${isRendering ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
                </div>
            </div>

            {/* VISUAL FIELD - Workbench Style */}
            <div className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                <div className="border-b border-zinc-900 px-4 py-3 flex justify-between items-center bg-black/40">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-2">
                        <Zap size={12} /> Live_Synthesis
                    </span>
                    <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">7680 x 4320 Ready</span>
                </div>
                <div className="relative aspect-video sm:aspect-[21/9] w-full">
                    <div style={meshStyle as any} className="w-full h-full transition-all duration-700 ease-in-out" />
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    {/* Corners Aesthetic */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10" />
                </div>
            </div>

            {/* ACTION GRID */}
            <div className="grid grid-cols-2 gap-3 w-full">
                <button
                    onClick={copyCSS}
                    className="flex items-center justify-center gap-2 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95"
                >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? "COPIED" : "Copy_CSS"}
                </button>
                <button
                    onClick={handleExport8K}
                    disabled={isRendering}
                    className="flex items-center justify-center gap-2 py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 disabled:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                >
                    {isRendering ? <RefreshCcw size={14} className="animate-spin" /> : <Download size={14} />}
                    {isRendering ? "PROCESSING" : "Export_8K"}
                </button>
            </div>

            <div className="w-full space-y-4">
                {/* MASTER COLOR */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal size={14} className="text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Master_Void_Color</span>
                    </div>
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-6 bg-transparent border-none cursor-pointer"
                    />
                </div>

                {/* SIGNAL NODES */}
                <div className="space-y-3">
                    <AnimatePresence>
                        {points.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl group focus-within:border-emerald-500/30 transition-colors"
                            >
                                <div className="flex justify-between items-center mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-mono text-white uppercase tracking-tighter font-bold">Signal_Node_0{i + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input type="color" value={p.color} onChange={(e) => updatePoint(p.id, { color: e.target.value })} className="w-5 h-5 bg-transparent cursor-pointer" />
                                        {points.length > 1 && (
                                            <button onClick={() => setPoints(points.filter(pt => pt.id !== p.id))} className="text-zinc-700 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest font-bold">
                                            <span>Vector_X_Axis</span>
                                            <span className="text-emerald-500">{p.x}%</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={p.x} onChange={(e) => updatePoint(p.id, { x: parseInt(e.target.value) })} className="w-full accent-emerald-500 h-1 bg-zinc-900 appearance-none rounded-full cursor-pointer" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest font-bold">
                                            <span>Vector_Y_Axis</span>
                                            <span className="text-emerald-500">{p.y}%</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={p.y} onChange={(e) => updatePoint(p.id, { y: parseInt(e.target.value) })} className="w-full accent-emerald-500 h-1 bg-zinc-900 appearance-none rounded-full cursor-pointer" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* ADD NODE BUTTON */}
                <button
                    onClick={() => setPoints([...points, { id: Date.now().toString(), color: '#ffffff', x: 50, y: 50, size: 100 }])}
                    className="w-full py-5 border border-dashed border-zinc-800 text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/50 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 active:scale-95"
                >
                    <Plus size={14} /> Inject_Signal_Point
                </button>
            </div>

            {/* SYSTEM FOOTER */}
            <div className="w-full pt-8 border-t border-zinc-900 flex justify-between items-center opacity-30">
                <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter italic">Lizard.Mesh_Engine.v4 // Field_Synthesis</span>
                <ShieldCheck size={14} className="text-zinc-800" />
            </div>
        </Panel>
    );
}