import type { NetworkData, SpeedTestResults } from "./types";

export const MAX_SPEED = 1000;
export const DOWNLOAD_BYTES = 30_000_000;
export const UPLOAD_BYTES = 15 * 1024 * 1024;
export const NETWORK_TRACE_URL = "https://1.1.1.1/cdn-cgi/trace";
export const NETWORK_IDENTITY_URL = "https://ipwho.is/";
export const DEFAULT_UPLOAD_FALLBACK_MBPS = 50;

export const EMPTY_RESULTS: SpeedTestResults = {
    download: null,
    upload: null,
    ping: null
};

export const INITIAL_NETWORK_DATA: NetworkData = {
    ip: "Detecting...",
    isp: "Detecting...",
    location: "Detecting...",
    server: "GLOBAL_EDGE"
};
