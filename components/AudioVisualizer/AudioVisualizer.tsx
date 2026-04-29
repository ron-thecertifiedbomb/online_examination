'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Upload, ShieldAlert, Activity, Zap, Circle, Palette } from 'lucide-react';

type VisualMode = 'bars' | 'wave' | 'radial';
// Define the surgical color palette
const COLOR_PALETTE = [
    { name: 'Emerald', hex: '#10b981', hue: 140 },
    { name: 'Volt', hex: '#CEFF00', hue: 75 },
    { name: 'Crimson', hex: '#ef4444', hue: 0 },
    { name: 'Cyan', hex: '#06b6d4', hue: 190 },
    { name: 'Violet', hex: '#8b5cf6', hue: 260 },
];

export default function AudioVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [visualMode, setVisualMode] = useState<VisualMode>('bars');
    const [accentColor, setAccentColor] = useState(COLOR_PALETTE[0]);
    const [fileName, setFileName] = useState<string | null>(null);

    const modeRef = useRef<VisualMode>('bars');
    const colorRef = useRef(COLOR_PALETTE[0]);

    useEffect(() => {
        modeRef.current = visualMode;
    }, [visualMode]);

    useEffect(() => {
        colorRef.current = accentColor;
    }, [accentColor]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && audioRef.current) {
            const url = URL.createObjectURL(file);
            audioRef.current.src = url;
            setFileName(file.name);
            setIsPlaying(false);
        }
    };

    const startAudio = async () => {
        if (!audioRef.current?.src) return alert("INPUT_SIGNAL_REQUIRED");

        if (!audioCtx) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = context.createAnalyser();
            const source = context.createMediaElementSource(audioRef.current!);
            source.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 256;
            setAudioCtx(context);
            draw(analyser);
        } else if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const draw = (analyser: AnalyserNode) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            requestAnimationFrame(renderFrame);
            const currentMode = modeRef.current;
            const currentColor = colorRef.current;

            if (currentMode === 'wave') {
                analyser.getByteTimeDomainData(dataArray);
            } else {
                analyser.getByteFrequencyData(dataArray);
            }

            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (currentMode === 'bars') {
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 255;
                    const barHeight = v * canvas.height;
                    // Dynamic luminance based on amplitude
                    ctx.fillStyle = `hsla(${currentColor.hue}, 85%, ${40 + (v * 40)}%, 1)`;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                    x += barWidth;
                }
            }
            else if (currentMode === 'wave') {
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.lineJoin = 'round';
                ctx.shadowBlur = 12;
                ctx.shadowColor = currentColor.hex;
                ctx.strokeStyle = currentColor.hex;

                const sliceWidth = canvas.width / bufferLength;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * canvas.height) / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    x += sliceWidth;
                }
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            else if (currentMode === 'radial') {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = canvas.height / 6;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 255;
                    const angle = (i / bufferLength) * Math.PI * 2;
                    const h = v * (canvas.height / 2);

                    // Radial remains spectral for high-stakes visual impact, 
                    // but shifts toward selected color's saturation
                    const hue = (i / bufferLength) * 360;
                    ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.6 + (v * 0.4)})`;
                    ctx.lineWidth = 2;

                    const x1 = centerX + Math.cos(angle) * radius;
                    const y1 = centerY + Math.sin(angle) * radius;
                    const x2 = centerX + Math.cos(angle) * (radius + h);
                    const y2 = centerY + Math.sin(angle) * (radius + h);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            }
        };
        renderFrame();
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 border border-white/10 rounded-3xl bg-zinc-950 font-sans shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                        <div>
                        
                            <div className="flex gap-1">
                                {(['bars', 'wave', 'radial'] as const).map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setVisualMode(mode)}
                                        className={`text-[9px] px-3 py-1.5 border font-black uppercase tracking-widest transition-all ${visualMode === mode
                                            ? 'border-white text-white bg-white/10'
                                            : 'border-zinc-800 text-zinc-600 hover:text-zinc-400'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                       
                            <div className="flex gap-1.5 items-center h-[26px]">
                                {COLOR_PALETTE.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => setAccentColor(color)}
                                        className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 ${accentColor.name === color.name ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4" style={{ color: accentColor.hex }} />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest truncate max-w-[200px]">
                            {fileName || 'Signal_Idle'}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-zinc-800 hover:text-white transition-all">
                        <Upload className="w-3 h-3" />
                        Load
                        <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <button
                        onClick={startAudio}
                        style={{ backgroundColor: isPlaying ? '#ef4444' : accentColor.hex }}
                        className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 text-black`}
                    >
                        {isPlaying ? "Halt" : "Init"}
                    </button>
                </div>
            </div>

            <div className="relative border border-zinc-900 bg-black aspect-video md:aspect-[3/1] mb-6 shadow-inner">
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
                <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
                {!fileName && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
                        <ShieldAlert className="w-6 h-6" style={{ color: accentColor.hex }} />
                        <span className="text-[8px] font-mono tracking-[0.4em]" style={{ color: accentColor.hex }}>Waiting_For_Input</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-zinc-900 pt-6">
                {[
                    { label: 'Sub_Bass', icon: Zap },
                    { label: 'Mid_Sync', icon: Activity },
                    { label: 'High_Res', icon: Circle }
                ].map((item) => (
                    <div key={item.label} className="space-y-3">
                        <div className="flex items-center gap-2 opacity-40">
                            <item.icon className="w-2 h-2 text-white" />
                            <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">{item.label}</p>
                        </div>
                        <div className="h-[2px] w-full bg-zinc-900 overflow-hidden relative">
                            {isPlaying && (
                                <div
                                    className="h-full animate-pulse w-full opacity-60"
                                    style={{ backgroundColor: accentColor.hex }}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <audio ref={audioRef} hidden crossOrigin="anonymous" />
        </div>
    );
}