/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useRef } from "react";
import {
    Copy,
    Check,
    Trash2,
    Upload,
    Download,
    Image as ImageIcon,
    FileText,
    Code,
    RefreshCw,
    AlertCircle
} from "lucide-react";

export function Base64Tool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Encode text to Base64
    const encodeToBase64 = useCallback(() => {
        if (!input) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
            setError("");
        } catch (err: any) {
            setError("Failed to encode: " + err.message);
            setOutput("");
        }
    }, [input]);

    // Decode Base64 to text
    const decodeFromBase64 = useCallback(() => {
        if (!input) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const decoded = decodeURIComponent(escape(atob(input)));
            setOutput(decoded);
            setError("");

            // Check if decoded is valid image data URL
            if (decoded.startsWith('data:image')) {
                setImagePreview(decoded);
            } else {
                setImagePreview(null);
            }
        } catch (err: any) {
            setError("Failed to decode: Invalid Base64 string");
            setOutput("");
            setImagePreview(null);
        }
    }, [input]);

    // Handle conversion
    const handleConvert = useCallback(() => {
        if (mode === "encode") {
            encodeToBase64();
        } else {
            decodeFromBase64();
        }
    }, [mode, encodeToBase64, decodeFromBase64]);

    // Auto-convert on input/mode change
    useState(() => {
        if (input) {
            handleConvert();
        }
    });

    // Copy to clipboard
    const copyToClipboard = async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Clear all
    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Upload file and convert to Base64
    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            if (mode === "encode") {
                setInput(base64);
            } else {
                // For decode mode, extract just the base64 part
                if (base64.includes(',')) {
                    setInput(base64.split(',')[1]);
                } else {
                    setInput(base64);
                }
            }
        };
        reader.readAsDataURL(file);
    };

    // Download output as file
    const downloadOutput = () => {
        if (!output) return;

        let blob: Blob;
        let extension = "txt";
        let mimeType = "text/plain";

        if (mode === "decode" && output.startsWith('data:image')) {
            // It's an image
            const matches = output.match(/^data:image\/(\w+);base64,/);
            if (matches) {
                extension = matches[1];
                mimeType = `image/${extension}`;
                const base64Data = output.split(',')[1];
                blob = base64ToBlob(base64Data, mimeType);
            } else {
                blob = new Blob([output], { type: "text/plain" });
            }
        } else {
            blob = new Blob([output], { type: "text/plain" });
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `base64-${Date.now()}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const base64ToBlob = (base64: string, mimeType: string) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    // Example data
    const loadExample = () => {
        if (mode === "encode") {
            setInput("Hello World! This is Lizard Interactive's Base64 Encoder/Decoder tool. It supports text, images, and files!");
        } else {
            setInput("SGVsbG8gV29ybGQhIFRoaXMgaXMgTGl6YXJkIEludGVyYWN0aXZlJ3MgQmFzZTY0IEVuY29kZXIvRGVjb2RlciB0b29sLiBJdCBzdXBwb3J0cyB0ZXh0LCBpbWFnZXMsIGFuZCBmaWxlcyE=");
        }
        setTimeout(handleConvert, 0);
    };

    return (
        <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 border border-zinc-900 rounded-2xl p-1">
                <button
                    onClick={() => {
                        setMode("encode");
                        clearAll();
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition text-xs font-black uppercase tracking-wider ${mode === "encode"
                            ? "bg-emerald-500 text-black"
                            : "text-zinc-500 hover:text-zinc-400"
                        }`}
                >
                    <Code size={14} /> ENCODE → BASE64
                </button>
                <button
                    onClick={() => {
                        setMode("decode");
                        clearAll();
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition text-xs font-black uppercase tracking-wider ${mode === "decode"
                            ? "bg-emerald-500 text-black"
                            : "text-zinc-500 hover:text-zinc-400"
                        }`}
                >
                    <FileText size={14} /> BASE64 → DECODE
                </button>
            </div>

            {/* Action Buttons */}
            <div className="sticky top-20 z-40 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-zinc-800">
                <button
                    onClick={handleConvert}
                    disabled={!input}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-wider active:scale-95 transition disabled:opacity-50"
                >
                    <RefreshCw size={12} /> CONVERT
                </button>

                <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-[10px] font-mono disabled:opacity-50"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "COPIED" : "COPY"}
                </button>

                <label className="cursor-pointer">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={uploadFile}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-[10px] font-mono">
                        <Upload size={12} /> UPLOAD
                    </div>
                </label>

                <button
                    onClick={downloadOutput}
                    disabled={!output}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-[10px] font-mono disabled:opacity-50"
                >
                    <Download size={12} /> DOWNLOAD
                </button>
            </div>

            {/* Input Area */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-mono text-zinc-500">
                            {mode === "encode" ? "INPUT_TEXT" : "INPUT_BASE64"}
                        </span>
                    </div>
                    <button
                        onClick={loadExample}
                        className="px-2 py-1 rounded-lg bg-zinc-900 text-zinc-400 text-[10px] font-mono active:scale-95 transition"
                    >
                        EXAMPLE
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === "encode" ? "Enter text to encode to Base64..." : "Paste Base64 string to decode..."}
                    className="w-full h-40 bg-transparent px-4 py-4 text-white font-mono text-sm focus:outline-none resize-none"
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-red-500 mt-0.5" />
                        <p className="text-xs font-mono text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Output Area */}
            {output && (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-mono text-zinc-500">
                            {mode === "encode" ? "OUTPUT_BASE64" : "OUTPUT_TEXT"}
                        </span>
                    </div>
                    <pre className="px-4 py-4 text-white font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
                        {output.length > 1000 ? output.substring(0, 1000) + "..." : output}
                    </pre>
                    {output.length > 1000 && (
                        <div className="border-t border-zinc-900 px-4 py-2">
                            <p className="text-[9px] font-mono text-zinc-600">
                                Output truncated. {output.length.toLocaleString()} characters total. Download full output.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Image Preview (when decoding images) */}
            {mode === "decode" && imagePreview && (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center gap-2">
                        <ImageIcon size={14} className="text-emerald-500" />
                        <span className="text-xs font-mono text-zinc-500">IMAGE_PREVIEW</span>
                    </div>
                    <div className="p-4 flex justify-center">
                        <img
                            src={imagePreview}
                            alt="Decoded preview"
                            className="max-w-full h-auto rounded-lg border border-zinc-800"
                        />
                    </div>
                </div>
            )}

            {/* Stats */}
            {output && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-mono text-zinc-600">INPUT SIZE</p>
                        <p className="text-lg font-black text-white">{input.length.toLocaleString()} chars</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-mono text-zinc-600">OUTPUT SIZE</p>
                        <p className="text-lg font-black text-white">{output.length.toLocaleString()} chars</p>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-950/20 to-transparent border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-blue-500 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-blue-500 uppercase mb-1">WHAT IS BASE64?</h4>
                        <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                            Base64 encoding converts binary data to ASCII text format. It's commonly used for:
                            embedding images in HTML/CSS, sending files via JSON APIs, email attachments, and storing complex data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}