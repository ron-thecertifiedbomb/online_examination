import type { LucideIcon } from "lucide-react";

export type FramerSlide = {
    id: string;
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
    stats: string;
    impact: string;
    tip: string;
};

export type PresentationControls = {
    currentIndex: number;
    isPlaying: boolean;
    progress: number;
    showPanels: boolean;
};
