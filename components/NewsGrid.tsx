'use client';
import { useEffect, useState } from 'react';

type NormalizedItem = {
    title: string;
    link: string;
    source: string;
    date: string | null;
    summary: string;
};

interface NewsGridProps {
    category: string;
    title?: string;
    subtitle?: string;
}

export default function NewsGrid({ category, title, subtitle }: NewsGridProps) {
    const [items, setItems] = useState<NormalizedItem[]>([]);

    useEffect(() => {
        if (!category) return;

        fetch(`/api/news?category=${category}`)
            .then(res => res.json())
            .then(setItems)
            .catch(console.error);
    }, [category]);

    if (!category) return null;

    return (
        <section className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col items-start justify-between mb-6 gap-2">
                <h2 className="text-2xl font-semibold text-white">
                    {title || `${category.charAt(0).toUpperCase() + category.slice(1)} News`}
                </h2>
                {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
            </div>

            {/* News List */}
            <div className="flex flex-col gap-4">
                {items.map((it, idx) => (
                    <a
                        key={idx}
                        href={it.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-150"
                    >
                        <h3 className="text-lg font-medium text-white">{it.title}</h3>
                        <p className="text-sm text-gray-300 mt-1 line-clamp-3">{it.summary}</p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                            <span>{it.source}</span>
                            {it.date ? (
                                <time dateTime={it.date}>{new Date(it.date).toLocaleString()}</time>
                            ) : (
                                <span>—</span>
                            )}
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
                <span>Composed from public RSS feeds • Free</span>
            </div>
        </section>
    );
}
