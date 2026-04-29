/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useState } from "react";
import type { NesButton } from "@/lib/nes/input";
import type { Keymap } from "@/lib/hooks/useKeymap";
import { RefreshCcw, Keyboard } from "lucide-react";

const BUTTONS: { button: NesButton; label: string }[] = [
    { button: "UP", label: "D-PAD_UP" },
    { button: "DOWN", label: "D-PAD_DOWN" },
    { button: "LEFT", label: "D-PAD_LEFT" },
    { button: "RIGHT", label: "D-PAD_RIGHT" },
    { button: "A", label: "BTN_A" },
    { button: "B", label: "BTN_B" },
    { button: "START", label: "START" },
    { button: "SELECT", label: "SELECT" },
];

function codeToLabel(code: string): string {
    if (code.startsWith("Key")) return code.slice(3).toUpperCase();
    if (code.startsWith("Digit")) return code.slice(5);
    if (code.startsWith("Arrow")) return code.slice(5).toUpperCase();
    if (code === "ShiftLeft") return "L_SHIFT";
    if (code === "ShiftRight") return "R_SHIFT";
    if (code === "Space") return "SPACE";
    return code.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
}

function getCodeForButton(keymap: Keymap<NesButton>, button: NesButton): string | null {
    for (const [code, btn] of Object.entries(keymap)) {
        if (btn === button) return code;
    }
    return null;
}

type Props = {
    keymap: Keymap<NesButton>;
    onSetKey: (code: string, button: NesButton) => void;
    onReset: () => void;
};

export function NesKeymapEditor({ keymap, onSetKey, onReset }: Props) {
    const [listening, setListening] = useState<NesButton | null>(null);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!listening) return;
            e.preventDefault();
            e.stopPropagation();
            if (e.code === "Escape") { setListening(null); return; }
            onSetKey(e.code, listening);
            setListening(null);
        },
        [listening, onSetKey],
    );

    useEffect(() => {
        if (!listening) return;
        window.addEventListener("keydown", handleKeyDown, { capture: true });
        return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [listening, handleKeyDown]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {BUTTONS.map(({ button, label }) => {
                    const code = getCodeForButton(keymap, button);
                    const isListening = listening === button;

                    return (
                        <button
                            key={button}
                            type="button"
                            onClick={() => setListening(isListening ? null : button)}
                            className={[
                                "group relative flex flex-col items-start gap-1 rounded-xl border p-3 transition-all",
                                isListening
                                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                    : "border-zinc-800 bg-black hover:border-zinc-600"
                            ].join(" ")}
                        >
                            <span className="text-[9px] font-black tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                {label}
                            </span>

                            <div className="flex w-full items-center justify-between">
                                <span className={[
                                    "font-mono text-xs font-bold tracking-tighter",
                                    isListening ? "text-emerald-400" : "text-white"
                                ].join(" ")}>
                                    {isListening ? (
                                        <span className="animate-pulse">AWAITING_INPUT...</span>
                                    ) : code ? (
                                        codeToLabel(code)
                                    ) : (
                                        <span className="text-zinc-800">UNBOUND</span>
                                    )}
                                </span>
                                <Keyboard size={12} className={isListening ? "text-emerald-500" : "text-zinc-800"} />
                            </div>

                            {/* Decorative Corner */}
                            {isListening && (
                                <div className="absolute top-0 right-0 p-1">
                                    <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={onReset}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-all"
            >
                <RefreshCcw size={14} />
                Reset_To_Factory_Defaults
            </button>
        </div>
    );
}