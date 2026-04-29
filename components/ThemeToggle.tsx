/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
}

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<ThemeMode>("dark");

    useEffect(() => {
        const t = getInitialTheme();
        setTheme(t);
        document.documentElement.dataset.theme = t;
        setMounted(true);
    }, []);

    function toggle() {
        const next: ThemeMode = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.dataset.theme = next;
        window.localStorage.setItem("theme", next);
    }

    // Skeleton loader to prevent layout shift during hydration
    if (!mounted) {
        return (
            <div className="h-10 w-20 rounded-full border border-zinc-800 bg-zinc-950/50 animate-pulse" />
        );
    }

    return (
        <button
            onClick={toggle}
            className="group relative flex h-10 w-20 items-center rounded-full border border-zinc-800 bg-zinc-950 p-1 transition-all hover:border-emerald-500/50"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            type="button"
        >
            {/* Sliding Indicator */}
            <div
                className={[
                    "absolute h-7 w-7 rounded-full transition-all duration-500 flex items-center justify-center",
                    theme === "dark"
                        ? "translate-x-10 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        : "translate-x-1 bg-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                ].join(" ")}
            >
                {theme === "dark" ? (
                    <Moon size={14} className="text-black" strokeWidth={3} />
                ) : (
                    <Sun size={14} className="text-black" strokeWidth={3} />
                )}
            </div>

            {/* Background Icons */}
            <div className="flex w-full justify-between px-2 text-zinc-600">
                <Sun size={12} className={theme === "light" ? "opacity-0" : "opacity-100"} />
                <Moon size={12} className={theme === "dark" ? "opacity-0" : "opacity-100"} />
            </div>

            {/* Stealth Label (Screen Readers) */}
            <span className="sr-only">Toggle Theme</span>
        </button>
    );
}