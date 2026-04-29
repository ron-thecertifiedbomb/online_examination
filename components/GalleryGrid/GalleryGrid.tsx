'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type GalleryImage = {
    src: string;
    alt: string;
};

interface GalleryGridProps {
    images: GalleryImage[];
    rowHeight?: number;
    gap?: number;
}

export default function GalleryGrid({
    images,
    rowHeight = 280,
    gap = 16
}: GalleryGridProps) {

    /**
     * BENTO ALGORITHM
     * grid-flow-dense will automatically fill holes left by larger spans
     * by pulling smaller images from later in the array.
     */
    const getSpan = (index: number) => {
        // High-impact feature (Double wide, double tall)
        if (index === 0) return "md:col-span-2 md:row-span-2";
        // Vertical "Portrait" span
        if (index % 5 === 0) return "md:col-span-1 md:row-span-2";
        // Horizontal "Landscape" span
        if (index % 3 === 0) return "md:col-span-2 md:row-span-1";
        // Standard square
        return "md:col-span-1 md:row-span-1";
    };

    return (
        <div className="w-full bg-black py-4">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                <div
                    className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense"
                    style={{
                        gap: `${gap}px`,
                        gridAutoRows: `${rowHeight}px`,
                    }}
                >
                    {images.map((img, index) => (
                        <motion.div
                            key={`${img.src}-${index}`}
                            className={`${getSpan(index)} relative group overflow-hidden border border-zinc-900 bg-zinc-950 transition-all duration-500 hover:border-emerald-500/40 shadow-2xl`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                        >
                            <Link
                                href={img.src}
                                data-fancybox="gallery"
                                className="relative block w-full h-full cursor-zoom-in"
                            >
                                {/* INDUSTRIAL OVERLAY */}
                                <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                    <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-[0.3em]">
                                            Asset_ID: {index.toString().padStart(3, '0')}
                                        </span>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
                                            {img.alt || "System_Render"}
                                        </h4>
                                    </div>
                                </div>

                                {/* IMAGE ENGINE */}
                                <div className="relative w-full h-full">
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-110"
                                        sizes="(max-w-768px) 50vw, 25vw"
                                        priority={index < 4}
                                    />

                                    {/* SCANNER LINE ANIMATION (HOVER) */}
                                    <div className="absolute inset-0 w-full h-[2px] bg-emerald-500/10 -translate-y-full group-hover:animate-scan z-30 pointer-events-none" />
                                </div>

                                {/* EDGE GLOW (HOVER) */}
                                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CUSTOM KEYFRAMES */}
            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(500px); }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
            `}</style>
        </div>
    );
}