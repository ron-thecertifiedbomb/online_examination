
import { useEffect, useRef, useState } from "react";

type SchedulerState = { nextNoteTime: number; currentBeat: number; };

export const useMetronome = () => {
    const [bpm, setBpm] = useState(100);
    const [beatsPerBar, setBeatsPerBar] = useState(4);
    const [isRunning, setIsRunning] = useState(false);
    const [tapTimes, setTapTimes] = useState<number[]>([]);
    const [visualBeat, setVisualBeat] = useState<number>(-1);
    const [subdivision, setSubdivision] = useState(1);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const schedulerStateRef = useRef<SchedulerState>({ nextNoteTime: 0, currentBeat: 0 });
    const timerIdRef = useRef<number | null>(null);

    const bpmRef = useRef(bpm);
    const subdivisionRef = useRef(subdivision);
    const beatsPerBarRef = useRef(beatsPerBar);

    useEffect(() => {
        bpmRef.current = bpm;
        subdivisionRef.current = subdivision;
        beatsPerBarRef.current = beatsPerBar;
    }, [bpm, subdivision, beatsPerBar]);

    useEffect(() => {
        return () => {
            if (timerIdRef.current) clearInterval(timerIdRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const ensureAudioContext = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
        return true;
    };

    const scheduleClick = (time: number, isAccent: boolean) => {
        const ctx = audioCtxRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isAccent ? "triangle" : "sine";
        osc.frequency.setValueAtTime(isAccent ? 1200 : 800, time);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.1);
    };

    const schedulerTick = () => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const currentBpm = bpmRef.current;
        const currentSub = subdivisionRef.current;
        const currentBeatsPerBar = beatsPerBarRef.current;
        const spb = 60 / currentBpm / currentSub;

        while (schedulerStateRef.current.nextNoteTime < ctx.currentTime + 0.1) {
            const beat = schedulerStateRef.current.currentBeat;
            const totalBeats = currentBeatsPerBar * currentSub;
            const isAccent = beat % totalBeats === 0;

            scheduleClick(schedulerStateRef.current.nextNoteTime, isAccent);

            const delay = Math.max(0, (schedulerStateRef.current.nextNoteTime - ctx.currentTime) * 1000);
            setTimeout(() => setVisualBeat(beat), delay);

            schedulerStateRef.current.currentBeat += 1;
            schedulerStateRef.current.nextNoteTime += spb;
        }
    };

    const toggleMetronome = () => {
        if (isRunning) {
            setIsRunning(false);
            if (timerIdRef.current) clearInterval(timerIdRef.current);
            timerIdRef.current = null;
            setVisualBeat(-1);
        } else {
            ensureAudioContext();
            const ctx = audioCtxRef.current!;
            schedulerStateRef.current = { nextNoteTime: ctx.currentTime + 0.05, currentBeat: 0 };
            setIsRunning(true);
            timerIdRef.current = window.setInterval(schedulerTick, 25);
        }
    };

    const onTap = () => {
        const now = performance.now();
        const updated = [...tapTimes, now].filter(t => now - t < 2000);
        setTapTimes(updated);
        if (updated.length >= 2) {
            const avg = (updated[updated.length - 1] - updated[0]) / (updated.length - 1);
            const newBpm = Math.max(30, Math.min(280, Math.round(60000 / avg)));
            setBpm(newBpm);
        }
    };

    return {
        bpm, setBpm,
        beatsPerBar, setBeatsPerBar,
        isRunning, toggleMetronome,
        onTap,
        visualBeat,
        subdivision, setSubdivision
    };
};
