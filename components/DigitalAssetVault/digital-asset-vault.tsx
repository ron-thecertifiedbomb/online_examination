"use client"

import { useState } from "react"
import { VaultCard, type VaultMode } from "../VaultCard/vault-card"
import {
    Code2,
    Guitar,
    Search,
    SlidersHorizontal,
    LayoutGrid,
    Sparkles,
    Terminal
} from "lucide-react"
import { cn } from "../../utils/utils"
import { assets } from "../../data/vaultAssets"



export function DigitalAssetVault() {
    const [mode, setMode] = useState<VaultMode>("dev")
    const [filter, setFilter] = useState<"all" | "plugin" | "tool" | "infra">("all")
    const [searchQuery, setSearchQuery] = useState("")

    const isDevMode = mode === "dev"

    const filteredAssets = assets.filter((asset) => {
        const matchesFilter = filter === "all" || asset.category === filter
        const matchesSearch =
            asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.serial.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleExecute = (id: string) => {
        const asset = assets.find(a => a.id === id);
        if (asset?.href) {
            window.open(asset.href, "_blank", "noopener,noreferrer");
        } else {
            console.log(`Command sent to internal module: ${id}`);
        }
    }

    return (
        <div className="min-h-screen bg-black transition-colors duration-500">
            {/* Subtle grid background */}
            <div
                className="fixed inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-sm border",
                                        isDevMode
                                            ? "border-emerald-500/30 bg-emerald-500/10"
                                            : "border-white/20 bg-white/5"
                                    )}
                                >
                                    {isDevMode ? (
                                        <Terminal className={cn("h-5 w-5", isDevMode ? "text-emerald-500" : "text-white")} />
                                    ) : (
                                        <Sparkles className="h-5 w-5 text-white" />
                                    )}
                                </div>
                                <h1
                                    className={cn(
                                        "font-mono text-2xl font-bold tracking-tight sm:text-3xl",
                                        isDevMode ? "text-emerald-50" : "text-white"
                                    )}
                                >
                                    Digital Asset Vault
                                </h1>
                            </div>
                            <p className="font-mono text-xs tracking-wider text-zinc-500">
                                {isDevMode ? "DEV SOLUTIONS MODE" : "THE PSYCHEDELIC RIFFER MODE"} · {filteredAssets.length} UNITS ONLINE
                            </p>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex items-center gap-2 rounded-sm border border-white/5 bg-zinc-900/50 p-1 backdrop-blur-xl">
                            <button
                                onClick={() => setMode("dev")}
                                className={cn(
                                    "flex items-center gap-2 rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                                    mode === "dev"
                                        ? "bg-emerald-500 text-black"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <Code2 className="h-3.5 w-3.5" />
                                Dev
                            </button>
                            <button
                                onClick={() => setMode("riffer")}
                                className={cn(
                                    "flex items-center gap-2 rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                                    mode === "riffer"
                                        ? "bg-white text-black"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <Guitar className="h-3.5 w-3.5" />
                                Riffer
                            </button>
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search assets by name or serial..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full rounded-sm border bg-zinc-900/50 py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-zinc-600 backdrop-blur-xl transition-colors focus:outline-none",
                                    isDevMode
                                        ? "border-white/5 focus:border-emerald-500/50"
                                        : "border-white/5 focus:border-white/30"
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                            {(["all", "plugin", "tool", "infra"] as const).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={cn(
                                        "rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all",
                                        filter === category
                                            ? isDevMode
                                                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                                                : "border-white/30 bg-white/10 text-white"
                                            : "border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Asset Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAssets.map((asset) => (
                        <VaultCard
                            key={asset.id}
                            asset={asset}
                            mode={mode}
                            onExecute={handleExecute}
                        />
                    ))}
                </div>

                {/* Status Bar */}
                <footer className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                                System Online
                            </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-700">|</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                            {assets.filter((a) => a.status === "online").length} Active · {assets.filter((a) => a.status === "processing").length} Processing
                        </span>
                    </div>
                    <code className="font-mono text-[10px] text-zinc-600">
                        VAULT::v1.0.0::SECURE::Philippine_Region_8
                    </code>
                </footer>
            </div>
        </div>
    )
}