/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Copy,
    Check,
    Trash2,
    Type,
    Hash,
    AlignLeft,
    ArrowUp,
    ArrowDown,
    Sparkles,
    FileText,
    Clock,
    Zap,
    Activity
} from "lucide-react";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

export function TextTools() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    // Stats Logic
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
    const paragraphs = text === "" ? 0 : text.split(/\n\s*\n/).length;
    const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Actions
    const handleAction = (fn: () => void) => {
        if (!text) return;
        fn();
    };

    const toUpperCase = () => setText(text.toUpperCase());
    const toLowerCase = () => setText(text.toLowerCase());
    const toTitleCase = () => {
        setText(text.replace(/\w\S*/g, (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ));
    };
    const removeExtraSpaces = () => {
        const fixed = text
            .split('\n')
            .map(line => line.replace(/[ \t]+/g, " ").trim())
            .join('\n');
        setText(fixed);
    };
    const removeLineBreaks = () => setText(text.replace(/\r?\n|\r/g, " "));

    const clearText = () => setText("");

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 text-zinc-300 font-sans">
            {/* Main Action Center */}
            <div className="space-y-4">
                <div className="relative group bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                    {/* Header Bar */}
                    <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                            <ToolHeader title="TEXT_TOOLS" icon={ <Activity className="w-5 h-5" text-emerald-500 />} />
                        <div className="flex items-center gap-1">
                            <button
                                onClick={copyToClipboard}
                                disabled={!text}
                                className="p-2 rounded-lg hover:bg-white/5 transition-all text-zinc-500 hover:text-emerald-500 disabled:opacity-30"
                                title="Copy Buffer"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <button
                                onClick={clearText}
                                disabled={!text}
                                className="p-2 rounded-lg hover:bg-red-500/10 transition-all text-zinc-500 hover:text-red-500 disabled:opacity-30"
                                title="Purge Buffer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Text Area */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="TERMINAL_READY: PASTE_DATA_HERE..."
                        className="w-full h-[320px] bg-transparent px-6 py-6 text-zinc-100 font-mono text-sm leading-relaxed focus:outline-none resize-none placeholder:text-zinc-800"
                    />

                    {/* Subtle Corner Accents */}
                    <div className="absolute bottom-2 right-2 p-1">
                        <Sparkles size={12} className="text-zinc-800" />
                    </div>
                </div>

                {/* Industrial Action Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <ActionButton icon={ArrowUp} label="UPPER" onClick={toUpperCase} disabled={!text} />
                    <ActionButton icon={ArrowDown} label="lower" onClick={toLowerCase} disabled={!text} />
                    <ActionButton icon={Type} label="Title" onClick={toTitleCase} disabled={!text} />
                    <ActionButton icon={AlignLeft} label="Fix_Spc" onClick={removeExtraSpaces} disabled={!text} />
                    <ActionButton icon={Hash} label="Linear" onClick={removeLineBreaks} disabled={!text} />
                </div>
            </div>

            {/* Sidebar Diagnostic Stats */}
            <aside className="space-y-4">
                <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <FileText size={30} />
                    </div>

                    <h3 className="text-[10px] font-mono tracking-[0.3em] text-zinc-600 mb-6 uppercase flex items-center gap-2">
                        <Zap size={12} className="text-emerald-500" /> core_diagnostics
                    </h3>

                    <div className="space-y-1">
                        <StatRow label="Words" value={words} />
                        <StatRow label="Characters" value={characters} />
                        <StatRow label="No_Spaces" value={charactersNoSpaces} />
                        <StatRow label="Lines" value={lines} />
                        <StatRow label="Paragraphs" value={paragraphs} />
                        <StatRow label="Sentences" value={sentences} />
                    </div>
                </div>

                {/* Efficiency Metric */}
                <div className="bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Processing_Time</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{Math.ceil(words / 200)}</span>
                        <span className="text-xs font-mono text-zinc-500 uppercase">Min_Read</span>
                    </div>
                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: text ? '100%' : '0%' }}
                            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                        />
                    </div>
                </div>
            </aside>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function ActionButton({ icon: Icon, label, onClick, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="
                flex items-center justify-center gap-2 px-3 py-3 
                bg-zinc-950 border border-white/5 rounded-xl 
                text-zinc-500 font-mono text-[10px] uppercase tracking-tighter
                hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5
                transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed
                group active:scale-95
            "
        >
            <Icon size={12} className="group-hover:scale-110 transition-transform" />
            {label}
        </button>
    );
}

function StatRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="group flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0">
            <span className="text-[11px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {label}
            </span>
            <span className="text-sm font-bold text-zinc-100 tabular-nums tracking-tighter">
                {value.toLocaleString()}
            </span>
        </div>
    );
}