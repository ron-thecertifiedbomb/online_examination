import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";

export default function LiveExamEngine() {
    const router = useRouter();
    const { id } = router.query;
    const [timeLeft, setTimeLeft] = useState(3600); // Initial 60 mins placeholder

    // --- PROCTORING LOGIC: ANTI-CHEAT ---
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.warn("PROTOCOL VIOLATION: Tab Switched");
                // In production, we'd fire a fetch to log this in the DB
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [id]);

    // --- TIMER LOGIC ---
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ScreenContainer >
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                {/* HEADER: PROTOCOL STATUS */}
                <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-2xl text-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">
                            Active Session
                        </span>
                        <h2 className="text-xl font-bold uppercase tracking-tight">Examination in Progress</h2>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase">
                            Time Remaining
                        </span>
                        <span className="text-3xl font-black tabular-nums text-emerald-400">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* QUESTION AREA */}
                <div className="p-10 border-2 border-zinc-100 rounded-[2.5rem] bg-white shadow-sm min-h-[400px]">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Question 01 of 20</span>
                    <h3 className="text-2xl font-black text-zinc-900 mt-4 mb-8 leading-tight">
                        What is the primary benefit of Server-Side Rendering (SSR) in a performance-critical application?
                    </h3>

                    <div className="grid gap-4">
                        {["Faster Initial Page Load", "Reduced Bundle Size", "Simplified State Management", "Better Client-side Routing"].map((opt, i) => (
                            <button key={i} className="w-full text-left p-5 border-2 border-zinc-100 rounded-xl font-bold text-zinc-600 hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase text-sm">
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex justify-between items-center px-4">
                    <button className="text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900">
                        ← Previous
                    </button>
                    <button className="px-10 py-4 bg-zinc-900 text-white font-black rounded-xl hover:bg-emerald-600 transition-all uppercase text-sm tracking-widest">
                        Submit Answer →
                    </button>
                </div>
            </div>
        </ScreenContainer>
    );
    return null;
}