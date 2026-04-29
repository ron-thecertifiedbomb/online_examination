"use client";

import { useState } from "react";
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";

export interface ShareLinks {
    twitter: string;
    facebook: string;
    linkedin: string;
}

export interface SocialShareProps {
    /** The URL to share */
    url: string;
    /** The title of the content being shared (for Twitter/LinkedIn) */
    title?: string;
    /** Custom share links (optional, will auto-generate if not provided) */
    shareLinks?: ShareLinks;
    /** Size of the icons */
    iconSize?: number;
    /** Custom className for the container */
    className?: string;
    /** Whether to show the "Share:" label */
    showLabel?: boolean;
    /** Custom label text */
    labelText?: string;
    /** Button size variant */
    size?: "sm" | "md" | "lg";
    /** On share callback */
    onShare?: (platform: string) => void;
}

export const SocialShare = ({
    url,
    title = "",
    shareLinks: customShareLinks,
    iconSize = 14,
    className = "",
    showLabel = true,
    labelText,
    size = "md",
    onShare,
}: SocialShareProps) => {
    const [copied, setCopied] = useState(false);

    // Auto-generate share links if not provided
    const shareLinks = customShareLinks || {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            onShare?.("copy");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Size configurations
    const sizeConfig = {
        sm: {
            button: "p-1 rounded-md",
            icon: 12,
            text: "text-[8px]",
        },
        md: {
            button: "p-1.5 rounded-lg",
            icon: 14,
            text: "text-[8px] md:text-[10px]",
        },
        lg: {
            button: "p-2 rounded-xl",
            icon: 16,
            text: "text-[10px] md:text-[12px]",
        },
    };

    const currentSize = sizeConfig[size];
    const finalIconSize = iconSize || currentSize.icon;

    const buttonClassName = `${currentSize.button} bg-zinc-900 hover:bg-zinc-800 transition-colors shrink-0`;

    return (
        <div className={`flex justify-center md:items-center gap-2  overflow-x-auto pb-1 md:pb-0 ${className}`}>
            {showLabel && (
                <span className={`${currentSize.text} font-mono text-zinc-600 uppercase tracking-wider shrink-0`}>
                    {labelText}
                </span>
            )}

            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName}
                aria-label="Share on Twitter"
                onClick={() => onShare?.("twitter")}
            >
                <Twitter
                    size={finalIconSize}
                    className="text-zinc-400 hover:text-white transition-colors"
                />
            </a>

            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName}
                aria-label="Share on Facebook"
                onClick={() => onShare?.("facebook")}
            >
                <Facebook
                    size={finalIconSize}
                    className="text-zinc-400 hover:text-white transition-colors"
                />
            </a>

            <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName}
                aria-label="Share on LinkedIn"
                onClick={() => onShare?.("linkedin")}
            >
                <Linkedin
                    size={finalIconSize}
                    className="text-zinc-400 hover:text-white transition-colors"
                />
            </a>

            <button
                onClick={copyToClipboard}
                className={buttonClassName}
                aria-label="Copy link"
            >
                {copied ? (
                    <Check
                        size={finalIconSize}
                        className="text-emerald-500"
                    />
                ) : (
                    <Link2
                        size={finalIconSize}
                        className="text-zinc-400 hover:text-white transition-colors"
                    />
                )}
            </button>
        </div>
    );
};