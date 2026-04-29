"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
    src?: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    fallbackIcon?: React.ReactNode;
    fallbackText?: string;
}

export function ImageWithFallback({
    src,
    alt,
    className = "",
    width,
    height,
    fill = false,
    fallbackIcon,
    fallbackText = "Image not available",
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // If no src or error, show fallback
    if (!src || error) {
        return (
            <div
                className={`flex items-center justify-center bg-zinc-900 ${className}`}
                style={!fill ? { width, height } : undefined}
            >
                <div className="text-center">
                    {fallbackIcon || <ImageIcon size={32} className="text-zinc-700 mx-auto mb-2" />}
                    <p className="text-[10px] font-mono text-zinc-600">{fallbackText}</p>
                </div>
            </div>
        );
    }

    // Handle path formatting
    const imagePath = src.startsWith('/') ? src : `/${src}`;

    // Loading state
    if (isLoading) {
        return (
            <div
                className={`animate-pulse bg-zinc-800 ${className}`}
                style={!fill ? { width, height } : undefined}
            />
        );
    }

    // Use Next.js Image for optimization (if fill or width/height provided)
    if (fill || (width && height)) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src={imagePath}
                    alt={alt}
                    fill={fill}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    className="object-cover"
                    onLoadingComplete={() => setIsLoading(false)}
                    onError={() => setError(true)}
                />
            </div>
        );
    }

    // Fallback to regular img tag
    return (
        <img
            src={imagePath}
            alt={alt}
            className={`object-cover ${className}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setError(true)}
        />
    );
}