"use client";

import React from "react";

interface TextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

export default function Textarea({
    value,
    onChange,
    placeholder,
    className = "input",
    rows = 4
}: TextareaProps) {
    return (
        <textarea
            className={className}
            placeholder={placeholder}
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
