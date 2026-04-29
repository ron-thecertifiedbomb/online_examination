"use client";

import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleNewsletterSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus("success");
                setEmail("");
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                setErrorMessage(data.error || "Failed.");
                setTimeout(() => setStatus("idle"), 4000);
            }
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <section className="mt-24 border-t border-zinc-900 pt-12 pb-24 text-center">
            <div className="max-w-xl mx-auto px-4">
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                    Scale Your <span className="text-emerald-500">Digital Presence</span>
                </h3>

                <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER_EMAIL"
                        className="flex-1 bg-black border border-zinc-800 p-4 text-sm focus:border-emerald-500 outline-none font-mono text-white placeholder:text-zinc-700"
                        disabled={status === "loading"}
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="bg-emerald-500 text-black px-8 py-4 font-bold uppercase text-xs hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {status === "loading" ? "SENDING..." : "CONNECT"}
                    </button>
                </form>

                {/* Status Messages */}
                <div className="h-4 mt-4">
                    {status === "success" && (
                        <p className="text-emerald-500 text-[10px] font-mono uppercase tracking-widest animate-pulse">
                            Connection Established.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest">
                            {errorMessage || "Link Failed."}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}