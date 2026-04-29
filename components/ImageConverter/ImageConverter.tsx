/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
    Upload,
    Download,
    Trash2,
    RefreshCw,
    Image as ImageIcon,
    FileImage,
    AlertCircle,
    Activity,
    Edit3,
    RotateCcw
} from "lucide-react";
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

export function ImageConverter() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [convertedImage, setConvertedImage] = useState<string | null>(null);
    const [format, setFormat] = useState<"png" | "jpeg" | "webp" | "bmp">("png");
    const [quality, setQuality] = useState(0.9);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");
    const [newName, setNewName] = useState(""); // RENAME STATE
    const fileInputRef = useRef<HTMLInputElement>(null);

    const conversions = [
        { id: "png", label: "PNG" },
        { id: "jpeg", label: "JPEG" },
        { id: "webp", label: "WEBP" },
        { id: "bmp", label: "BMP" },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("INVALID_FILE_TYPE // SOURCE_REJECTED");
            return;
        }

        setError("");
        const rawName = file.name.replace(/\.[^/.]+$/, ""); // Strip extension
        setFileName(rawName);
        setNewName(rawName); // Set initial rename value
        setConvertedImage(null);

        const reader = new FileReader();
        reader.onload = (event) => setOriginalImage(event.target?.result as string);
        reader.readAsDataURL(file);
    };

    const convertImage = async () => {
        if (!originalImage) return;
        setLoading(true);
        setError("");

        try {
            const img = new Image();
            img.src = originalImage;
            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("CANVAS_CTX_FAIL");

            ctx.drawImage(img, 0, 0);
            const mimeType = format === "jpeg" ? "image/jpeg" : `image/${format}`;
            const convertedDataUrl = canvas.toDataURL(mimeType, quality);
            setConvertedImage(convertedDataUrl);
        } catch (err) {
            setError("CONVERSION_FAILED // RETRY_SOURCE");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (!convertedImage) return;
        const link = document.createElement("a");
        const extension = format === "jpeg" ? "jpg" : format;
        // Use newName or fallback to original fileName
        const finalName = (newName.trim() || fileName || "lizard_export") + "." + extension;
        link.download = finalName;
        link.href = convertedImage;
        link.click();
    };

    const getFileSize = (base64: string) => ((base64.length * 0.75) / 1024 / 1024).toFixed(2);

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-xl mx-auto">
            <ToolHeader title="Image Transformer" />

            {/* STATUS HUD */}
            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">Process Status</p>
                <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div className="flex items-baseline overflow-hidden">
                        <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                            {convertedImage ? getFileSize(convertedImage) : originalImage ? getFileSize(originalImage) : "0.00"}
                        </span>
                        <span className="text-xl font-black text-zinc-500 ml-2 uppercase tracking-tighter">MB</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className={`w-4 h-4 ${loading ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                            {loading ? 'Processing...' : convertedImage ? 'Output_Ready' : originalImage ? 'Source_Loaded' : 'Waiting_Input'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-6">
                {/* Upload Area */}
                {!originalImage ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-zinc-950 border-2 border-dashed border-zinc-900 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-500/30 transition-all group"
                    >
                        <Upload size={40} className="mx-auto text-zinc-800 group-hover:text-emerald-500 transition-colors mb-4" />
                        <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Select Source Image</span>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                ) : (
                    <>
                        {/* RENAME INPUT - Match Unit Converter Field Style */}
                        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                            <div className="border-b border-zinc-900 px-4 py-2 flex justify-between items-center">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Edit3 size={12} /> Rename Export
                                </span>
                                <button
                                    onClick={() => setNewName(fileName)}
                                    className="text-[8px] font-mono text-zinc-700 hover:text-emerald-500 uppercase flex items-center gap-1"
                                >
                                    <RotateCcw size={10} /> Reset
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Enter filename..."
                                className="w-full bg-transparent px-4 py-4 text-white font-mono text-lg focus:outline-none"
                            />
                        </div>

                        {/* Preview Area */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-2 text-center">
                                <div className="text-[8px] font-mono text-zinc-600 mb-2 uppercase">Original_Source</div>
                                <img src={originalImage} className="w-full h-40 object-contain rounded-lg bg-black/50 mx-auto" alt="original" />
                            </div>
                            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-2 text-center">
                                <div className="text-[8px] font-mono text-zinc-600 mb-2 uppercase">Converted_Output</div>
                                {convertedImage ? (
                                    <img src={convertedImage} className="w-full h-40 object-contain rounded-lg bg-black/50 animate-in fade-in duration-500 mx-auto" alt="converted" />
                                ) : (
                                    <div className="w-full h-40 flex items-center justify-center text-zinc-800 font-mono text-[10px]">AWAITING_RENDER</div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Format Selection */}
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {conversions.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setFormat(conv.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${format === conv.id
                                    ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20"
                                    : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <span className="text-[10px] uppercase font-black tracking-widest">{conv.label}</span>
                        </button>
                    ))}
                </div>

                {/* Quality Slider */}
                {(format === "jpeg" || format === "webp") && (
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Compression Quality</span>
                            <span className="text-[10px] font-mono text-emerald-500">{Math.round(quality * 100)}%</span>
                        </div>
                        <input
                            type="range" min="0.1" max="1" step="0.05" value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-zinc-900 appearance-none cursor-pointer rounded-full accent-emerald-500"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-[1fr,auto] gap-4">
                    <button
                        onClick={convertImage}
                        disabled={!originalImage || loading}
                        className="flex items-center justify-center gap-3 py-5 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-20"
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        {loading ? 'Encoding...' : 'Transform'}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={downloadImage}
                            disabled={!convertedImage}
                            className="px-6 bg-zinc-950 border border-zinc-900 rounded-2xl text-emerald-500 hover:text-emerald-400 disabled:opacity-20 transition-all active:scale-95"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={() => { setOriginalImage(null); setConvertedImage(null); setFileName(""); setNewName(""); }}
                            className="px-6 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-500 hover:text-red-500 transition-all active:scale-95"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle size={16} className="text-red-500" />
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-tighter">{error}</span>
                    </div>
                )}
            </div>
        </Panel>
    );
}