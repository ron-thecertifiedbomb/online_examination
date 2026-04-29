/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import type { NesButton } from "@/lib/nes/input";
import { motion } from "framer-motion";

type Props = {
    onPress: (b: NesButton) => void;
    onRelease: (b: NesButton) => void;
};

export function NesMobileControls({ onPress, onRelease }: Props) {
    const joystickRef = useRef<HTMLDivElement>(null);
    const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
    const [activeDirs, setActiveDirs] = useState<Set<NesButton>>(new Set());

    const handleJoystickMove = (e: React.PointerEvent) => {
        if (!joystickRef.current) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxRadius = rect.width / 2;

        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        setStickPos({ x: dx, y: dy });

        // Threshold for diagonal detection (lowered for better sensitivity)
        const threshold = 8;
        const newDirs = new Set<NesButton>();

        // Check horizontal direction
        if (Math.abs(dx) > threshold) {
            if (dx > threshold) newDirs.add("RIGHT");
            else if (dx < -threshold) newDirs.add("LEFT");
        }

        // Check vertical direction
        if (Math.abs(dy) > threshold) {
            if (dy > threshold) newDirs.add("DOWN");
            else if (dy < -threshold) newDirs.add("UP");
        }

        // Release buttons that are no longer active
        for (const dir of activeDirs) {
            if (!newDirs.has(dir)) {
                onRelease(dir);
            }
        }

        // Press new buttons
        for (const dir of newDirs) {
            if (!activeDirs.has(dir)) {
                onPress(dir);
            }
        }

        setActiveDirs(newDirs);
    };

    const resetJoystick = () => {
        // Release all active directions
        for (const dir of activeDirs) {
            onRelease(dir);
        }
        setActiveDirs(new Set());
        setStickPos({ x: 0, y: 0 });
    };

    return (
        <div className="mt-8 w-full lg:hidden select-none touch-none pb-8 pl-9 pr-4">
            <div className="flex flex-col gap-8">

                {/* --- MAIN CONTROL DECK --- */}
                <div className="flex items-center justify-between ">

                    {/* LEFT: ANALOG STICK WITH LARGER TOGGLE CIRCLE */}
                    <div className="relative">
                        <div
                            ref={joystickRef}
                            onPointerMove={handleJoystickMove}
                            onPointerUp={resetJoystick}
                            onPointerLeave={resetJoystick}
                            className="w-24 h-24 rounded-full bg-zinc-950 border-2 border-zinc-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ x: stickPos.x, y: stickPos.y }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="w-20 h-20 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 border-2 border-zinc-600 shadow-xl z-10 flex items-center justify-center pointer-events-none"
                            >
                                <div className={`w-3 h-3 rounded-full transition-all duration-200 ${activeDirs.size > 0 ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`} />
                            </motion.div>
                        </div>

                    </div>

                    {/* RIGHT: ACTION BUTTONS WITH MODERATELY LARGER RED BUTTONS */}
                    <div className="relative  rounded-lg  flex flex-col gap-1 shadow-inner">
                        <div className="flex items-center gap-3">
                            {/* BUTTON B - MODERATELY LARGER */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onPointerDown={() => onPress("B")}
                                    onPointerUp={() => onRelease("B")}
                                    className="w-17 h-17 rounded-full bg-[#8b1d1d] border-b-[4px] border-black active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-black/50 font-black text-lg shadow-md"
                                >
                                    B
                                </button>
                            </div>

                            {/* BUTTON A - MODERATELY LARGER */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onPointerDown={() => onPress("A")}
                                    onPointerUp={() => onRelease("A")}
                                    className="w-17 h-17 rounded-full bg-[#8b1d1d] border-b-[4px] border-black active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-black/50 font-black text-lg shadow-md"
                                >
                                    A
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CENTER SYSTEM CONTROLS (Slimmer) --- */}
                <div className="flex justify-center items-center gap-3 py-4 border-y border-zinc-900/30">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onPointerDown={() => onPress("SELECT")}
                            onPointerUp={() => onRelease("SELECT")}
                            className="w-16 h-4 bg-zinc-900 border border-zinc-800 rounded-full active:bg-zinc-700 transition-colors"
                        />
                        <span className="text-[6px] font-black text-rose-900/60 tracking-widest uppercase">Select</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <button
                            onPointerDown={() => onPress("START")}
                            onPointerUp={() => onRelease("START")}
                            className="w-16 h-4 bg-zinc-900 border border-zinc-800 rounded-full active:bg-zinc-700 transition-colors"
                        />
                        <span className="text-[6px] font-black text-rose-900/60 tracking-widest uppercase">Start</span>
                    </div>
                </div>

                <div className="text-center ">
                    <span className="text-[6px] font-mono tracking-[0.8em] text-emerald-500">LIZARD INTERACTIVE ONLINE</span>
                </div>
            </div>
        </div>
    );
}