/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Emulator } from "@/data/lists/emulatorList";
import Link from "next/link";

interface EmulatorGridProps {
    emulators: Emulator[];
}

export default function EmulatorGrid({ emulators }: EmulatorGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20 px-4">
            {emulators.map((emu) => {
                const isOffline = emu.status === "Offline";
                const isNES = emu.id === "nes"; // Only NES is fully operational
                const isDisabled = isOffline || !isNES;

                return (
                    <Link
                        key={emu.id}
                        href={isDisabled ? "#" : `/emulator/${emu.id}`}
                        className={[
                            "group relative block overflow-hidden border transition-all duration-700 p-8",
                            isDisabled
                                ? "border-zinc-900 bg-zinc-950/40 cursor-not-allowed opacity-40 grayscale"
                                : "border-white/5 bg-[#080808] hover:border-emerald-500/40 cursor-pointer shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        ].join(" ")}
                    >
                        {/* Background Hardware ID - Deeper dim for offline */}
                        <div className={[
                            "absolute -right-4 -top-6 font-black text-9xl transition-all duration-700 pointer-events-none uppercase italic select-none",
                            isDisabled ? "text-white/[0.01]" : "text-white/[0.02] group-hover:text-emerald-500/[0.05]"
                        ].join(" ")}>
                            {emu.system}
                        </div>

                        {/* STATIC OVERLAY: Only for locked systems */}
                        {isDisabled && (
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex gap-2">
                                    <span className={[
                                        "font-mono text-[9px] uppercase tracking-[0.2em] border px-2 py-1 transition-colors",
                                        isDisabled
                                            ? "text-zinc-700 border-zinc-900 bg-transparent"
                                            : "text-emerald-500/60 border-emerald-500/20 bg-emerald-500/5"
                                    ].join(" ")}>
                                        {emu.system}
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600 border border-zinc-800 px-2 py-1">
                                        {isDisabled ? "LOCKED" : emu.version}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isDisabled ? "RESTRICTED" : emu.status}
                                    </span>
                                    <div className={[
                                        "h-1.5 w-1.5 rounded-full transition-all duration-500",
                                        !isDisabled && emu.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-zinc-800'
                                    ].join(" ")} />
                                </div>
                            </div>

                            <h2 className={[
                                "text-3xl font-black uppercase tracking-tighter transition-colors duration-300",
                                isDisabled ? "text-zinc-800" : "text-white group-hover:text-emerald-400"
                            ].join(" ")}>
                                {emu.name}
                            </h2>

                            <p className={[
                                "mt-3 text-xs leading-relaxed max-w-sm font-light transition-colors",
                                isDisabled ? "text-zinc-800" : "text-zinc-500"
                            ].join(" ")}>
                                {isDisabled ? "System core offline. Decryption protocols pending authorization." : emu.desc}
                            </p>

                            <div className="mt-10 flex items-center gap-3">
                                <div className={[
                                    "h-[1px] transition-all duration-500",
                                    isDisabled ? "w-4 bg-zinc-900" : "w-8 bg-zinc-800 group-hover:w-16 group-hover:bg-emerald-500/50"
                                ].join(" ")} />
                                <span className={[
                                    "font-mono text-[9px] uppercase tracking-[0.4em] transition-colors",
                                    isDisabled ? "text-zinc-900" : "text-zinc-700 group-hover:text-white"
                                ].join(" ")}>
                                    {isDisabled ? "ACCESS_DENIED" : "Initialize_System"}
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}