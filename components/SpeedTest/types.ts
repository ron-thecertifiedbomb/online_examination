export type TestPhase = "idle" | "ping" | "download" | "upload";

export type SpeedTestResults = {
    download: string | null;
    upload: string | null;
    ping: string | null;
};

export type NetworkData = {
    ip: string;
    isp: string;
    location: string;
    server: string;
};

export type IpWhoResponse = {
    success?: boolean;
    ip?: string;
    city?: string;
    country_code?: string;
    connection?: {
        isp?: string;
        org?: string;
    };
};
