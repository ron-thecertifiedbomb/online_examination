'use client';

import React, { useState } from "react";
import { Copy, Layers, Palette, Terminal, Check, Activity, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

type ShadowLayer = {
    id: string;
    visible: boolean;
    inset: boolean;
    hOffset: number;
    vOffset: number;
    blur: number;
    spread: number;
    r: number;
    g: number;
    b: number;
    a: number;
};

const PRESET_PALETTE = [
    { r: 16, g: 185, b: 129 }, // Emerald
    { r: 59, g: 130, b: 246 }, // Blue
    { r: 239, g: 68, b: 68 },  // Red
    { r: 245, g: 158, b: 11 }, // Amber
    { r: 168, g: 85, b: 247 }, // Purple
    { r: 255, g: 255, b: 255 }, // White
];

export default function BoxShadowGenerator() {
    const [shadows, setShadows] = useState<ShadowLayer[]>([
        {
            id: '1',
            visible: true,
            inset: false,
            hOffset: 10,
            vOffset: 10,
            blur: 20,
            spread: 0,
            r: 16,
            g: 185,
            b: 129,
            a: 0.4
        }
    ]);
    const [copied, setCopied] = useState(false);

    const rgbToHex = (r: number, g: number, b: number) =>
        "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

    const handleHexChange = (id: string, hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        updateShadow(id, { r, g, b });
    };

    const addShadow = () => {
        const newShadow: ShadowLayer = {
            id: Math.random().toString(36).substr(2, 9),
            visible: true,
            inset: false,
            hOffset: 0,
            vOffset: 10,
            blur: 20,
            spread: 0,
            r: 0,
            g: 0,
            b: 0,
            a: 0.2
        };
        setShadows([...shadows, newShadow]);
    };

    const removeShadow = (id: string) => {
        if (shadows.length > 1) {
            setShadows(shadows.filter(s => s.id !== id));
        }
    };

    const updateShadow = (id: string, updates: Partial<ShadowLayer>) => {
        setShadows(shadows.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const shadowString = shadows
        .filter(s => s.visible)
        .map(s => `${s.inset ? 'inset ' : ''}${s.hOffset}px ${s.vOffset}px ${s.blur}px ${s.spread}px rgba(${s.r}, ${s.g}, ${s.b}, ${s.a})`)
        .join(", ");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`box-shadow: ${shadowString || 'none'};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-md mx-auto border border-white/10 rounded-3xl bg-zinc-950/40 font-sans shadow-2xl overflow-hidden">

            {/* 1. FIXED VIEWPORT */}
            <div className="h-[340px] md:h-[380px] w-full border-b border-white/5 flex flex-col relative shrink-0">
                <div className="p-4">
                    <ToolHeader className="text-xs" title="Box Shadow Generator" icon={<Activity className="w-4 h-4 text-emerald-500" />} />
                </div>
                <div className="flex-1 flex items-center justify-center bg-black/40 m-4 mt-0 rounded-2xl border border-white/5 overflow-hidden">
                    <div
                        className="w-52 h-34 bg-white/80 rounded-lg transition-all duration-200"
                        style={{ boxShadow: shadowString }}
                    />
                </div>
            </div>

            {/* 2. SCROLLABLE CONTROLS */}
            <div className="h-[500px] overflow-y-auto bg-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none">
                <div className="p-6 space-y-8 pb-2">
{/* 
                    <button
                        onClick={addShadow}
                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20 py-4 rounded-xl hover:bg-emerald-500/5 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-3 h-3" /> New Shadow Layer
                    </button> */}

                    {shadows.map((sh, index) => (
                        <div key={sh.id} className={`space-y-8 p-6 border rounded-2xl transition-all ${sh.visible ? 'border-zinc-800 bg-zinc-900/20' : 'border-zinc-900/50 opacity-40'}`}>

                            {/* LAYER HEADER & TOGGLES */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => updateShadow(sh.id, { visible: !sh.visible })}
                                        className={`transition-colors ${sh.visible ? 'text-emerald-500' : 'text-zinc-700'}`}
                                    >
                                        {sh.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        Layer_{index + 1}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[8px] font-bold ${!sh.inset ? 'text-emerald-500' : 'text-zinc-600'}`}>OUTSET</span>
                                        <button
                                            onClick={() => updateShadow(sh.id, { inset: !sh.inset })}
                                            className="w-8 h-4 bg-zinc-800 rounded-full relative border border-white/5"
                                        >
                                            <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all duration-200 ${sh.inset ? 'left-[18px] bg-emerald-500' : 'left-1 bg-zinc-500'}`} />
                                        </button>
                                        <span className={`text-[8px] font-bold ${sh.inset ? 'text-emerald-500' : 'text-zinc-600'}`}>INSET</span>
                                    </div>

                                    {shadows.length > 1 && (
                                        <button onClick={() => removeShadow(sh.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* GEOMETRY */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                                <Range label="X_Offset" value={sh.hOffset} min={-100} max={100} onChange={(val: number) => updateShadow(sh.id, { hOffset: val })} unit="px" />
                                <Range label="Y_Offset" value={sh.vOffset} min={-100} max={100} onChange={(val: number) => updateShadow(sh.id, { vOffset: val })} unit="px" />
                                <Range label="Blur" value={sh.blur} min={0} max={200} onChange={(val: number) => updateShadow(sh.id, { blur: val })} unit="px" />
                                <Range label="Spread" value={sh.spread} min={-50} max={100} onChange={(val: number) => updateShadow(sh.id, { spread: val })} unit="px" />
                            </div>

                            {/* COLOR PALETTE & PICKER */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex gap-2">
                                    {PRESET_PALETTE.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => updateShadow(sh.id, { r: color.r, g: color.g, b: color.b })}
                                            className="w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                                        />
                                    ))}
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <span className="text-[8px] font-black text-zinc-500 group-hover:text-zinc-300">HEX</span>
                                    <div
                                        className="w-6 h-6 rounded-lg border border-white/20 relative overflow-hidden"
                                        style={{ backgroundColor: rgbToHex(sh.r, sh.g, sh.b) }}
                                    >
                                        <input
                                            type="color"
                                            value={rgbToHex(sh.r, sh.g, sh.b)}
                                            onChange={(e) => handleHexChange(sh.id, e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                                        />
                                    </div>
                                </label>
                            </div>

                            {/* CHROMA SLIDERS */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <Range label="R" value={sh.r} min={0} max={255} onChange={(val: number) => updateShadow(sh.id, { r: val })} />
                                <Range label="G" value={sh.g} min={0} max={255} onChange={(val: number) => updateShadow(sh.id, { g: val })} />
                                <Range label="B" value={sh.b} min={0} max={255} onChange={(val: number) => updateShadow(sh.id, { b: val })} />
                                <Range label="Alpha" value={Math.round(sh.a * 100)} min={0} max={100} onChange={(val: number) => updateShadow(sh.id, { a: val / 100 })} unit="%" />
                            </div>
                        </div>
                    ))}

                    {/* CODE EXPORT */}
                    <div className="bg-zinc- bg-zinc-900/20 border border-white/5 p-4 rounded-2xl relative group">
                        <div className="text-[8px] font-mono text-zinc-500 uppercase mb-3 tracking-[0.3em]">CSS_Output</div>
                        <code className="text-[11px] text-emerald-400 font-mono break-all block pr-12 leading-relaxed">
                            box-shadow: {shadowString || 'none'};
                        </code>
                        <button
                            onClick={copyToClipboard}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 transition-all rounded-xl border ${copied ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-black border-white/10 text-emerald-500 hover:border-emerald-500'}`}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="opacity-60 text-center py-10">
                        <p className="text-[8px] font-mono tracking-[0.5em] uppercase text-emerald-500">Lizard Interactive </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Range({ label, value, min, max, onChange, unit = "" }: any) {
    return (
        <label className="flex flex-col gap-3 group/range">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                    {label}
                </span>
                <span className="text-[10px] font-mono text-zinc-300">{value}{unit}</span>
            </div>
            <input
                type="range" min={min} max={max} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer accent-emerald-500 rounded-full"
            />
        </label>
    );
}
