import { useState } from 'react';
import ScreenContainer from '@/components/shared/ScreenContainer/ScreenContainer';
import BlogArticleForm from '@/components/BlogArticleForm/BlogArticleForm';
import { BlogArticle } from '@/data/lists/blogArticle';

export default function AddBlogPage() {
    const [submittedData, setSubmittedData] = useState<BlogArticle | null>(null);

    const handleFormSubmit = (article: BlogArticle) => {
        setSubmittedData(article);
        // Smooth scroll to the output for better UX on mobile
        if (window.innerWidth < 1024) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    };

    return (
        <ScreenContainer>
            <div className="mb-10 pt-32 text-center">
                <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic">
                    Content <span className="text-emerald-500">Uplink</span>
                </h1>
                <p className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">
                    Auth: Administrator // Schema: Blog_Article_v1
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Form Section */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Entry_Parameters</span>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-zinc-800" />
                            <div className="w-2 h-2 rounded-full bg-zinc-800" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                        </div>
                    </div>

                    {/* Updated wrapper to match terminal aesthetic */}
                    <div className="p-6">
                        <BlogArticleForm onArticleSubmit={handleFormSubmit} />
                    </div>
                </div>

                {/* Output/Preview Section */}
                <div className="space-y-6 lg:sticky lg:top-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                            Live_Payload_Preview
                        </h2>
                    </div>

                    {submittedData ? (
                        <div className="relative group animate-in zoom-in-95 duration-300">
                            <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative bg-black border border-zinc-800 p-6 rounded-2xl font-mono text-[11px] leading-relaxed text-emerald-400 overflow-auto max-h-[750px] shadow-2xl custom-scrollbar">
                                <div className="text-zinc-600 mb-4 uppercase text-[9px] tracking-[0.3em]">
                                    &gt; article_object_ready_for_commit
                                </div>
                                <pre className="whitespace-pre-wrap">{JSON.stringify(submittedData, null, 2)}</pre>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl text-zinc-600 font-mono uppercase text-[10px] tracking-widest bg-zinc-950/20">
                            <div className="w-8 h-8 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-4" />
                            Waiting_for_submission...
                        </div>
                    )}
                </div>
            </div>
        </ScreenContainer>
    );
}
