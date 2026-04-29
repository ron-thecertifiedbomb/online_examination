"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { STACK_SLIDES } from "@/data/presentation/web";
import { AUTOPLAY_INTERVAL_MS, PROGRESS_MAX } from "./constants";
import type { FramerSlide } from "./types";

export function useFramerPresentation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showPanels, setShowPanels] = useState(true);
    const slides = STACK_SLIDES as FramerSlide[];
    const slideCount = slides.length;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slideCount);
        setProgress(0);
    }, [slideCount]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
        setProgress(0);
    }, [slideCount]);

    const selectSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        setProgress(0);
    }, []);

    const togglePlayback = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const togglePanels = useCallback(() => {
        setShowPanels((prev) => !prev);
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= PROGRESS_MAX) {
                        nextSlide();
                        return 0;
                    }
                    return prev + 1;
                });
            }, AUTOPLAY_INTERVAL_MS);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, nextSlide]);

    const currentSlide = slides[currentIndex];

    const quickFacts = useMemo(
        () => [
            `Module ${String(currentIndex + 1).padStart(2, "0")} of ${String(slideCount).padStart(2, "0")}`,
            `Focus Area: ${currentSlide.stats}`,
            `Outcome: ${currentSlide.impact}`,
        ],
        [currentIndex, currentSlide.impact, currentSlide.stats, slideCount],
    );

    const actionChecklist = useMemo(
        () => [
            `Review the "${currentSlide.title}" concept`,
            "Validate with a real Lighthouse run",
            "Apply one optimization before next slide",
        ],
        [currentSlide.title],
    );

    return {
        slides,
        slideCount,
        currentIndex,
        isPlaying,
        progress,
        showPanels,
        currentSlide,
        quickFacts,
        actionChecklist,
        nextSlide,
        prevSlide,
        selectSlide,
        togglePlayback,
        togglePanels,
    };
}
