"use client"


import { Cpu, Guitar, Server, Zap, Code, Database, Terminal, Music } from "lucide-react"
import { cn } from "../../utils/utils"
import { VaultAsset } from "../../interfaces"

export type VaultMode = "dev" | "riffer"



interface VaultCardProps {
    asset: VaultAsset
    mode: VaultMode
    onExecute: (id: string) => void
}

const categoryIcons = {
    plugin: Guitar,
    tool: Code,
    infra: Server,
}

const statusColors = {
    online: "bg-green-500",
    standby: "bg-amber-500",
    processing: "bg-blue-500",
}

export function VaultCard({ asset, mode, onExecute }: VaultCardProps) {
    const Icon = categoryIcons[asset.category]
    const isDevMode = mode === "dev"

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-sm",
                "bg-black/60 backdrop-blur-xl",
                "border border-white/5",
                "transition-all duration-300 ease-out",
                "hover:scale-[1.02]",
                isDevMode
                    ? "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                    : "hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            )}
        >
            {/* Rack mount screws decoration */}
            <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-zinc-700 shadow-inner" />
            <div className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-zinc-700 shadow-inner" />
            <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-zinc-700 shadow-inner" />
            <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-zinc-700 shadow-inner" />

            {/* Top bar with serial and status */}
            <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/50 px-4 py-2">
                <code className={cn(
                    "font-mono text-[10px] tracking-widest",
                    isDevMode ? "text-emerald-500/70" : "text-zinc-400"
                )}>
                    {asset.serial}
                </code>

                {/* Status LED */}
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                        {asset.status}
                    </span>
                    <div className="relative">
                        <div
                            className={cn(
                                "h-2 w-2 rounded-full",
                                statusColors[asset.status],
                                asset.status === "processing" && "animate-pulse"
                            )}
                        />
                        {asset.status === "online" && (
                            <div
                                className={cn(
                                    "absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-75",
                                    statusColors[asset.status]
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="p-4">
                <div className="mb-4 flex items-start justify-between">
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-sm border",
                            isDevMode
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                                : "border-white/10 bg-white/5 text-white"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <span
                        className={cn(
                            "font-mono text-[10px]",
                            isDevMode ? "text-emerald-500/50" : "text-zinc-500"
                        )}
                    >
                        v{asset.version}
                    </span>
                </div>

                <h3
                    className={cn(
                        "mb-1 font-mono text-sm font-medium tracking-tight",
                        isDevMode ? "text-emerald-50" : "text-white"
                    )}
                >
                    {asset.name}
                </h3>

                <p className="mb-4 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {asset.category === "plugin" && "Audio Plugin"}
                    {asset.category === "tool" && "Dev Tool"}
                    {asset.category === "infra" && "Infrastructure"}
                </p>

                {/* Execute button */}
                <button
                    onClick={() => onExecute(asset.id)}
                    className={cn(
                        "group/btn relative w-full overflow-hidden rounded-sm border py-2 font-mono text-xs uppercase tracking-widest",
                        "transition-all duration-200",
                        isDevMode
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:border-emerald-500 hover:bg-emerald-500 hover:text-black"
                            : "border-white/20 bg-white/5 text-white/80 hover:border-white hover:bg-white hover:text-black"
                    )}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <Zap className="h-3 w-3" />
                        Execute
                    </span>
                </button>
            </div>

            {/* Glow effect on hover */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    isDevMode
                        ? "bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent"
                        : "bg-gradient-to-t from-white/5 via-transparent to-transparent"
                )}
            />
        </div>
    )
}
