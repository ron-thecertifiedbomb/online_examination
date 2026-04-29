// File: components/shared/Button.tsx
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

export default function Button({ loading, children, className = "", disabled, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`${className} w-full px-4 py-2 rounded transition-colors 
text-sm lg:text-md lg:font-medium bg-blue-900 hover:bg-blue-800 
disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loading ? "Processing..." : children}
        </button>
    );
}
