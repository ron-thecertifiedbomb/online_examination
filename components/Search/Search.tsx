import { useState } from 'react';

export default function SearchFeature() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        // DEBOUNCE/SPAM PROTECTION: 
        // 1. Don't run if empty
        // 2. Don't run if we are already loading (prevents double-click 429s)
        if (!query.trim() || loading) return;

        setLoading(true);
        setResult('');

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query }),
            });

            const data = await res.json();

            if (res.status === 429) {
                setResult("The Void is a bit crowded. Wait 60 seconds and try again.");
            } else {
                setResult(data.text || data.answer || "No response from the void.");
                setQuery(''); // Clear field on success
            }
        } catch (error) {
            setResult("The connection was lost in the void. Try again.");
        } finally {
            // Keep the loading state for a tiny bit longer to feel "natural"
            // and prevent accidental rapid-fire clicks.
            setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search ..."
                    className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:ring-[0.5px] focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        'Search'
                    )}
                </button>
            </form>

            {result && (
                <div className="mt-6 p-5 animate-in fade-in slide-in-from-top-2 duration-300 border-l-2 border-emerald-500 bg-zinc-800/50 rounded-r-lg">
                    <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}