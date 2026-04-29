import { Activity } from "lucide-react";
import type { ReactNode } from "react";

interface ToolHeaderProps {
    title: string;
    icon?: ReactNode;
    className?: string;
}

export function ToolHeader({ title, icon, className }: ToolHeaderProps) {
    return (
        <div className={`flex flex-1 justify-start items-center gap-2 w-full ${className ?? ""}`}>
            {icon ?? <Activity className="w-4 h-4 text-emerald-500" />}
            <h1 className="text-md font-medium text-emerald-400 flex items-center gap-2 opacity-70 uppercase tracking-[0.1em]">
                {title}
            </h1>
        </div>

    );
}