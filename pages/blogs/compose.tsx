import React, { useState, useRef, useEffect } from 'react';
import { BlogArticle } from '@/data/lists/blogArticle';
import {
    Plus, Trash2, ChevronUp, ChevronDown,
    Type, Layout, Image as ImageIcon, Code,
    Settings, Save, Eye, LayoutDashboard,
    PlusCircle, ListFilter,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const generateId = () => `node_${Math.random().toString(36).slice(2, 11)}`;

/**
 * Auto-expanding textarea for seamless writing
 */
const AutoExpandingTextarea = ({ value, onChange, placeholder, className }: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    className: string;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className={`${className} resize-none overflow-hidden`}
        />
    );
};

export default function ComposeBlogPage() {
    const [article, setArticle] = useState<BlogArticle>({
        id: generateId(),
        title: '',
        category: '',
        image: '',
        createdAt: new Date().toISOString(),
        sections: [{ id: generateId(), heading: 'Introduction', content: '', type: 'text', codeLanguage: 'typescript', items: [] }]
    });

    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [isSticky, setIsSticky] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load draft from localStorage on mount and handle scroll
    useEffect(() => {
        const savedDraft = localStorage.getItem('lizard_blog_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setArticle(parsed);
                console.info("Workspace Hydrated: Draft recovered from localStorage.");
            } catch (e) {
                console.error("Failed to recover draft:", e);
            }
        }
        setIsHydrated(true);

        const handleScroll = () => setIsSticky(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCommit = () => {
        try {
            localStorage.setItem('lizard_blog_draft', JSON.stringify(article));
            alert("Workspace state committed to local storage.");
        } catch (e) {
            console.error("Persistence failed:", e);
        }
    };

    // --- LOGIC ENGINE ---

    const updateSection = (index: number, fields: Partial<BlogArticle['sections'][number]>) => {
        setArticle(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], ...fields };
            return { ...prev, sections: newSections };
        });
    };

    const addSection = () => {
        setArticle(prev => ({
            ...prev,
            sections: [...prev.sections, {
                id: generateId(),
                heading: '',
                content: '',
                type: 'text',
                codeLanguage: 'typescript',
                items: []
            }]
        }));
    };

    const removeSection = (index: number) => {
        setArticle(prev => {
            if (prev.sections.length <= 1) return prev;
            return { ...prev, sections: prev.sections.filter((_, i) => i !== index) };
        });
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        setArticle(prev => {
            const newSections = [...prev.sections];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= newSections.length) return prev;
            [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
            return { ...prev, sections: newSections };
        });
    };

    const addItemToSection = (sectionIndex: number) => {
        const currentItems = article.sections[sectionIndex].items || [];
        const newItem = {
            id: generateId(),
            name: "NEW_SPEC_ITEM",
            description: "",
            details: [{ label: "Spec", value: "Value" }]
        };
        updateSection(sectionIndex, { items: [...currentItems, newItem] });
    };

    const updateItem = (sIdx: number, itemIdx: number, fields: Partial<NonNullable<BlogArticle['sections'][number]['items']>[number]>) => {
        const newItems = [...(article.sections[sIdx].items || [])];
        if (newItems[itemIdx]) {
            newItems[itemIdx] = { ...newItems[itemIdx], ...fields };
            updateSection(sIdx, { items: newItems });
        }
    };

    // Prevent rendering until hydration to avoid state jumps
    if (!isHydrated) return <div className="min-h-screen bg-black" />;

    const removeItem = (sIdx: number, itemIdx: number) => {
        const newItems = (article.sections[sIdx].items || []).filter((_, i) => i !== itemIdx);
        updateSection(sIdx, { items: newItems });
    };

    return (
        <div className="max-w-5xl pt-36 mx-auto pb-40 px-4">
            {/* STICKY TOOLBAR */}
            <div className={isSticky ? 'h-[74px] mb-10' : ''}>
                <div className={`transition-all duration-300 z-50 ${isSticky ? 'fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl' : 'mb-10'}`}>
                    <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl shadow-2xl flex items-center justify-between">
                        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800/50">
                            <button onClick={() => setActiveTab('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>
                                <Type size={14} /> Editor
                            </button>
                            <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>
                                <Eye size={14} /> Preview
                            </button>
                            {/* Link to the client-side draft preview page */}
                            <Link
                                href="/admin/blog/draft"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all text-zinc-500 hover:text-white">
                                <ExternalLink size={14} /> Live Draft
                            </Link>
                        </div>
                        <button onClick={handleCommit} className="px-6 py-2.5 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2">
                            <Save size={14} /> Commit_Payload
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'edit' ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* COVER DATA */}
                    <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-8">
                        <input
                            type="text"
                            placeholder="ARTICLE_TITLE..."
                            className="w-full bg-transparent text-5xl font-black uppercase tracking-tighter text-white placeholder:text-zinc-900 focus:outline-none mb-8"
                            value={article.title}
                            onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-emerald-500">Category_Tag</label>
                                <input value={article.category} onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-black/40 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:border-emerald-500/40 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-emerald-500">Image_Asset_Path</label>
                                <input value={article.image} onChange={(e) => setArticle(prev => ({ ...prev, image: e.target.value }))} className="w-full bg-black/40 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 focus:border-emerald-500/40 outline-none" />
                            </div>
                        </div>
                    </section>

                    {/* CANVAS */}
                    <div className="space-y-8">
                        <AnimatePresence mode="popLayout">
                            {article.sections.map((section, index) => (
                                <motion.div key={section.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative bg-zinc-950 border border-zinc-900 rounded-3xl p-8 hover:border-emerald-500/20 transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex gap-2 bg-black/40 w-fit p-1 rounded-lg border border-zinc-800/50">
                                            <button onClick={() => updateSection(index, { type: 'text' })} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${section.type === 'text' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>TEXT</button>
                                            <button onClick={() => updateSection(index, { type: 'code' })} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${section.type === 'code' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-500'}`}>CODE</button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => moveSection(index, 'up')} className="p-2 bg-zinc-900 rounded-xl text-zinc-500 hover:text-emerald-500 transition-colors"><ChevronUp size={14} /></button>
                                            <button onClick={() => moveSection(index, 'down')} className="p-2 bg-zinc-900 rounded-xl text-zinc-500 hover:text-emerald-500 transition-colors"><ChevronDown size={14} /></button>
                                            <button onClick={() => removeSection(index)} className="p-2 bg-zinc-900 rounded-xl text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </div>

                                    <input
                                        placeholder="Section Heading..."
                                        className="w-full bg-transparent text-xl font-bold uppercase text-emerald-500 placeholder:text-zinc-900 outline-none mb-4"
                                        value={section.heading || ''} // Ensure value is always a string
                                        onChange={(e) => updateSection(index, { heading: e.target.value })}
                                    />

                                    <AutoExpandingTextarea
                                        placeholder="Write content..."
                                        className={`w-full bg-transparent leading-relaxed ${section.type === 'code' ? 'font-mono text-xs text-emerald-400 bg-black/20 p-4 rounded-xl' : 'text-zinc-400'}`}
                                        value={section.content || ''} // Ensure value is always a string
                                        onChange={(val) => updateSection(index, { content: val })}
                                    />

                                    {/* NESTED ITEMS (Laptop Specs, Gear etc.) */}
                                    <div className="mt-8 space-y-4">
                                        {section.items?.map((item, itemIdx) => (
                                            <div key={item.id || itemIdx} className="p-4 bg-black/40 border border-zinc-900 rounded-2xl relative group/item">
                                                <input
                                                    className="bg-transparent font-bold text-white text-sm outline-none w-full mb-1"
                                                    value={item.name || ''} // Ensure value is always a string
                                                    onChange={(e) => updateItem(index, itemIdx, { name: e.target.value })}
                                                />
                                                <textarea
                                                    className="bg-transparent text-xs text-zinc-500 outline-none w-full resize-none"
                                                    value={item.description || ''} // Ensure value is always a string
                                                    onChange={(e) => updateItem(index, itemIdx, { description: e.target.value })}
                                                />
                                                <button
                                                    onClick={() => removeItem(index, itemIdx)}
                                                    className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 text-zinc-700 hover:text-red-500 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addItemToSection(index)}
                                            className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 hover:text-emerald-500 transition-colors"
                                        >
                                            <PlusCircle size={12} /> APPEND_SPEC_ITEM
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button onClick={addSection} className="w-full py-12 border-2 border-dashed border-zinc-900 rounded-3xl text-zinc-800 hover:text-emerald-500 hover:border-emerald-500/20 transition-all flex flex-col items-center gap-3">
                            <Plus size={24} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Inject_New_Segment</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* PREVIEW MODE */
                <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 md:p-24 space-y-12">
                    <div className="space-y-4">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase">{article.category || 'CATEGORY'}</span>
                        <h1 className="text-6xl font-black uppercase text-white tracking-tighter leading-none">{article.title || 'UNTITLED_PROTOCOL'}</h1>
                    </div>
                    <div className="space-y-16">
                        {article.sections.map((s) => (
                            <div key={s.id} className="space-y-6">
                                {s.heading && <h3 className="text-2xl font-black italic uppercase text-white border-l-4 border-emerald-500 pl-6">{s.heading}</h3>}
                                {s.type === 'code' ? (
                                    <pre className="bg-black border border-zinc-900 p-8 rounded-3xl font-mono text-xs text-emerald-400 overflow-x-auto">
                                        <code>{s.content}</code>
                                    </pre>
                                ) : (
                                    <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">{s.content}</p>
                                )}

                                {/* Render Nested Items in Preview */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {s.items?.map((item, idx) => (
                                        <div key={idx} className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                                            <h4 className="text-white font-bold uppercase mb-2">{item.name}</h4>
                                            <p className="text-xs text-zinc-500">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}