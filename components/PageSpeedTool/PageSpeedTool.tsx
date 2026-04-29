/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
    Activity,
    Shield,
    Eye,
    Search,
    Gauge,
    Smartphone,
    Monitor,
    AlertCircle,
    CheckCircle,
    Clock,
    Zap
} from "lucide-react";

type LighthouseResult = {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    lcp: number;
    fid: number;
    cls: number;
    tbt: number;
    opportunities: any[];
    diagnostics: any[];
};

export function PageSpeedTool() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
    const [results, setResults] = useState<LighthouseResult | null>(null);
    const [error, setError] = useState("");

    const runAudit = async () => {
        if (!url) {
            setError("Please enter a URL");
            return;
        }

        setLoading(true);
        setError("");
        setResults(null);

        try {
            // Call PageSpeed Insights API
            const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.error) {
                setError(data.error.message);
                return;
            }

            const lighthouse = data.lighthouseResult;
            const categories = lighthouse.categories;
            const audits = lighthouse.audits;

            setResults({
                performance: Math.round(categories.performance.score * 100),
                accessibility: Math.round(categories.accessibility.score * 100),
                bestPractices: Math.round(categories["best-practices"].score * 100),
                seo: Math.round(categories.seo.score * 100),
                lcp: audits["largest-contentful-paint"]?.numericValue / 1000 || 0,
                fid: audits["max-potential-fid"]?.numericValue || 0,
                cls: audits["cumulative-layout-shift"]?.numericValue || 0,
                tbt: audits["total-blocking-time"]?.numericValue || 0,
                opportunities: lighthouse.audits || [],
                diagnostics: [],
            });
        } catch (err) {
            setError("Failed to fetch results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 90) return "bg-emerald-500/20";
        if (score >= 50) return "bg-yellow-500/20";
        return "bg-red-500/20";
    };

    const formatTime = (ms: number) => {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${ms.toFixed(1)}s`;
    };

    return (
        <div className="space-y-4">
            {/* URL Input */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="border-b border-zinc-900 px-4 py-3">
                    <span className="text-xs font-mono text-emerald-500">ENTER_URL</span>
                </div>
                <div className="p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50"
                        />
                        <button
                            onClick={runAudit}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-black text-sm uppercase tracking-wider disabled:opacity-50 active:scale-95 transition"
                        >
                            {loading ? "RUNNING..." : "ANALYZE"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Strategy Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setStrategy("mobile")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition ${strategy === "mobile"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                            : "bg-zinc-950 border-zinc-900 text-zinc-500"
                        }`}
                >
                    <Smartphone size={16} /> MOBILE
                </button>
                <button
                    onClick={() => setStrategy("desktop")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition ${strategy === "desktop"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                            : "bg-zinc-950 border-zinc-900 text-zinc-500"
                        }`}
                >
                    <Monitor size={16} /> DESKTOP
                </button>
            </div>

            {/* Results */}
            {results && (
                <div className="space-y-4">
                    {/* Score Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`rounded-2xl p-4 border ${getScoreBg(results.performance)} border-emerald-500/20`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Gauge size={14} className={getScoreColor(results.performance)} />
                                <span className="text-[10px] font-mono text-zinc-500">PERFORMANCE</span>
                            </div>
                            <div className="text-3xl font-black text-white">{results.performance}</div>
                        </div>
                        <div className={`rounded-2xl p-4 border ${getScoreBg(results.accessibility)} border-emerald-500/20`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Eye size={14} className={getScoreColor(results.accessibility)} />
                                <span className="text-[10px] font-mono text-zinc-500">ACCESSIBILITY</span>
                            </div>
                            <div className="text-3xl font-black text-white">{results.accessibility}</div>
                        </div>
                        <div className={`rounded-2xl p-4 border ${getScoreBg(results.bestPractices)} border-emerald-500/20`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={14} className={getScoreColor(results.bestPractices)} />
                                <span className="text-[10px] font-mono text-zinc-500">BEST PRACTICES</span>
                            </div>
                            <div className="text-3xl font-black text-white">{results.bestPractices}</div>
                        </div>
                        <div className={`rounded-2xl p-4 border ${getScoreBg(results.seo)} border-emerald-500/20`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Search size={14} className={getScoreColor(results.seo)} />
                                <span className="text-[10px] font-mono text-zinc-500">SEO</span>
                            </div>
                            <div className="text-3xl font-black text-white">{results.seo}</div>
                        </div>
                    </div>

                    {/* Core Web Vitals */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-3">CORE WEB VITALS</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                                    <Clock size={10} />
                                    <span className="text-[8px] font-mono">LCP</span>
                                </div>
                                <p className="text-sm font-black text-white">{formatTime(results.lcp)}</p>
                                <p className="text-[8px] font-mono text-zinc-600">Loading</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                                    <Zap size={10} />
                                    <span className="text-[8px] font-mono">FID</span>
                                </div>
                                <p className="text-sm font-black text-white">{formatTime(results.fid)}</p>
                                <p className="text-[8px] font-mono text-zinc-600">Interactivity</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                                    <Activity size={10} />
                                    <span className="text-[8px] font-mono">CLS</span>
                                </div>
                                <p className="text-sm font-black text-white">{results.cls.toFixed(3)}</p>
                                <p className="text-[8px] font-mono text-zinc-600">Stability</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-red-500 mt-0.5" />
                        <p className="text-xs font-mono text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-950/20 to-transparent border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                    <Activity size={14} className="text-blue-500 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-blue-500 uppercase mb-1">WHAT IS THIS?</h4>
                        <p className="text-[9px] font-mono text-zinc-500 leading-relaxed">
                            This tool uses Google's PageSpeed Insights API to analyze your website's performance.
                            It measures Core Web Vitals (LCP, FID, CLS) and provides scores for Performance,
                            Accessibility, Best Practices, and SEO. All data comes directly from Google.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}