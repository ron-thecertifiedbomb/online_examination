import { DEFAULT_UPLOAD_FALLBACK_MBPS } from "./constants";
import type { IpWhoResponse, NetworkData, TestPhase } from "./types";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const toMbps = (bytes: number, elapsedSeconds: number) => (bytes * 8) / elapsedSeconds / 1_000_000;

export const median = (values: number[]) => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
};

export const parseTraceMap = (traceText: string): Record<string, string> => {
    return traceText.split("\n").reduce<Record<string, string>>((acc, line) => {
        const [key, value] = line.split("=");
        if (key && value) acc[key] = value;
        return acc;
    }, {});
};

export const getFallbackUploadSpeed = (downloadSpeed: string | null, ratio: number) => {
    const parsed = Number.parseFloat(downloadSpeed ?? `${DEFAULT_UPLOAD_FALLBACK_MBPS}`);
    const safeDownload = Number.isFinite(parsed) ? parsed : DEFAULT_UPLOAD_FALLBACK_MBPS;
    return safeDownload * ratio;
};

export const resolveNetworkData = (traceMap: Record<string, string>, ipWhoData: IpWhoResponse | null): NetworkData => {
    if (ipWhoData && ipWhoData.success !== false) {
        return {
            ip: ipWhoData.ip || traceMap.ip || "Unknown",
            isp: ipWhoData.connection?.isp || ipWhoData.connection?.org || "Unknown",
            location: ipWhoData.city ? `${ipWhoData.city}, ${ipWhoData.country_code}` : "Unknown",
            server: traceMap.colo || "CLOUDFLARE_EDGE"
        };
    }

    return {
        ip: traceMap.ip || "Unknown",
        isp: traceMap.asOrganization || (traceMap.asn ? `AS${traceMap.asn}` : "Unknown"),
        location: traceMap.loc || "Unknown",
        server: traceMap.colo || "CLOUDFLARE_EDGE"
    };
};

export const getPhaseText = (phase: TestPhase) => {
    const labels: Record<TestPhase, string> = {
        idle: "READY",
        ping: "PING",
        download: "DOWNLOAD",
        upload: "UPLOAD"
    };
    return labels[phase];
};
