// components/shared/SectionTitle.tsx
"use client";

import React from "react";

interface SectionTitleProps {
    children: React.ReactNode;
    className?: string; // optional additional classes
}

export default function SectionTitle({ children, className = "" }: SectionTitleProps) {
    return (
        <h2 className={`text-1xl font-semibold mb-4 text-gray-200 ${className}`}>
            {children}
        </h2>
    );
}
