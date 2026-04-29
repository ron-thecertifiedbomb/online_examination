"use client";

type InputProps = {
    value: string;
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
};

export default function Input({
    value,
    placeholder,
    className = "",
    onChange,
}: InputProps) {
    return (
        <input
            className={className}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            suppressHydrationWarning
        />
    );
}
