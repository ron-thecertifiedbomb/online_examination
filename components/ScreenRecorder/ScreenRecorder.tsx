/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Circle, Square, Download, X, Video, Monitor, Radio, ShieldCheck, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

export default function ScreenRecorder() {
    const [recording, setRecording] = useState(false);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (recording) {
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setDuration(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [recording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: true,
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'video/webm; codecs=vp9'
            });
            recordedChunks.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) recordedChunks.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                setVideoURL(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            console.error(err);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    const downloadRecording = () => {
        if (!videoURL) return;
        const a = document.createElement("a");
        a.href = videoURL;
        a.download = `lizard-rec-${Date.now()}.webm`;
        a.click();
    };

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-xl mx-auto selection:bg-emerald-500 selection:text-black">
            <ToolHeader title="Capture Engine" />

            {/* STATUS HUD - Matches Unit Converter "Result" Area */}
            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">Capture Status</p>
                <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div className="flex items-baseline overflow-hidden">
                        <span className={`text-4xl font-black tabular-nums tracking-tighter ${recording ? 'text-red-500' : 'text-white'}`}>
                            {recording ? formatTime(duration) : "00:00"}
                        </span>
                        <span className="text-xl font-black text-zinc-500 ml-3 uppercase tracking-tighter">
                            {recording ? 'Recording' : 'Standby'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className={`w-4 h-4 ${recording ? 'text-red-500 animate-pulse' : 'text-zinc-800'}`} />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                            {recording ? 'Bitrate_Steady' : 'Source_Ready'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-6">
                {/* Visual Interface Panel */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                    {!videoURL && !recording ? (
                        <div className="flex flex-col items-center gap-4 text-zinc-800">
                            <Monitor size={48} strokeWidth={1} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Initialize Source</span>
                        </div>
                    ) : recording ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-red-500/20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                            </div>
                            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Active Encoding</span>
                        </div>
                    ) : (
                        <div className="w-full h-full relative group">
                            <video
                                className="w-full rounded-lg border border-zinc-800 aspect-video object-cover"
                                src={videoURL || undefined}
                                controls
                            />
                        </div>
                    )}
                </div>

                {/* Main Controls (Matching Metronome/Converter style) */}
                <div className="grid grid-cols-[1fr,auto] gap-4">
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="flex items-center justify-center gap-3 py-5 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all active:scale-95"
                        >
                            <Circle size={18} fill="currentColor" />
                            Ignite Stream
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex items-center justify-center gap-3 py-5 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-red-500 transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                        >
                            <Square size={18} fill="currentColor" />
                            Terminate
                        </button>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={downloadRecording}
                            disabled={!videoURL || recording}
                            className="px-6 bg-zinc-950 border border-zinc-900 rounded-2xl text-emerald-500 hover:text-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                            title="Download Buffer"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={() => setVideoURL(null)}
                            disabled={!videoURL || recording}
                            className="px-6 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-500 hover:text-red-500 disabled:opacity-20 transition-all"
                            title="Clear Buffer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-Header / Footer HUD */}
            <div className="w-full pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter italic">Lizard.Capture_Engine.v4 // web_stream</span>
                <ShieldCheck size={14} className="text-zinc-800" />
            </div>
        </Panel>
    );
}