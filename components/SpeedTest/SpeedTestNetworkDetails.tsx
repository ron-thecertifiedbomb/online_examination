"use client";

import { Server } from "lucide-react";
import { Panel } from "../shared/Panel/Panel";
import type { NetworkData, TestPhase } from "./types";

interface SpeedTestNetworkDetailsProps {
    networkData: NetworkData;
    phase: TestPhase;
}

export function SpeedTestNetworkDetails({ networkData, phase }: SpeedTestNetworkDetailsProps) {
    return (
        <Panel as="aside" className="rounded-2xl p-6">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase mb-4">
                <Server size={12} /> NETWORK DETAILS
            </div>
            <IdentityItem label="ISP" value={networkData.isp} />
            <IdentityItem label="IP" value={networkData.ip} />
            <IdentityItem label="Location" value={networkData.location} />
            <IdentityItem label="Server" value={networkData.server} />
            <IdentityItem
                label="Method"
                value={phase === "upload" ? "XHR_STREAM" : phase === "download" ? "FETCH_STREAM" : "IDLE"}
            />
        </Panel>
    );
}

function IdentityItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-[11px] py-2 border-b border-white/5 last:border-0">
            <span className="text-zinc-500 uppercase tracking-wider">{label}</span>
            <span className="text-zinc-200 font-mono text-xs">{value}</span>
        </div>
    );
}
