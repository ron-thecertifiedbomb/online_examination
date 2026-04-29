/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
    Copy,
    Check,
    RefreshCw,
    Shield,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff
} from "lucide-react";

export function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    // Character sets
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijkmnpqrstuvwxyz";
    const numberChars = "23456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Calculate password strength
    const calculateStrength = useCallback(() => {
        let score = 0;
        if (length >= 12) score++;
        if (length >= 16) score++;
        if (includeUppercase) score++;
        if (includeLowercase) score++;
        if (includeNumbers) score++;
        if (includeSymbols) score++;

        if (score <= 2) return { label: "WEAK", color: "text-red-500", bg: "bg-red-500/20", border: "border-red-500/30", width: "25%" };
        if (score <= 4) return { label: "MEDIUM", color: "text-yellow-500", bg: "bg-yellow-500/20", border: "border-yellow-500/30", width: "50%" };
        if (score <= 5) return { label: "STRONG", color: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500/30", width: "75%" };
        return { label: "VERY STRONG", color: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500/30", width: "100%" };
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    const strength = calculateStrength();

    // Generate password
    const generatePassword = useCallback(() => {
        let chars = "";
        if (includeUppercase) chars += uppercaseChars;
        if (includeLowercase) chars += lowercaseChars;
        if (includeNumbers) chars += numberChars;
        if (includeSymbols) chars += symbolChars;

        if (chars === "") {
            setPassword("Select at least one option");
            return;
        }

        let newPassword = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            newPassword += chars[randomIndex];
        }

        // Ensure at least one character from each selected set
        if (includeUppercase && !newPassword.match(/[A-Z]/)) newPassword = newPassword.slice(0, -1) + "A";
        if (includeLowercase && !newPassword.match(/[a-z]/)) newPassword = newPassword.slice(0, -1) + "a";
        if (includeNumbers && !newPassword.match(/[0-9]/)) newPassword = newPassword.slice(0, -1) + "2";
        if (includeSymbols && !newPassword.match(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/)) newPassword = newPassword.slice(0, -1) + "!";

        setPassword(newPassword);
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    // Copy to clipboard
    const copyToClipboard = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Generate on mount and when options change
    useState(() => {
        generatePassword();
    });

    // Auto-regenerate when options change
    const handleOptionChange = (callback: () => void) => {
        callback();
        setTimeout(generatePassword, 0);
    };

    return (
        <div className="space-y-4">
            {/* Password Display - Prominent on mobile */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="relative">
                    <div className="flex items-center p-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            readOnly
                            className="flex-1 bg-transparent text-white font-mono text-base sm:text-lg focus:outline-none"
                            placeholder="Click generate for password"
                        />
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-2 rounded-lg hover:bg-zinc-900 transition"
                            >
                                {showPassword ? <EyeOff size={18} className="text-zinc-500" /> : <Eye size={18} className="text-zinc-500" />}
                            </button>
                            <button
                                onClick={generatePassword}
                                className="p-2 rounded-lg hover:bg-zinc-900 transition"
                            >
                                <RefreshCw size={18} className="text-emerald-500" />
                            </button>
                        </div>
                    </div>

                    {/* Strength Indicator */}
                    <div className="h-1 bg-zinc-900">
                        <div
                            className={`h-full transition-all duration-300 ${strength.bg.replace('/20', '')} bg-opacity-100`}
                            style={{ width: strength.width }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons - Sticky on mobile */}
            {password && (
                <div className="sticky top-20 z-40 grid grid-cols-1 gap-2 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-zinc-800">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider active:scale-95 transition"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "COPIED!" : "COPY PASSWORD"}
                    </button>
                </div>
            )}

            {/* Strength Meter Card */}
            <div className={`rounded-2xl p-4 border ${strength.border} ${strength.bg}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield size={16} className={strength.color} />
                        <span className={`text-xs font-black ${strength.color} uppercase`}>PASSWORD STRENGTH</span>
                    </div>
                    <span className={`text-sm font-black ${strength.color}`}>{strength.label}</span>
                </div>
                <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color.replace('text', 'bg')}`}
                        style={{ width: strength.width }}
                    />
                </div>
            </div>

            {/* Length Control */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-zinc-500">PASSWORD LENGTH</span>
                    <span className="text-lg font-black text-white">{length}</span>
                </div>
                <input
                    type="range"
                    min="6"
                    max="32"
                    value={length}
                    onChange={(e) => handleOptionChange(() => setLength(parseInt(e.target.value)))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-600 mt-1">
                    <span>WEAK</span>
                    <span>BALANCED</span>
                    <span>STRONG</span>
                </div>
            </div>

            {/* Character Options - Collapsible for mobile */}
            <details className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden" open>
                <summary className="px-4 py-3 flex items-center gap-2 cursor-pointer list-none">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-mono text-zinc-500 flex-1">CHARACTER TYPES</span>
                    <span className="text-zinc-600 text-xs">▼</span>
                </summary>
                <div className="p-4 border-t border-zinc-900 space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 active:bg-zinc-900 transition cursor-pointer">
                        <span className="text-sm font-mono text-white">Uppercase (A-Z)</span>
                        <input
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={(e) => handleOptionChange(() => setIncludeUppercase(e.target.checked))}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 active:bg-zinc-900 transition cursor-pointer">
                        <span className="text-sm font-mono text-white">Lowercase (a-z)</span>
                        <input
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={(e) => handleOptionChange(() => setIncludeLowercase(e.target.checked))}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 active:bg-zinc-900 transition cursor-pointer">
                        <span className="text-sm font-mono text-white">Numbers (2-9)</span>
                        <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={(e) => handleOptionChange(() => setIncludeNumbers(e.target.checked))}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 active:bg-zinc-900 transition cursor-pointer">
                        <span className="text-sm font-mono text-white">Symbols (!@#$%)</span>
                        <input
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={(e) => handleOptionChange(() => setIncludeSymbols(e.target.checked))}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                        />
                    </label>
                </div>
            </details>

            {/* Security Tips */}
            <div className="bg-gradient-to-r from-blue-950/20 to-transparent border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-blue-500 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-blue-500 uppercase mb-1">SECURITY TIPS</h4>
                        <ul className="text-[10px] font-mono text-zinc-500 space-y-1">
                            <li>• Use 16+ characters for strong security</li>
                            <li>• Enable all character types for maximum strength</li>
                            <li>• Never reuse passwords across different sites</li>
                            <li>• Use a password manager to store securely</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-3 text-center">
                <p className="text-[9px] font-mono text-zinc-600">
                    🔐 Generated locally in your browser - never sent to any server
                </p>
            </div>
        </div>
    );
}