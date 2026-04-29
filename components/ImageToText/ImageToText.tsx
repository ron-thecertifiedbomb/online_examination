/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { toast } from "react-hot-toast";
import { Upload, X, Cpu, Copy, Check, FileText, Scan, Activity, ShieldCheck, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

export default function ImageToTextConverter() {
    const [image, setImage] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setImage(file);
        setText("");
        setProgress(0);
    };

    const handleConvert = async () => {
        if (!image) return toast.error("SOURCE_ERROR: No image selected");
        setLoading(true);
        setProgress(0);
        setText("");

        try {
            const result = await Tesseract.recognize(image, "eng", {
                logger: (m) => {
                    if (m.status === "recognizing text") {
                        setProgress(Math.floor(m.progress * 100));
                    }
                },
            });
            setText(result.data.text);
            toast.success("DATA_SYNC: Extraction complete");
        } catch (error) {
            console.error(error);
            toast.error("RUNTIME_ERROR: Extraction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-2xl mx-auto selection:bg-emerald-500 selection:text-black">
            <ToolHeader title="OCR Engine" />

            {/* STATUS HUD - Matches Unit Converter Result Area */}
            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">Recognition Status</p>
                <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div className="flex items-baseline overflow-hidden">
                        <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                            {loading ? `${progress}%` : text ? "100%" : "0%"}
                        </span>
                        <span className="text-xl font-black text-zinc-500 ml-3 uppercase tracking-tighter">
                            {loading ? 'Processing' : text ? 'Complete' : 'Ready'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className={`w-4 h-4 ${loading ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                            {loading ? 'Neural_Sync_Active' : 'Engine_Standby'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-6">
                {/* SOURCE INTERFACE (Dropzone/Preview) */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden relative">
                    <div className="border-b border-zinc-900 px-4 py-3 flex justify-between items-center bg-black/40">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-2">
                            <Scan size={12} /> Image_Buffer
                        </span>
                        {image && (
                            <button
                                onClick={() => { setImage(null); setText(""); }}
                                className="text-[8px] font-mono text-zinc-700 hover:text-red-500 uppercase flex items-center gap-1 transition-colors"
                            >
                                <X size={10} /> Wipe_Source
                            </button>
                        )}
                    </div>

                    <div className="p-4">
                        {!image ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                                onDragOver={(e) => e.preventDefault()}
                                className="h-64 border-2 border-dashed border-zinc-900 hover:border-emerald-500/30 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group/drop"
                            >
                                <Upload className="w-10 h-10 text-zinc-800 group-hover/drop:text-emerald-500 transition-colors" />
                                <span className="text-[10px] tracking-[0.3em] font-black uppercase text-zinc-600 group-hover/drop:text-white">Initialize_Source_Upload</span>
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-zinc-900 bg-black flex items-center justify-center h-64">
                                <img src={URL.createObjectURL(image)} alt="Buffer" className="max-h-full object-contain" />
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" />
                </div>

                {/* PROGRESS BAR (Mobile First) */}
                {loading && (
                    <div className="w-full space-y-2 px-2">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* ACTION TRIGGER */}
                {!text && (
                    <button
                        onClick={handleConvert}
                        disabled={loading || !image}
                        className={`w-full py-5 text-xs font-black uppercase tracking-[0.3em] transition-all rounded-2xl flex items-center justify-center gap-3 active:scale-95
                            ${image && !loading
                                ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/10"
                                : "bg-zinc-950 border border-zinc-900 text-zinc-700 cursor-not-allowed"}`}
                    >
                        {loading ? <RefreshCcw size={18} className="animate-spin" /> : <FileText size={18} />}
                        {loading ? `PARSING_DATA...` : "Execute_Extraction"}
                    </button>
                )}

                {/* OUTPUT TERMINAL */}
                <AnimatePresence>
                    {text && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                                <div className="border-b border-zinc-900 px-4 py-2 flex justify-between items-center bg-black/40">
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Output_Buffer</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(text);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="flex items-center gap-2 text-[8px] font-mono text-emerald-500 uppercase hover:text-white transition-colors"
                                    >
                                        {copied ? <Check size={10} /> : <Copy size={10} />}
                                        {copied ? 'Data_Synced' : 'Copy_to_Clipboard'}
                                    </button>
                                </div>
                                <textarea
                                    readOnly
                                    value={text}
                                    className="w-full h-64 bg-transparent p-6 font-mono text-xs sm:text-sm text-zinc-400 outline-none resize-none leading-relaxed custom-scrollbar"
                                />
                            </div>
                            <button
                                onClick={() => { setImage(null); setText(""); }}
                                className="w-full py-4 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                            >
                                Clear Session
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ENGINE FOOTER HUD */}
            <div className="w-full pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter italic">Lizard.OCR_Module.v2 // Neural_Extract</span>
                <ShieldCheck size={14} className="text-zinc-800" />
            </div>
        </Panel>
    );
}