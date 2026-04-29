import React from "react";

type ScreenContainerProps = {
    children: React.ReactNode;
    className?: string; // Use this for pt, pb, gap, or any extra styles
    variant?: "transparent" | "ambient";
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
};

export default function ScreenContainer({
    children,
    className = "",
    variant = "transparent",
    maxWidth = "lg",
}: ScreenContainerProps) {

    const variants = {
        transparent: "",
        ambient: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black"
    };

    const maxWidthClasses = {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        "2xl": "max-w-[1400px]",
        "full": "max-w-full"
    };

    return (
        <section
            className={`
                w-full 
                min-h-screen 
                ${variants[variant]} 
                ${className} 
            `}
        >
            <div className={`w-full mx-auto ${maxWidthClasses[maxWidth]}`}>
                {children}
            </div>
        </section>
    );
}