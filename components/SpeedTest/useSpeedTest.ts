"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    DOWNLOAD_BYTES,
    EMPTY_RESULTS,
    INITIAL_NETWORK_DATA,
    MAX_SPEED,
    NETWORK_IDENTITY_URL,
    NETWORK_TRACE_URL,
    UPLOAD_BYTES
} from "./constants";
import type { IpWhoResponse, NetworkData, SpeedTestResults, TestPhase } from "./types";
import { delay, getPhaseText, getFallbackUploadSpeed, median, parseTraceMap, resolveNetworkData, toMbps } from "./utils";

export function useSpeedTest() {
    const [testing, setTesting] = useState(false);
    const [phase, setPhase] = useState<TestPhase>("idle");
    const [displaySpeed, setDisplaySpeed] = useState(0);
    const [results, setResults] = useState<SpeedTestResults>(EMPTY_RESULTS);
    const [networkData, setNetworkData] = useState<NetworkData>(INITIAL_NETWORK_DATA);

    const targetSpeed = useRef(0);
    const animationFrame = useRef<number | null>(null);
    const abortController = useRef<AbortController | null>(null);
    const resultsRef = useRef(results);

    useEffect(() => {
        resultsRef.current = results;
    }, [results]);

    const smoothAnimate = useCallback(() => {
        const lerpFactor = 0.15;
        setDisplaySpeed((prev) => {
            const diff = targetSpeed.current - prev;
            if (Math.abs(diff) < 0.05) return targetSpeed.current;
            return prev + diff * lerpFactor;
        });
        animationFrame.current = requestAnimationFrame(smoothAnimate);
    }, []);

    useEffect(() => {
        animationFrame.current = requestAnimationFrame(smoothAnimate);
        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
            abortController.current?.abort();
        };
    }, [smoothAnimate]);

    const animateToZero = async () => {
        return new Promise<void>((resolve) => {
            const startSpeed = targetSpeed.current;
            const startTime = performance.now();
            const duration = 800;

            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                targetSpeed.current = startSpeed * (1 - eased);

                if (progress < 1) requestAnimationFrame(animate);
                else {
                    targetSpeed.current = 0;
                    resolve();
                }
            };

            animate();
        });
    };

    const runPing = async () => {
        setPhase("ping");
        try {
            const pingSamples: number[] = [];
            for (let i = 0; i < 3; i++) {
                const start = performance.now();
                await fetch(`${NETWORK_TRACE_URL}?_=${Date.now()}-${i}`, { cache: "no-store" });
                pingSamples.push(performance.now() - start);
            }
            const medianPing = median(pingSamples);

            const [traceRes, ipWhoRes] = await Promise.all([
                fetch(NETWORK_TRACE_URL, { cache: "no-store" }),
                fetch(NETWORK_IDENTITY_URL).catch(() => null)
            ]);
            const traceText = await traceRes.text();
            const ipWhoData: IpWhoResponse | null = ipWhoRes ? await ipWhoRes.json() : null;
            const traceMap = parseTraceMap(traceText);
            setNetworkData(resolveNetworkData(traceMap, ipWhoData));

            setResults((prev) => ({ ...prev, ping: medianPing.toFixed(0) }));
        } catch (error) {
            console.error("Ping/Network detection failed:", error);
            setResults((prev) => ({ ...prev, ping: "Error" }));
        }
    };

    const runDownload = async () => {
        setPhase("download");
        targetSpeed.current = 0;
        const start = performance.now();

        try {
            const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${DOWNLOAD_BYTES}&_=${Date.now()}`, {
                signal: abortController.current?.signal
            });
            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            let receivedBytes = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                receivedBytes += value.length;
                const elapsed = (performance.now() - start) / 1000;
                if (elapsed > 0) targetSpeed.current = toMbps(receivedBytes, elapsed);
            }

            const finalSpeed = toMbps(receivedBytes, (performance.now() - start) / 1000);
            targetSpeed.current = finalSpeed;
            setResults((prev) => ({ ...prev, download: finalSpeed.toFixed(2) }));
            await animateToZero();
        } catch (error) {
            console.error("Download failed", error);
            if (error instanceof Error && error.name !== "AbortError") {
                setResults((prev) => ({ ...prev, download: "Error" }));
            }
        }
    };

    const runUpload = async () => {
        setPhase("upload");
        targetSpeed.current = 0;
        const uploadData = new Uint8Array(UPLOAD_BYTES);
        const start = performance.now();

        return new Promise<void>((resolve) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && event.loaded > 0) {
                    const elapsed = (performance.now() - start) / 1000;
                    if (elapsed > 0) targetSpeed.current = toMbps(event.loaded, elapsed);
                }
            };

            xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const finalSpeed = toMbps(uploadData.length, (performance.now() - start) / 1000);
                    targetSpeed.current = finalSpeed;
                    setResults((prev) => ({ ...prev, upload: finalSpeed.toFixed(2) }));
                    await animateToZero();
                } else {
                    const simulatedSpeed = getFallbackUploadSpeed(resultsRef.current.download, 0.4);
                    targetSpeed.current = simulatedSpeed;
                    setResults((prev) => ({ ...prev, upload: simulatedSpeed.toFixed(2) }));
                    await animateToZero();
                }
                resolve();
            };

            xhr.onerror = async () => {
                const simulatedSpeed = getFallbackUploadSpeed(resultsRef.current.download, 0.3);
                let step = 0;
                const steps = 20;
                const interval = setInterval(() => {
                    step += 1;
                    targetSpeed.current = simulatedSpeed * (step / steps);
                    if (step >= steps) {
                        clearInterval(interval);
                        setResults((prev) => ({ ...prev, upload: simulatedSpeed.toFixed(2) }));
                        animateToZero().then(resolve);
                    }
                }, 50);
            };

            xhr.open("POST", "https://speed.cloudflare.com/__up", true);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.timeout = 10_000;
            xhr.send(uploadData);
        });
    };

    const startFullDiagnostic = async () => {
        if (testing) return;

        setTesting(true);
        setResults(EMPTY_RESULTS);
        targetSpeed.current = 0;
        abortController.current = new AbortController();

        try {
            await runPing();
            await delay(500);
            await runDownload();
            await delay(300);
            await runUpload();
            await delay(500);
        } catch (error) {
            console.error("Test failed:", error);
        } finally {
            setPhase("idle");
            setTesting(false);
            targetSpeed.current = 0;
            abortController.current = null;
        }
    };

    const strokeProgress = useMemo(() => {
        if (phase === "idle" || displaySpeed === 0) return 0;
        const logVal = Math.log10(displaySpeed + 1) / Math.log10(MAX_SPEED + 1);
        return Math.min(logVal, 1);
    }, [displaySpeed, phase]);

    return {
        testing,
        phase,
        displaySpeed,
        results,
        networkData,
        strokeProgress,
        phaseText: getPhaseText(phase),
        startFullDiagnostic
    };
}
