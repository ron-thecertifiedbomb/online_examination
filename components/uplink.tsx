"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, Activity, Zap } from "lucide-react";

// 1. Define the TypeScript interface to fix the 'IntrinsicAttributes' error
interface UplinkProps {
    onComplete: () => void;
}

const TECHNICAL_LOGS = [
    "INITIALIZING_LIZARD_UPLINK_v1.0.4...",
    "MAPPING_WASM_VIRTUAL_MEMORY...",
    "ENABLING_HARDWARE_ACCELERATION...",
    "BUFFER_SYNC: 0.002ms LATENCY",
    "NEURAL_INTERFACE_OPERATIONAL",
    "UPLINK_STATUS: ACCESS_GRANTED"
];

const LogEntry = ({ text, delay }: { text: string; delay: number }) => (
    <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay, duration: 0.3 }}
        className="flex items-center gap-3 font-mono text-[10px] tracking-widest mb-2"
    >
        <span className="text-emerald-900 font-bold">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
        <span className="text-emerald-500/80">{text}</span>
    </motion.div>
);

export default function Uplink({ onComplete }: UplinkProps) {
    const [videoFinished, setVideoFinished] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                console.warn("Autoplay blocked. Awaiting user interaction.");
            });
        }
    }, []);

    const handleSequenceEnd = () => {
        setVideoFinished(true);
        // 1.2s delay to show the 'Success' state before the parent component swaps screens
        setTimeout(() => {
            onComplete();
        }, 1200);
    };

    return (
        <motion.div
            key="boot-sequence"
            exit={{
                opacity: 0,
                scale: 1.1,
                filter: "blur(40px)",
                transition: { duration: 0.8, ease: "circIn" }
            }}
            className="fixed inset-0 z-[999] bg-[#020202] flex flex-col items-center justify-center p-6 overflow-hidden"
        >
            {/* MAIN VIDEO MONITOR */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-4xl aspect-video border border-emerald-500/10 bg-black shadow-[0_0_100px_rgba(16,185,129,0.05)] overflow-hidden"
            >
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    onEnded={handleSequenceEnd}
                    className={`w-full h-full object-cover transition-all duration-700 ${videoFinished ? 'opacity-0 scale-110' : 'opacity-100'}`}
                >
                    <source src="/lizard-boot.mp4" type="video/mp4" />
                </video>

                {/* HUD OVERLAYS */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_3px]" />

                <AnimatePresence>
                    {videoFinished && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10"
                        >
                            <ShieldCheck className="w-20 h-20 text-emerald-500 mb-4 animate-pulse" />
                            <h2 className="text-emerald-500 font-mono text-xs tracking-[0.8em] uppercase ml-[0.8em]">Uplink_Confirmed</h2>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* LOWER HUD: TELEMETRY */}
            <div className="w-full max-w-4xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-1">
                    {TECHNICAL_LOGS.map((log, i) => (
                        <LogEntry key={i} text={log} delay={i * 0.3} />
                    ))}
                </div>
                <div className="hidden md:flex flex-col items-end gap-4 opacity-30">
                    <div className="flex gap-4 text-emerald-500">
                        <Cpu className="w-5 h-5" />
                        <Activity className="w-5 h-5" />
                        <Zap className="w-5 h-5" />
                    </div>
                    <p className="text-[8px] font-mono text-emerald-800 text-right uppercase tracking-[0.2em]">
                        Hardware_Acceleration: Active<br />
                        Lizard_Interactive_Systems // 2026
                    </p>
                </div>
            </div>
        </motion.div>
    );
}