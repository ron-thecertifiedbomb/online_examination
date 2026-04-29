/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createJsnesCore, type NesCore } from "@/lib/nes/core-adapter";
import { useKeyboardInput } from "@/lib/hooks/useKeyboardInput";
import { useGamepadInput } from "@/lib/hooks/useGamepadInput";
import { useKeymap } from "@/lib/hooks/useKeymap";
import { useNesAutoSaveOnClose } from "@/lib/hooks/useNesAutoSaveOnClose";
import type { NesButton } from "@/lib/nes/input";
import { defaultNesKeymap } from "@/lib/nes/input";
import { defaultNesGamepadMapping } from "@/lib/nes/gamepad";
import type { Slot } from "@/lib/storage/nesSaveStateStore";

import { NesConsole } from "@/components/nes/NesConsole";
import { NesMobileControls } from "@/components/nes/MobileControls";
import { NesSettingsPanel } from "@/components/nes/NesSettingsPanel";
import { ConfirmDialog } from "@/components/nes/ConfirmDialog";
import { NesRomLibrary } from "@/components/nes/NesRomLibrary";
import Link from "next/link";
import Image from "next/image";
import {
    Cpu,
    Gamepad2,
    Settings,
    Library,
    Power,
    RefreshCcw,
    Maximize,
    Camera,
    Square,
    Volume2,
    VolumeX,
    EyeOff,
    Eye,
    ChevronLeft,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Keyboard
} from "lucide-react";

import {
    getNesRomBytes,
    touchNesLastPlayed,
    setNesCoverArt,
    upsertNesRomEntry,
    putNesRomBytes,
} from "@/lib/storage/nesRomStore";
import {
    putNesSaveState,
    getNesSaveState,
    putNesMeta,
} from "@/lib/storage/nesSaveStateStore";
import { hashRom } from "@/lib/hashRom";

type Tab = "emulator" | "library";

