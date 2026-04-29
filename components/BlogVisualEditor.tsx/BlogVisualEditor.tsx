'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { BlogArticle } from '@/data/lists/blogArticle';
import {
    Plus, Trash2, ChevronUp, ChevronDown,
    Type, Layout, Image as ImageIcon, Code,
    Settings, Save, Eye, LayoutDashboard, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogVisualEditorProps {
    onArticleSubmit: (article: BlogArticle) => void;
    initialData?: BlogArticle;
}

const generateId = () => `node_${Math.random().toString(36).slice(2, 11)}`;

const AutoExpandingTextarea = ({ value, onChange, placeholder, className }: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    className: string;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useLayoutEffect(() => {
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

export default function BlogVisualEditor({ onArticleSubmit, initialData }: BlogVisualEditorProps) {
    const [article, setArticle] = useState<BlogArticle>(initialData || {
        id: generateId(),
        title: '',
        category: '',
        image: '',
        createdAt: new Date().toISOString(),
        sections: [{ id: generateId(), heading: 'Introduction', content: '', type: 'text', codeLanguage: 'typescript', items: [] }]
    });

    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [isSticky, setIsSticky] = useState(false);

    // ✅ Fix 1: Only sync initialData when the ID changes to prevent wiping local edits
    useEffect(() => {
        if (initialData) {
            setArticle(initialData);
        }
    }, [initialData?.id]);

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ Fix 2: Clean Deep Update Logic
    const updateSection = (index: number, fields: Partial<BlogArticle['sections'][number]>) => {
        setArticle(prev => {
            const newSections = [...prev.sections];
            newSections[index] = { ...newSections[index], ...fields };
            return { ...prev, sections: newSections };
        });
    };

    const addItemToSection = (sectionIndex: number) => {
        const currentItems = article.sections[sectionIndex].items || [];
        const newItem = {
            name: "NEW_SPEC_ITEM",
            description: "",
            details: [{ label: "Spec", value: "Value" }]
        };
        updateSection(sectionIndex, { items: [...currentItems, newItem] });
    };

    const updateItem = (sIdx: number, iIdx: number, fields: any) => {
        const newItems = [...(article.sections[sIdx].items || [])];
        newItems[iIdx] = { ...newItems[iIdx], ...fields };
        updateSection(sIdx, { items: newItems });
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

    return (
        <div className="max-w-5xl mx-auto pb-40 px-4">
            {/* TOOLBAR */}
            <div className={isSticky ? 'h-[74px] mb-10' : ''}>
                <div className={`transition-all duration-300 z-50 ${isSticky ? 'fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl' : 'mb-10'}`}>
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl shadow-2xl flex items-center justify-between">
                        <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800/50">
                            <button onClick={() => setActiveTab('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}>
                                <Type size={14} /> Editor
                            </button>
                            <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}>
                                <Eye size={14} /> Preview
                            </button>
                        </div>
                        <button onClick={() => onArticleSubmit(article)} className="px-6 py-2.5 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2">
                            <Save size={14} /> Commit_Uplink
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'edit' ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header Editor */}
                    <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-8 md:p-12">
                        <input
                            type="text"
                            placeholder="Post Title..."
                            className="w-full bg-transparent text-4xl md:text-6xl font-black uppercase tracking-tighter text-white placeholder:text-zinc-900 focus:outline-none"
                            value={article.title}
                            onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <input value={article.category} placeholder="CATEGORY" onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))} className="bg-black/40 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 outline-none" />
                            <input value={article.image} placeholder="IMAGE_URL" onChange={(e) => setArticle(prev => ({ ...prev, image: e.target.value }))} className="bg-black/40 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 outline-none" />
                        </div>
                    </section>

                    {/* Section Editor */}
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {article.sections.map((section, index) => (
                                <motion.div key={section.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => moveSection(index, 'up')} className="p-1.5 bg-zinc-800 rounded-md text-zinc-400 hover:text-emerald-400"><ChevronUp size={14} /></button>
                                        <button onClick={() => moveSection(index, 'down')} className="p-1.5 bg-zinc-800 rounded-md text-zinc-400 hover:text-emerald-400"><ChevronDown size={14} /></button>
                                    </div>

                                    <div className="flex gap-2 mb-6 bg-black/40 w-fit p-1 rounded-lg border border-zinc-800/50">
                                        <button onClick={() => updateSection(index, { type: 'text' })} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${section.type !== 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>TEXT</button>
                                        <button onClick={() => updateSection(index, { type: 'code' })} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${section.type === 'code' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-500'}`}>CODE</button>
                                    </div>

                                    <input placeholder="Heading..." value={section.heading} onChange={(e) => updateSection(index, { heading: e.target.value })} className="w-full bg-transparent text-xl font-bold uppercase text-emerald-500 outline-none mb-4" />

                                    <AutoExpandingTextarea
                                        value={section.content}
                                        onChange={(val) => updateSection(index, { content: val })}
                                        placeholder="Start writing..."
                                        className={`w-full bg-transparent leading-relaxed ${section.type === 'code' ? 'font-mono text-xs text-emerald-400 bg-black/20 p-4 rounded-xl' : 'text-zinc-400'}`}
                                    />

                                    {/* ✅ Fix 3: Sub-Item Spec Editor UI */}
                                    <div className="mt-8 space-y-4">
                                        {section.items?.map((item, iIdx) => (
                                            <div key={iIdx} className="p-4 bg-black/40 border border-zinc-900 rounded-2xl relative">
                                                <input className="bg-transparent font-bold text-white text-sm outline-none w-full" value={item.name} onChange={(e) => updateItem(index, iIdx, { name: e.target.value })} />
                                                <textarea className="bg-transparent text-xs text-zinc-500 outline-none w-full resize-none mt-2" value={item.description} onChange={(e) => updateItem(index, iIdx, { description: e.target.value })} />
                                                <button onClick={() => {
                                                    const filtered = section.items?.filter((_, i) => i !== iIdx);
                                                    updateSection(index, { items: filtered });
                                                }} className="absolute top-2 right-2 text-zinc-800 hover:text-red-500"><Trash2 size={12} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addItemToSection(index)} className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 hover:text-emerald-500">
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
                        <h1 className="text-6xl font-black uppercase text-white tracking-tighter leading-none">{article.title || 'UNTITLED_PAYLOAD'}</h1>
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