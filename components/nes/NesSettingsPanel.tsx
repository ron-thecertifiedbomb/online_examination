/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { NesKeymapEditor } from "@/components/nes/NesKeymapEditor";
import type { Slot } from "@/lib/storage/nesSaveStateStore";
import { hasNesSaveState } from "@/lib/storage/nesSaveStateStore";
import type { NesButton } from "@/lib/nes/input";
import type { Keymap } from "@/lib/hooks/useKeymap";
import {
    X,
    Save,
    Download,
    Upload,
    Zap,
    Keyboard,
    Info,
    Database
} from "lucide-react";

export function NesSettingsPanel({
    show,
    open,
    onClose,
    canInteract,
    romHash,
    saveVersion,
    onSave,
    onLoad,
    onExportSave,
    onImportSave,
    autoSaveEnabled,
    setAutoSaveEnabled,
    autoSaveSlot,
    setAutoSaveSlot,
    keymap,
    onSetKey,
    onResetKeymap,
}: {
    show: boolean;
    open: boolean;
    onClose: () => void;
    canInteract: boolean;
    romHash: string;
    saveVersion: number;
    onSave: (s: Slot) => void;
    onLoad: (s: Slot) => void;
    onExportSave: (s: Slot) => void;
    onImportSave: (s: Slot, file: File) => void;
    autoSaveEnabled: boolean;
    setAutoSaveEnabled: (v: boolean) => void;
    autoSaveSlot: Slot;
    setAutoSaveSlot: (s: Slot) => void;
    keymap: Keymap<NesButton>;
    onSetKey: (code: string, button: NesButton) => void;
    onResetKeymap: () => void;
}) {
    const importRefs = useRef<Record<number, HTMLInputElement | null>>({});
    const [slotStatus, setSlotStatus] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!show || !romHash) {
            setSlotStatus({});
            return;
        }
        let cancelled = false;
        (async () => {
            const results: Record<number, boolean> = {};
            for (const s of [1, 2, 3] as Slot[]) {
                results[s] = await hasNesSaveState(romHash, s);
            }
            if (!cancelled) setSlotStatus(results);
        })();
        return () => { cancelled = true; };
    }, [show, romHash, saveVersion]);

    if (!show) return null;

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-2 mb-4">
            <Icon size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{title}</span>
            <div className="h-[1px] flex-1 bg-zinc-800" />
        </div>
    );

    return (
        <>
            <div
                className={[
                    "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0",
                ].join(" ")}
                onClick={onClose}
            />
            <div
                className={[
                    "fixed right-0 top-0 z-50 h-full w-[400px] max-w-[95vw] bg-zinc-950 p-0 shadow-2xl overflow-y-auto border-l border-zinc-800",
                    "transition-transform duration-300 ease-out will-change-transform",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        <h2 className="text-sm font-black uppercase tracking-tighter text-white">System_Configuration</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"
                        type="button"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-10">
                    {/* Tips Section */}
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                            <Info size={14} />
                            <span className="text-[10px] font-black uppercase">Technical_Brief</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-blue-200/70 font-mono">
                            &gt; Gamepads auto-detected via HID interface.<br />
                            &gt; Rebinding keys updates local storage immediately.
                        </p>
                    </div>

                    {/* Auto Save Section */}
                    <section>
                        <SectionHeader icon={Zap} title="Persistence_Engine" />
                        <div className="space-y-4">
                            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-white">Auto-Save on Exit</span>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">Snapshots state to local DB</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-zinc-800 bg-black text-emerald-500 focus:ring-0 focus:ring-offset-0"
                                    checked={autoSaveEnabled}
                                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                                />
                            </label>

                            <div className="flex items-center gap-3 p-1 bg-black rounded-lg border border-zinc-800">
                                <div className="px-3 text-[10px] font-bold text-zinc-500 uppercase">Target_Slot</div>
                                {([1, 2, 3] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setAutoSaveSlot(s)}
                                        disabled={!autoSaveEnabled}
                                        className={[
                                            "flex-1 rounded-md py-2 text-xs font-black transition-all disabled:opacity-20",
                                            s === autoSaveSlot ? "bg-emerald-500 text-black shadow-lg" : "text-zinc-400 hover:text-white",
                                        ].join(" ")}
                                    >{s}</button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Save/Load Section */}
                    <section>
                        <SectionHeader icon={Database} title="Memory_Bank" />
                        <div className="space-y-3">
                            {([1, 2, 3] as const).map((s) => {
                                const has = !!romHash && !!slotStatus[s];
                                return (
                                    <div key={s} className="rounded-xl border border-zinc-800 bg-black p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-[11px] font-black text-white uppercase tracking-widest">Bank_0{s}</div>
                                            <div className={[
                                                "flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                                has ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-zinc-800 text-zinc-600 bg-zinc-900/30"
                                            ].join(" ")}>
                                                {has ? "Online" : "Void"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => onSave(s)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-zinc-100 py-2.5 text-[10px] font-black uppercase tracking-tighter text-black hover:bg-emerald-500 transition-colors disabled:opacity-10"
                                                disabled={!canInteract}
                                                type="button"
                                            >
                                                <Save size={14} /> Commit
                                            </button>
                                            <button
                                                onClick={() => onLoad(s)}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 py-2.5 text-[10px] font-black uppercase tracking-tighter text-white hover:bg-zinc-800 transition-colors disabled:opacity-10"
                                                disabled={!canInteract || !has}
                                                type="button"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => onExportSave(s)}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2 text-[9px] font-bold text-zinc-400 hover:text-white transition-colors disabled:opacity-10"
                                                disabled={!has}
                                                type="button"
                                            >
                                                <Download size={12} /> Export
                                            </button>
                                            <button
                                                onClick={() => importRefs.current[s]?.click()}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2 text-[9px] font-bold text-zinc-400 hover:text-white transition-colors disabled:opacity-10"
                                                disabled={!romHash}
                                                type="button"
                                            >
                                                <Upload size={12} /> Import
                                            </button>
                                            <input
                                                ref={(el) => { importRefs.current[s] = el; }}
                                                type="file"
                                                accept=".sav,.savestate,.state,.json"
                                                className="hidden"
                                                onChange={(e) => { const file = e.target.files?.[0]; if (file) onImportSave(s, file); e.target.value = ""; }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Keyboard Controls */}
                    <section className="pb-10">
                        <SectionHeader icon={Keyboard} title="Input_Mapping" />
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                            <NesKeymapEditor keymap={keymap} onSetKey={onSetKey} onReset={onResetKeymap} />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}