export default function NesPlayer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const coreRef = useRef<NesCore | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<Tab>("emulator");
    const [romName, setRomName] = useState("-");
    const [romHashState, setRomHashState] = useState("");
    const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
    const [message, setMessage] = useState("System standby. Awaiting ROM input.");

    const [gamepadInfo, setGamepadInfo] = useState("Disconnected");
    const [showSettings, setShowSettings] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showEjectConfirm, setShowEjectConfirm] = useState(false);

    const [audioEnabled, setAudioEnabled] = useState(true);
    const audioEnabledRef = useRef(true);

    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
    const [autoSaveSlot, setAutoSaveSlot] = useState<Slot>(1);
    const [saveVersion, setSaveVersion] = useState(0);
    const [menuHidden, setMenuHidden] = useState(false);

    useEffect(() => {
        audioEnabledRef.current = audioEnabled;
        coreRef.current?.setAudioEnabled?.(audioEnabled);
    }, [audioEnabled]);

    const { keymap, setKey: setKeymapKey, resetToDefaults: resetKeymap } = useKeymap<NesButton>("nes:keymap", defaultNesKeymap);

    useKeyboardInput(coreRef, keymap);
    useGamepadInput(coreRef, defaultNesGamepadMapping, setGamepadInfo);

    useNesAutoSaveOnClose({
        coreRef,
        romHash: romHashState,
        romName,
        enabled: autoSaveEnabled,
        slot: autoSaveSlot,
        setMessage,
        onSaveVersion: () => setSaveVersion((v) => v + 1),
    });

    useEffect(() => {
        const c = createJsnesCore();
        coreRef.current = c;
        const canvas = canvasRef.current;
        if (canvas) c.attachCanvas(canvas);
        c.setAudioEnabled?.(audioEnabledRef.current);
        setMessage("Core initialized. Insert cartridge.");

        return () => {
            c.pause();
            c.destroy();
        };
    }, []);

    const canInteract = useMemo(() => status !== "idle", [status]);

    async function onUpload(file: File | null) {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".nes")) {
            setMessage("Invalid file format. Provide .nes only.");
            return;
        }

        const buf = await file.arrayBuffer();
        const romBytes = new Uint8Array(buf);
        const romHash = await hashRom(romBytes);

        await putNesRomBytes(romHash, romBytes);
        upsertNesRomEntry({
            romHash,
            name: file.name,
            size: romBytes.length,
            addedAt: Date.now(),
            lastPlayedAt: Date.now(),
        });

        setRomName(file.name);
        setRomHashState(romHash);
        setMessage(`SUCCESS: ${file.name.slice(0, 20)}... loaded.`);

        try {
            coreRef.current?.loadRom(romBytes, file.name);
            setStatus(coreRef.current?.status ?? "running");
            coreRef.current?.setAudioEnabled?.(audioEnabledRef.current);
        } catch (err: any) {
            console.error(err);
            setMessage(`SYSTEM_ERR: ${err?.message ?? String(err)}`);
        }
    }

    function saveCoverArt() {
        if (!romHashState || !canvasRef.current) return;
        try {
            const url = canvasRef.current.toDataURL("image/png");
            setNesCoverArt(romHashState, url);
        } catch { /* ignore */ }
    }

    const loadRomFromLibrary = useCallback(
        async (romHash: string, name: string) => {
            saveCoverArt();
            const bytes = await getNesRomBytes(romHash);
            if (!bytes) { setMessage("ROM not found in library."); return; }

            setRomName(name);
            setRomHashState(romHash);
            touchNesLastPlayed(romHash);
            setTab("emulator");
            setMessage(`PROVISIONING: ${name}`);

            try {
                coreRef.current?.loadRom(bytes, name);
                setStatus(coreRef.current?.status ?? "running");
                coreRef.current?.setAudioEnabled?.(audioEnabledRef.current);
            } catch (err: any) {
                console.error(err);
                setMessage(`FAILED TO PROVISION: ${err?.message ?? String(err)}`);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [romHashState],
    );

    function onToggleRun() {
        const c = coreRef.current;
        if (!c) return;
        if (c.status === "running") {
            c.pause();
            setStatus("paused");
            setMessage("PAUSED.");
        } else {
            c.start();
            setStatus("running");
            setMessage("ACTIVE_STREAM.");
        }
    }

    function onReset() {
        const c = coreRef.current;
        if (!c) return;
        c.reset();
        setStatus(c.status);
        setMessage("SYSTEM_REBOOT_COMPLETE.");
    }

    function onEject() {
        const c = coreRef.current;
        if (!c) return;
        saveCoverArt();
        c.pause();
        c.setAudioEnabled?.(false);
        setStatus("idle");
        setRomName("-");
        setRomHashState("");
        setMessage("CARTRIDGE_EJECTED. System standby.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) { ctx.fillStyle = "#000"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        }
    }

    async function onSave(slot: Slot) {
        if (!coreRef.current || !romHashState) { setMessage("LOAD_ROM_FIRST."); return; }
        const data = coreRef.current.saveState();
        if (!data) { setMessage("SAVE_INTERRUPTED."); return; }
        await putNesSaveState(romHashState, slot, data);
        await putNesMeta({ romHash: romHashState, romName, updatedAt: Date.now(), lastSlot: slot });
        setSaveVersion((v) => v + 1);
        setMessage(`STATE_STORED_SLOT_${slot}`);
    }

    async function onLoad(slot: Slot) {
        if (!coreRef.current || !romHashState) { setMessage("LOAD_ROM_FIRST."); return; }
        const data = await getNesSaveState(romHashState, slot);
        if (!data) { setMessage(`SLOT_${slot}_EMPTY.`); return; }
        coreRef.current.loadState(data);
        setMessage(`STATE_RESTORED_SLOT_${slot}`);
    }

    async function onExportSave(slot: Slot) {
        if (!romHashState) return;
        const data = await getNesSaveState(romHashState, slot);
        if (!data) { setMessage(`EXPORT_ERR: SLOT_${slot}_EMPTY.`); return; }
        const blob = new Blob([data], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${romName.replace(/\.[^/.]+$/, "")}_slot${slot}.sav`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    async function onImportSave(slot: Slot, file: File) {
        if (!romHashState) return;
        try {
            const text = await file.text();
            JSON.parse(text);
            await putNesSaveState(romHashState, slot, text);
            await putNesMeta({ romHash: romHashState, romName, updatedAt: Date.now(), lastSlot: slot });
            setSaveVersion((v) => v + 1);
            setMessage("IMPORT_SUCCESS.");
        } catch {
            setMessage("IMPORT_FAILED: INVALID_DATA.");
        }
    }

    function onFullscreen() { canvasRef.current?.requestFullscreen?.(); }

    function onScreenshot() {
        const c = canvasRef.current;
        if (!c) return;
        const url = c.toDataURL("image/png");
        if (romHashState) setNesCoverArt(romHashState, url);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${romName.replace(/\.[^/.]+$/, "") || "screenshot"}.png`;
        a.click();
    }

    function openSettings() {
        setShowSettings(true);
        requestAnimationFrame(() => setSettingsOpen(true));
    }

    function closeSettings() {
        setSettingsOpen(false);
        window.setTimeout(() => setShowSettings(false), 220);
    }

    useEffect(() => {
        if (!showSettings) return;
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closeSettings(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSettings]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "F2") {
                e.preventDefault();
                setMenuHidden((h) => !h);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function press(btn: NesButton) { coreRef.current?.press(btn); }
    function release(btn: NesButton) { coreRef.current?.release(btn); }

    return (
        <div className={[
            "mx-auto w-full max-w-5xl transition-all duration-700 p-2",
            menuHidden ? "flex min-h-screen flex-col items-center  bg-black" : ""
        ].join(" ")}>
            <button
                onClick={() => setMenuHidden((h) => !h)}
                className="fixed right-7 top-5 z-50 rounded-full border bg-zinc-950/80 backdrop-blur-md border-zinc-800 p-2 text-zinc-400 shadow-2xl hover:text-emerald-500 hover:border-emerald-500/50 transition-all active:scale-95"
                aria-label="Toggle HUD"
            >
                {menuHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            <div className={[
                "mb-2 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between",
                menuHidden ? "hidden" : "animate-in fade-in slide-in-from-top-4 duration-500",
            ].join(" ")}>
                <div className="flex items-center gap-4">
                    <div className="p-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <Image
                            src="/lizardinteractive.png"
                            alt="Logo"
                            width={28}
                            height={28}
                            className="rounded-full"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-[4.2vw] sm:text-2xl font-black uppercase tracking-tighter text-white leading-[0.9] drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
                            LIZARD INTERACTIVE ONLINE
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:mr-15 lg:mr-0">
                    <Link href="/" className="group flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:border-zinc-700 transition">
                        <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full">
                        <Gamepad2 size={12} className={gamepadInfo !== "Disconnected" ? "text-emerald-500" : "text-zinc-600"} />
                        <span className="text-[10px] font-mono uppercase text-zinc-500">{gamepadInfo}</span>
                    </div>
                    <button onClick={openSettings} className="rounded-full bg-emerald-500 p-2.5 text-black hover:rotate-90 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            <div className={[
                "mb-4 flex p-1 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-sm",
                menuHidden ? "hidden" : "animate-in fade-in duration-700",
            ].join(" ")}>
                {(["emulator", "library"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={[
                            "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.1em] transition-all",
                            tab === t ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400",
                        ].join(" ")}
                    >
                        {t === "emulator" ? <Power size={14} /> : <Library size={14} />}
                        {t}
                    </button>
                ))}
            </div>

            <div className={tab !== "emulator" ? "hidden" : "w-full space-y-2"}>
                <div className={[
                    "flex flex-wrap items-center justify-between gap-4 p-2 bg-zinc-950 border border-zinc-900 rounded-2xl",
                    menuHidden ? "hidden" : "animate-in slide-in-from-left-4 duration-500",
                ].join(" ")}>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className={[
                                "h-3 w-3 rounded-full",
                                status === "running" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"
                                    : status === "paused" ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                                        : "bg-zinc-800",
                            ].join(" ")} />
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-[10px] font-mono uppercase text-zinc-500">Active_Cartridge</div>
                            <div className="text-xs font-black uppercase text-white truncate max-w-[200px]">{romName !== "-" ? romName : "NO_DATA"}</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`p-2 rounded-lg border transition-all ${audioEnabled ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-zinc-800 text-zinc-500'}`}
                            title="Toggle Audio"
                        >
                            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>
                        <div className="h-8 w-[1px] bg-zinc-900 mx-1 hidden sm:block" />
                        <button onClick={onToggleRun} disabled={status === "idle"} className="px-6 py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors disabled:opacity-20">
                            {status === "running" ? "PAUSE_SYSTEM" : "BOOT_STREAM"}
                        </button>
                        <button onClick={onReset} disabled={status === "idle"} className="p-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-20">
                            <RefreshCcw size={16} />
                        </button>
                        <button
                            onClick={() => setShowEjectConfirm(true)}
                            disabled={status === "idle"}
                            className={[
                                "p-2.5 rounded-xl border transition-all disabled:opacity-20",
                                status !== "idle"
                                    ? "border-rose-500/40 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                                    : "border-zinc-800 text-zinc-500"
                            ].join(" ")}
                        >
                            <Square size={16} fill="currentColor" />
                        </button>
                        <div className="h-8 w-[1px] bg-zinc-900 mx-1 hidden sm:block" />
                        <button onClick={onScreenshot} disabled={status === "idle"} className="p-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-all disabled:opacity-20">
                            <Camera size={16} />
                        </button>
                        <button onClick={onFullscreen} disabled={status === "idle"} className="p-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-all disabled:opacity-20">
                            <Maximize size={16} />
                        </button>
                    </div>
                </div>

                <div className="relative group">
                    <div className="relative p-1 shadow-2xl overflow-hidden">
                        <NesConsole
                            canvasRef={canvasRef}
                            status={status}
                            onRomLoad={onUpload}
                        />
                    </div>
                </div>

                {/* KILLER UI - KEYBOARD CONTROLS INFO BAR (Hidden on mobile & tablet) */}
                <div className="hidden md:block mt-4 w-full">
                    <div className="bg-gradient-to-r from-zinc-950/50 via-zinc-900/30 to-zinc-950/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 p-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            {/* Left Section - Keyboard Controls */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Keyboard size={14} className="text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">KEYBOARD</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Arrow Keys */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex gap-1">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                                <ArrowUp size={12} className="text-zinc-400" />
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                                <ArrowLeft size={12} className="text-zinc-400" />
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                                <ArrowDown size={12} className="text-zinc-400" />
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                                <ArrowRight size={12} className="text-zinc-400" />
                                            </div>
                                        </div>
                                        <span className="text-[7px] font-mono text-zinc-600 mt-1">MOVEMENT</span>
                                    </div>

                                    {/* Action Keys */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-900/80 to-red-950 border border-red-800/50 flex items-center justify-center shadow-lg">
                                                <span className="text-sm font-black text-red-300">Z</span>
                                            </div>
                                            <span className="text-[7px] font-mono text-zinc-600"> A BUTTON</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-900/80 to-red-950 border border-red-800/50 flex items-center justify-center shadow-lg">
                                                <span className="text-sm font-black text-red-300">X</span>
                                            </div>
                                            <span className="text-[7px] font-mono text-zinc-600">B BUTTON</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - System Keys */}
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-12 h-6 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                        <span className="text-[8px] font-mono font-bold text-zinc-500">ENTER</span>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600">START</span>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-12 h-6 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                        <span className="text-[8px] font-mono font-bold text-zinc-500">R-SHIFT</span>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600">SELECT</span>
                                </div>

                                <div className="w-px h-8 bg-zinc-800/50" />

                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-6 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                                        <span className="text-[8px] font-mono font-bold text-zinc-500">R</span>
                                    </div>
                                    <span className="text-[7px] font-mono text-zinc-600">RESET</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NesMobileControls onPress={press} onRelease={release} />
            </div>

            {tab === "library" && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <NesRomLibrary onPlay={loadRomFromLibrary} />
                </div>
            )}

            <NesSettingsPanel
                show={showSettings}
                open={settingsOpen}
                onClose={closeSettings}
                canInteract={canInteract}
                romHash={romHashState}
                saveVersion={saveVersion}
                onSave={onSave}
                onLoad={onLoad}
                onExportSave={onExportSave}
                onImportSave={onImportSave}
                autoSaveEnabled={autoSaveEnabled}
                setAutoSaveEnabled={setAutoSaveEnabled}
                autoSaveSlot={autoSaveSlot}
                setAutoSaveSlot={setAutoSaveSlot}
                keymap={keymap}
                onSetKey={setKeymapKey}
                onResetKeymap={resetKeymap}
            />

            <ConfirmDialog
                open={showEjectConfirm}
                title="EMERGENCY_EJECT"
                message={`CRITICAL: Terminate current session for "${romName}"? Unsaved data will be lost.`}
                confirmLabel="TERMINATE_SESSION"
                danger
                onConfirm={() => { setShowEjectConfirm(false); onEject(); }}
                onCancel={() => setShowEjectConfirm(false)}
            />
        </div>
    );
}