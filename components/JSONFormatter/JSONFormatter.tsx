/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
    Copy,
    Check,
    Trash2,
    Minimize2,
    Maximize2,
    Download,
    Upload,
    AlertCircle,
    CheckCircle
} from "lucide-react";

export function JSONFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [minified, setMinified] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);

    // Format JSON
    const formatJSON = useCallback(() => {
        if (!input.trim()) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const formatted = minified
                ? JSON.stringify(parsed)
                : JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError("");
        } catch (err: any) {
            setError(err.message);
            setOutput("");
        }
    }, [input, minified]);

    // Minify JSON
    const minifyJSON = () => {
        setMinified(true);
        setTimeout(() => formatJSON(), 0);
    };

    // Beautify JSON
    const beautifyJSON = () => {
        setMinified(false);
        setTimeout(() => formatJSON(), 0);
    };

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
    };

    // Download JSON file
    const downloadJSON = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `formatted-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Upload JSON file
    const uploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setInput(content);
            setTimeout(() => formatJSON(), 0);
        };
        reader.readAsText(file);
    };

    // Example JSON
    const loadExample = () => {
        const example = {
            name: "Lizard Interactive",
            type: "NES Emulator & Tools",
            version: "1.0.0",
            features: ["JSON Formatter", "QR Generator", "Password Generator", "Text Tools"],
            stats: {
                users: 1000,
                tools: 4,
                rating: 4.8
            },
            active: true
        };
        setInput(JSON.stringify(example, null, 2));
        setTimeout(() => formatJSON(), 0);
    };

    return (
        <div className="space-y-4">
            {/* Action Buttons - Sticky on mobile */}
            <div className="sticky top-20 z-40 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-zinc-800">
                <button
                    onClick={beautifyJSON}
                    disabled={!input}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-wider active:scale-95 transition disabled:opacity-50"
                >
                    <Maximize2 size={12} /> BEAUTIFY
                </button>

                <button
                    onClick={minifyJSON}
                    disabled={!input}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-[10px] font-mono disabled:opacity-50"
                >
                    <Minimize2 size={12} /> MINIFY
                </button>

                <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-[10px] font-mono disabled:opacity-50"
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "COPIED" : "COPY"}
                </button>

                <button
                    onClick={downloadJSON}
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
                        <span className="text-xs font-mono text-zinc-500">INPUT_JSON</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept=".json"
                                onChange={uploadJSON}
                                className="hidden"
                            />
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 text-zinc-400 text-[10px] font-mono active:scale-95 transition">
                                <Upload size={10} /> UPLOAD
                            </div>
                        </label>
                        <button
                            onClick={loadExample}
                            className="px-2 py-1 rounded-lg bg-zinc-900 text-zinc-400 text-[10px] font-mono active:scale-95 transition"
                        >
                            EXAMPLE
                        </button>
                        <button
                            onClick={clearAll}
                            className="px-2 py-1 rounded-lg bg-zinc-900 text-zinc-400 active:scale-95 transition"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='{"name": "Lizard Interactive", "type": "NES Tools"}'
                    className="w-full h-64 bg-transparent px-4 py-4 text-white font-mono text-sm focus:outline-none resize-none"
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-red-500 mt-0.5" />
                        <div>
                            <h4 className="text-[10px] font-black text-red-500 uppercase mb-1">PARSE ERROR</h4>
                            <p className="text-xs font-mono text-red-400">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Output Area */}
            {(output || error) && (
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                    <div className="border-b border-zinc-900 px-4 py-3 flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-mono text-zinc-500">OUTPUT_JSON</span>
                        {!error && output && (
                            <div className="flex items-center gap-1 ml-auto">
                                <CheckCircle size={12} className="text-emerald-500" />
                                <span className="text-[9px] font-mono text-emerald-500">VALID JSON</span>
                            </div>
                        )}
                    </div>
                    <pre className="px-4 py-4 text-white font-mono text-sm overflow-x-auto">
                        <code>{output || error}</code>
                    </pre>
                </div>
            )}

            {/* Stats Card */}
            {output && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-mono text-zinc-600">CHARACTERS</p>
                        <p className="text-lg font-black text-white">{output.length.toLocaleString()}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-mono text-zinc-600">LINES</p>
                        <p className="text-lg font-black text-white">{output.split('\n').length}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-mono text-zinc-600">SIZE</p>
                        <p className="text-lg font-black text-white">{(output.length / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center">
                        <p className="text-[9px] font-mono text-zinc-600">FORMAT</p>
                        <p className="text-lg font-black text-white">{minified ? "MINIFIED" : "PRETTY"}</p>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-r from-emerald-950/20 to-transparent border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-emerald-500 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-1">JSON TIPS</h4>
                        <ul className="text-[10px] font-mono text-zinc-500 space-y-1">
                            <li>• Use double quotes for keys and strings</li>
                            <li>• No trailing commas allowed</li>
                            <li>• Numbers, booleans, null are valid values</li>
                            <li>• Arrays and objects can be nested</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}