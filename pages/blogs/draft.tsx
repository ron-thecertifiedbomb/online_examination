import React, { useState, useEffect } from 'react';
import { BlogArticle } from '@/data/lists/blogArticle';
import ScreenContainer from '@/components/shared/ScreenContainer/ScreenContainer';
import BlogContent from '@/components/BlogContent/BlogContent';
import Head from 'next/head';

export default function BlogDraftPage() {
    const [draftArticle, setDraftArticle] = useState<BlogArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ensure this runs only on the client-side where localStorage is available
        if (typeof window !== 'undefined') {
            const savedDraft = localStorage.getItem('lizard_blog_draft');
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    setDraftArticle(parsed);
                    console.info("Draft preview loaded from localStorage.");
                } catch (e) {
                    console.error("Failed to parse local draft for preview:", e);
                }
            }
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <ScreenContainer>
                <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading draft...</div>
            </ScreenContainer>
        );
    }

    if (!draftArticle) {
        return (
            <ScreenContainer>
                <div className="min-h-screen flex items-center justify-center text-zinc-500">No draft found in local storage. Start composing a new blog post!</div>
            </ScreenContainer>
        );
    }

    return (
        <>
            <Head>
                <title>{draftArticle.title || 'Untitled Draft'} - Draft Preview</title>
                <meta name="description" content={draftArticle.sections?.[0]?.content?.substring(0, 160) || "Preview of your blog draft."} />
            </Head>
            <ScreenContainer>
                <div className="max-w-4xl mx-auto pt-20 md:pt-28 pb-20 md:pb-40 px-4 md:px-6">
                    <h1 className="text-4xl font-black uppercase text-white mb-8">Draft Preview: {draftArticle.title || 'Untitled'}</h1>
                    <BlogContent article={draftArticle} />
                </div>
            </ScreenContainer>
        </>
    );
}