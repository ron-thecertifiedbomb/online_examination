// components/ui/SectionHeader.tsx
import { FADE_IN_UP, HERO_TITLE, STAGGER_CONTAINER } from "@/helpers/motion";
import { motion } from "framer-motion";

interface SectionHeaderProps {
    label?: string;
    title: string;
    highlight?: string;
    description?: string;
}

export default function SectionHeader({
    label = "Lizard Interactive Online",
    title,
    highlight,
    description
}: SectionHeaderProps) {

    return (
        <motion.header
            variants={STAGGER_CONTAINER}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="relative py-4 md:py-16 border-b border-white/5 mb-6 md:mb-16 overflow-hidden px-6"
        >
            {/* 1. Protocol Label */}
            <div className="flex items-center gap-2">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 16 }}
                    transition={{ duration: 0.8 }}
                    className="h-[1px] bg-emerald-500 flex-shrink-0"
                />
                <motion.div variants={HERO_TITLE}>
                    <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-emerald-500 font-bold">
                        {label}
                    </span>
                </motion.div>
            </div>

            {/* 2. Main Heading // Hard-Coded Scaled steps */}
            <div className="overflow-hidden">
                <motion.h2
                    variants={HERO_TITLE}
                    className="text-xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-tight md:leading-[0.85] text-white"
                >
                    {title}{" "}
                    {highlight && (
                        <span className="text-emerald-500">
                            {highlight}
                        </span>
                    )}
                </motion.h2>
            </div>

 
            {description && (
                <div className="overflow-hidden">
                    <motion.p
                        variants={HERO_TITLE}
                        className="text-zinc-500 mt-3 md:mt-5 max-w-[35ch] md:max-w-2xl font-light leading-relaxed text-[10px] sm:text-xs md:text-lg border-l border-emerald-500/20 pl-4 md:pl-8 py-0.5"
                    >
                        {description}
                    </motion.p>
                </div>
            )}

            {/* Watermark restricted to Ultra-Wide screens only */}
            <motion.div
                variants={FADE_IN_UP}
                className="absolute -right-8 top-0 -z-10 text-[12rem] font-black text-white/[0.01] select-none pointer-events-none uppercase hidden xl:block"
            >
                {title.substring(0, 2)}
            </motion.div>
        </motion.header>
    );
}