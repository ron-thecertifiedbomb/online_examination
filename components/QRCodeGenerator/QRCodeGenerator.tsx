/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
    Download,
    Copy,
    Check,
    Palette,
    Settings,
    Eye,
    Share2,
    Maximize2,
    Minimize2
} from "lucide-react";

export function QRCodeGenerator() {
    const [text, setText] = useState("");
    const [size, setSize] = useState(200);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
    const [copied, setCopied] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);

    const downloadQR = async () => {
        if (!text) return;

        const svg = document.querySelector("#qr-code-svg") as SVGElement;
        if (!svg) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const qrSize = showFullscreen ? 400 : size;

        canvas.width = qrSize;
        canvas.height = qrSize;

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = () => {
            ctx?.drawImage(img, 0, 0, qrSize, qrSize);
            const link = document.createElement("a");
            link.download = `qrcode-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    const copyToClipboard = async () => {
        if (!text) return;

        const svg = document.querySelector("#qr-code-svg") as SVGElement;
        if (!svg) return;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = async () => {
            ctx?.drawImage(img, 0, 0, size, size);
            canvas.toBlob(async (blob) => {
                if (blob) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ [blob.type]: blob })
                    ]);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }
            });
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    const shareQR = async () => {
        if (!text || !navigator.share) return;

        const svg = document.querySelector("#qr-code-svg") as SVGElement;
        if (!svg) return;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = async () => {
            ctx?.drawImage(img, 0, 0, size, size);
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], "qrcode.png", { type: "image/png" });
                    await navigator.share({
                        title: "QR Code",
                        text: text,
                        files: [file]
                    });
                }
            });
        };

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    const presetColors = [
        { name: "Classic", fg: "#000000", bg: "#ffffff" },
        { name: "Emerald", fg: "#10b981", bg: "#000000" },
        { name: "Purple", fg: "#a855f7", bg: "#000000" },
        { name: "Blue", fg: "#3b82f6", bg: "#ffffff" },
        { name: "Orange", fg: "#f97316", bg: "#1a1a1a" },
        { name: "Rose", fg: "#f43f5e", bg: "#ffffff" },
    ];

    return (
        <div className="space-y-4">
            {/* Mobile-first: Stack everything vertically */}

            {/* QR Preview - Prominent on mobile */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex items-center justify-center">
                <div className="relative">
                    <div className="bg-white p-3 rounded-xl shadow-xl">
                        {text ? (
                            <QRCodeSVG
                                id="qr-code-svg"
                                value={text}
                                size={showFullscreen ? 300 : size}
                                bgColor={bgColor}
                                fgColor={fgColor}
                                level={level}
                                includeMargin={true}
                            />
                        ) : (
                            <div className="w-[200px] h-[200px] flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
                                <p className="text-zinc-600 text-xs font-mono text-center px-4">
                                    Enter text to generate QR
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Fullscreen toggle for mobile */}
                    {text && (
                        <button
                            onClick={() => setShowFullscreen(!showFullscreen)}
                            className="absolute -top-2 -right-2 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-500 transition"
                        >
                            {showFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Action Buttons - Sticky on mobile for easy access */}
            {text && (
                <div className="sticky top-20 z-40 grid grid-cols-2 gap-2 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-zinc-800">
                    <button
                        onClick={downloadQR}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider active:scale-95 transition"
                    >
                        <Download size={14} /> DOWNLOAD
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-xs font-mono"
                    >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        COPY
                    </button>

                    {typeof navigator !== "undefined" && (navigator as any).share && (
                        <button
                            onClick={shareQR}
                            className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-xs font-mono"
                        >
                            <Share2 size={14} /> SHARE QR CODE
                        </button>
                    )}
                </div>
            )}

            {/* Input Area - Full width on mobile */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="border-b border-zinc-900 px-4 py-3">
                    <span className="text-xs font-mono text-emerald-500">ENTER_DATA</span>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="URL, text, WiFi credentials, contact info..."
                    className="w-full h-28 bg-transparent px-4 py-3 text-white font-mono text-sm focus:outline-none resize-none"
                />
            </div>

            {/* Controls - Collapsible sections for mobile */}
            <details className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <summary className="px-4 py-3 flex items-center gap-2 cursor-pointer list-none">
                    <Palette size={14} className="text-emerald-500" />
                    <span className="text-xs font-mono text-zinc-500 flex-1">CUSTOMIZE COLORS</span>
                    <span className="text-zinc-600 text-xs">▼</span>
                </summary>
                <div className="p-4 border-t border-zinc-900 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-mono text-zinc-600 block mb-1">Foreground</label>
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                                className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-mono text-zinc-600 block mb-1">Background</label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {presetColors.map((preset, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setFgColor(preset.fg);
                                    setBgColor(preset.bg);
                                }}
                                className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 active:scale-95 transition text-[10px] font-mono"
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.fg }} />
                                <span className="text-zinc-400">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </details>

            <details className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <summary className="px-4 py-3 flex items-center gap-2 cursor-pointer list-none">
                    <Settings size={14} className="text-emerald-500" />
                    <span className="text-xs font-mono text-zinc-500 flex-1">ADVANCED SETTINGS</span>
                    <span className="text-zinc-600 text-xs">▼</span>
                </summary>
                <div className="p-4 border-t border-zinc-900 space-y-3">
                    <div>
                        <label className="text-xs font-mono text-zinc-500 mb-2 block">SIZE: {size}px</label>
                        <input
                            type="range"
                            min="128"
                            max="400"
                            step="16"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-mono text-zinc-500 mb-2 block">ERROR CORRECTION</label>
                        <div className="grid grid-cols-4 gap-1">
                            {[
                                { value: "L", label: "L" },
                                { value: "M", label: "M" },
                                { value: "Q", label: "Q" },
                                { value: "H", label: "H" }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setLevel(opt.value as any)}
                                    className={`py-2 rounded-lg border transition text-xs font-mono ${level === opt.value
                                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-[9px] font-mono text-zinc-600 mt-2">
                            L=7% | M=15% | Q=25% | H=30% recovery
                        </p>
                    </div>
                </div>
            </details>

            {/* Info Box - Clean on mobile */}
            <div className="bg-gradient-to-r from-emerald-950/20 to-transparent border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Eye size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-mono text-emerald-500">TIP</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                    Higher error correction creates more complex QR codes but makes them readable
                    even if partially damaged. Use "H" for printing on products or curved surfaces.
                </p>
            </div>
        </div>
    );
}