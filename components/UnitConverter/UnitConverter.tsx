/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";
import { CONVERSION_CATEGORIES } from "./constants";

export function UnitConverter() {
    const [value, setValue] = useState("1");
    const [category, setCategory] = useState("time");
    const [fromUnit, setFromUnit] = useState("Hours");
    const [toUnit, setToUnit] = useState("Minutes");
    const [copied, setCopied] = useState(false);

    const currentCategory = useMemo(() => {
        return CONVERSION_CATEGORIES.find(c => c.id === category) || CONVERSION_CATEGORIES[0];
    }, [category]);

    const result = useMemo(() => {
        const num = parseFloat(value);
        if (isNaN(num)) return null;
        return currentCategory.convert(num, fromUnit, toUnit);
    }, [value, fromUnit, toUnit, currentCategory]);

    const handleCategoryChange = (id: string) => {
        const cat = CONVERSION_CATEGORIES.find(c => c.id === id)!;
        setCategory(id);
        setFromUnit(cat.units[0]);
        setToUnit(cat.units[1] || cat.units[0]);
    };

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    const copyResult = async () => {
        if (result === null) return;
        await navigator.clipboard.writeText(result.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-lg mx-auto">
            <ToolHeader title="Unit Converter" />

            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">Result</p>
                <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div className="overflow-hidden">
                        <span className="text-4xl font-black text-white">
                            {result !== null
                                ? result.toLocaleString(undefined, { maximumFractionDigits: 6 })
                                : "—"}
                        </span>
                        <span className="text-xl font-black text-zinc-500 ml-2">{toUnit}</span>
                    </div>
                    <button
                        onClick={copyResult}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:bg-zinc-800"
                    >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        {copied ? "COPIED" : "COPY"}
                    </button>
                </div>
            </div>

            <div className="w-full space-y-4">
                {/* Input Field - No spinners via CSS */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden focus-within:border-emerald-500/50">
                    <div className="border-b border-zinc-900 px-4 py-3">
                        <span className="text-xs font-mono text-zinc-500 uppercase">Input Value</span>
                    </div>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-transparent px-4 py-4 text-white font-mono text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
                    {CONVERSION_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const active = category === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap ${active
                                        ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20"
                                        : "bg-zinc-950 border border-zinc-900 text-zinc-500"
                                    }`}
                            >
                                <Icon size={16} />
                                <span className="text-[10px] tracking-widest">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Instant Switch Logic */}
                <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
                    <UnitSelect label="FROM" value={fromUnit} units={currentCategory.units} onChange={setFromUnit} />
                    <button
                        onClick={swapUnits}
                        className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-500"
                    >
                        <ArrowRightLeft size={18} />
                    </button>
                    <UnitSelect label="TO" value={toUnit} units={currentCategory.units} onChange={setToUnit} />
                </div>
            </div>
        </Panel>
    );
}

function UnitSelect({ label, value, units, onChange }: any) {
    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="border-b border-zinc-900 px-3 py-2 text-[8px] font-mono text-zinc-600">{label}</div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent px-3 py-4 text-white font-mono text-sm focus:outline-none cursor-pointer appearance-none"
            >
                {units.map((u: string) => (
                    <option key={u} value={u} className="bg-zinc-900">{u}</option>
                ))}
            </select>
        </div>
    );
}