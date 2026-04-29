"use client";

interface UtilityContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function UtilityContainer({ children, className = "" }: UtilityContainerProps) {
    return (
        <div
            className={`
                w-full max-w-2xl
                min-h-[300px]
                sm:min-h-[350px]
                md:min-h-[400px]
                lg:min-h-[420px]
                p-6 sm:p-12  
                rounded-2xl
                bg-gradient-to-b from-slate-800/60 to-slate-900/80
                backdrop-blur-xl
                border border-white/10
                shadow-[0_0_25px_rgba(0,0,0,0.35)]
                flex flex-col items-center justify-center
                mx-auto my-auto
                transition-all
                ${className}
            `}
        >
            {children}
        </div>
    );
}
