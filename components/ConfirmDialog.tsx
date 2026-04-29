/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "PROCEED",
    cancelLabel = "ABORT",
    danger = false,
    onConfirm,
    onCancel,
}: Props) {
    const confirmRef = useRef<HTMLButtonElement>(null);
    const id = useId();

    useEffect(() => {
        if (open) {
            // Slight delay to ensure the focus hits after the transition starts
            const timer = setTimeout(() => confirmRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop with heavy blur */}
            <div
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onCancel}
            />

            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                <div
                    className={[
                        "relative w-full max-w-sm overflow-hidden rounded-2xl border bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200",
                        danger ? "border-rose-500/50 shadow-rose-500/10" : "border-zinc-800 shadow-black"
                    ].join(" ")}
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby={`${id}-title`}
                    aria-describedby={`${id}-msg`}
                >
                    {/* Retro Scanline Overlay */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={[
                            "p-2 rounded-lg",
                            danger ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        ].join(" ")}>
                            {danger ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div id={`${id}-title`} className="text-xs font-black uppercase tracking-[0.2em] text-white">
                            {title}
                        </div>
                    </div>

                    {/* Message */}
                    <div id={`${id}-msg`} className="font-mono text-[11px] leading-relaxed text-zinc-400 uppercase">
                        <span className="text-zinc-600 mr-2">&gt;</span>
                        {message}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col gap-2">
                        <button
                            ref={confirmRef}
                            type="button"
                            onClick={onConfirm}
                            className={[
                                "w-full rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98]",
                                danger
                                    ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:bg-rose-600"
                                    : "bg-white text-black hover:bg-emerald-500"
                            ].join(" ")}
                        >
                            {confirmLabel}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full rounded-xl border border-zinc-800 bg-transparent py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all hover:bg-zinc-900 hover:text-zinc-300"
                        >
                            {cancelLabel}
                        </button>
                    </div>

                    {/* Corner Close X */}
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 text-zinc-700 hover:text-zinc-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}