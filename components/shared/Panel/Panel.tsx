"use client";

import type { ElementType, ReactNode } from "react";

interface PanelProps {
    children: ReactNode;
    className?: string;
    as?: ElementType;
}

const BASE_PANEL_CLASSES = "bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm";

export function Panel({ children, className, as: Component = "div" }: PanelProps) {
    return (
        <Component className={`${BASE_PANEL_CLASSES} ${className ?? ""}`}>
            {children}
        </Component>
    );
}
