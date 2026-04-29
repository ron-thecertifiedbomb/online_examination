/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Activity, Lock } from "lucide-react";
import React, { useRef } from "react";

export function NesConsole({
    canvasRef,
    status,
    onRomLoad,
}: {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    status: "idle" | "running" | "paused";
    onRomLoad?: (file: File) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onRomLoad) {
            onRomLoad(file);
        }
        // Reset input so same file can be uploaded again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-700">
            {/* Main Console Chassis */}
            <div className="relative rounded-[2rem] bg-zinc-900 p-2 md:p-4 shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]">

                {/* 1. HUD */}
                <div className="flex items-center justify-between px-4 py-3 bg-transparent">
                    <div className="flex items-center gap-3">
                        <div className={["h-1.5 w-1.5 rounded-full", status === "running" ? "bg-emerald-500 animate-pulse" : "bg-zinc-700"].join(" ")} />
                        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
                       {status === "idle" ? "OFFLINE" : "STABLE"}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5">
                            <Activity size={12} className={status === "running" ? "text-emerald-500" : "text-zinc-800"} />
                          
                        </div>
               
                    </div>
                </div>

                {/* 2. Internal Bezel */}
                <div className="relative overflow-hidden rounded-[0.8rem] bg-black p-1 shadow-[inset_0_0_20px_rgba(0,0,0,1)] ">

                    {/* Screen Area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            width={256}
                            height={240}
                            className={[
                                "h-full w-full pixel-perfect transition-opacity duration-500",
                                status === "idle" ? "opacity-0" : "opacity-100"
                            ].join(" ")}
                        />

                        {/* --- IMPORT BUTTON CENTER CANVAS --- */}
                        {status === "idle" && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center">
                                <label className="relative cursor-pointer group">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".nes"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <div className="px-6 py-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-all">
                                        PROVISION_NEW_ROM
                                    </div>
                                </label>
                            </div>
                        )}

                        {/* 3. Scanline layer */}
                        <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.08] scanlines" />

                        {/* 4. Subtle Vignette */}
                        <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]" />

                        {/* Pause State Overlay */}
                        {status === "paused" && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                <div className="border-y border-emerald-500/30 bg-black/40 w-full py-4 flex justify-center">
                                    <div className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase animate-pulse">
                                        &gt;&gt; PAUSED_SESSION &lt;&lt;
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Frame Detail */}
                <div className="mt-3 flex justify-center items-center gap-8 pb-2">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                    <div className={[
                        "h-1 w-12 rounded-full transition-all duration-1000",
                        status === "running" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" : "bg-zinc-800"
                    ].join(" ")} />
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                </div>
            </div>
        </div>
    );
}