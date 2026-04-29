import React, { useState, useEffect } from 'react';
import { BlogArticle } from '@/data/lists/blogArticle';
import { Plus, Trash2, Hash, Type, Image as ImageIcon, Calendar, Layers, Box, Database } from 'lucide-react';

// Helper function to generate a unique ID (for new items/sections)
const generateUniqueId = () => Math.random().toString(36).slice(2, 11);

interface BlogArticleFormProps {
    onArticleSubmit: (article: BlogArticle) => void;
}

const BlogArticleForm: React.FC<BlogArticleFormProps> = ({ onArticleSubmit }) => {
    const [isMounted, setIsMounted] = useState(false);

    const [article, setArticle] = useState<BlogArticle>({
        id: generateUniqueId(),
        title: '',
        category: '',
        image: '',
        ogImage: '',
        createdAt: new Date().toISOString(),
        sections: [],
    });

    // Ensure component only renders on the client to avoid SSR hydration mismatches
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="animate-pulse h-[600px] bg-zinc-900/20 rounded-2xl border border-zinc-800" />;

    const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setArticle((prevArticle) => ({
            ...prevArticle,
            [name]: value,
        } as unknown as BlogArticle));
    };

    const handleSectionChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const newSections = [...article.sections];
        newSections[index] = {
            ...newSections[index],
            [name]: value,
        } as any;
        setArticle((prevArticle) => ({
            ...prevArticle,
            sections: newSections,
        }));
    };

    const addSection = () => {
        setArticle((prevArticle) => ({
            ...prevArticle,
            sections: [
                ...prevArticle.sections,
                { id: generateUniqueId(), type: 'text', heading: '', content: '', items: [] },
            ],
        }));
    };

    const removeSection = (index: number) => {
        setArticle((prevArticle) => ({
            ...prevArticle,
            sections: prevArticle.sections.filter((_, i) => i !== index),
        }));
    };

    const handleItemChange = (
        sectionIndex: number,
        itemIndex: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const newSections = [...article.sections];
        if (newSections[sectionIndex].items) {
            newSections[sectionIndex].items![itemIndex] = {
                ...newSections[sectionIndex].items![itemIndex],
                [name]: value,
            } as any;
            setArticle((prevArticle) => ({
                ...prevArticle,
                sections: newSections,
            }));
        }
    };

    const addItem = (sectionIndex: number) => {
        const newSections = [...article.sections];
        if (!newSections[sectionIndex].items) {
            newSections[sectionIndex].items = [];
        }
        newSections[sectionIndex].items!.push({
            name: '',
            description: '',
            details: [],
        });
        setArticle((prevArticle) => ({
            ...prevArticle,
            sections: newSections,
        }));
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...article.sections];
        if (newSections[sectionIndex].items) {
            newSections[sectionIndex].items = newSections[sectionIndex].items!.filter(
                (_, i) => i !== itemIndex
            );
            setArticle((prevArticle) => ({
                ...prevArticle,
                sections: newSections,
            }));
        }
    };

    const handleDetailChange = (
        sectionIndex: number,
        itemIndex: number,
        detailIndex: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        const newSections = [...article.sections];
        if (newSections[sectionIndex].items && newSections[sectionIndex].items![itemIndex].details) {
            newSections[sectionIndex].items![itemIndex].details![detailIndex] = {
                ...newSections[sectionIndex].items![itemIndex].details![detailIndex],
                [name]: value,
            } as any;
            setArticle((prevArticle) => ({
                ...prevArticle,
                sections: newSections,
            }));
        }
    };

    const addDetail = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...article.sections];
        if (newSections[sectionIndex].items) {
            if (!newSections[sectionIndex].items![itemIndex].details) {
                newSections[sectionIndex].items![itemIndex].details = [];
            }
            newSections[sectionIndex].items![itemIndex].details!.push({
                label: '',
                value: '',
            });
            setArticle((prevArticle) => ({
                ...prevArticle,
                sections: newSections,
            }));
        }
    };

    const removeDetail = (sectionIndex: number, itemIndex: number, detailIndex: number) => {
        const newSections = [...article.sections];
        if (newSections[sectionIndex].items && newSections[sectionIndex].items![itemIndex].details) {
            newSections[sectionIndex].items![itemIndex].details = newSections[sectionIndex].items![itemIndex].details!.filter(
                (_, i) => i !== detailIndex
            );
            setArticle((prevArticle) => ({
                ...prevArticle,
                sections: newSections,
            }));
        }
    };

    const loadSampleData = () => {
        setArticle({
            id: generateUniqueId(),
            title: 'NEURAL_LINK_OPTIMIZATION_V2',
            category: 'HARDWARE_PROTOCOLS',
            image: 'images/blog/neural-uplink.jpg',
            ogImage: 'images/blog/og-preview.jpg',
            createdAt: new Date().toISOString(),
            sections: [
                {
                    id: generateUniqueId(),
                    type: 'text',
                    heading: 'SYNAPTIC_BANDWIDTH_EXPANSION',
                    content: 'Testing the limits of the new Lizard-Core architecture in high-latency environments.',
                    items: [
                        {
                            name: 'Lizard-V1 Processor',
                            description: 'Primary compute unit for neural signal translation.',
                            image: 'assets/hardware/core.png',
                            details: [
                                { label: 'CLOCK_SPEED', value: '8.4 GHz' },
                                { label: 'THERMAL_THRESHOLD', value: '45C' }
                            ]
                        }
                    ]
                },
                {
                    id: generateUniqueId(),
                    type: 'text',
                    heading: 'SECURITY_ENCLAVE_ENFORCEMENT',
                    content: 'Implementing zero-trust architecture at the bios-level layer.',
                    items: []
                }
            ],
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onArticleSubmit(article);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-mono">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Hash size={14} className="text-emerald-500" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Initialize_New_Entry</h2>
                </div>
                <button
                    type="button"
                    onClick={loadSampleData}
                    className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-emerald-400 transition-colors border border-zinc-800 px-3 py-1.5 rounded-md bg-zinc-900/50"
                >
                    <Database size={12} /> Load_Sample_Payload
                </button>
            </div>

            {/* Article Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label htmlFor="title" className="text-[10px] uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Type size={12} /> Header_Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={article.title}
                        onChange={handleArticleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-emerald-500/50 outline-none transition-colors"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="category" className="text-[10px] uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Layers size={12} /> Schema_Type
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={article.category}
                        onChange={handleArticleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-emerald-500/50 outline-none transition-colors"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="image" className="text-[10px] uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <ImageIcon size={12} /> Asset_Path_UI
                    </label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={article.image}
                        onChange={handleArticleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-emerald-500/50 outline-none transition-colors"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="ogImage" className="text-[10px] uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <ImageIcon size={12} /> Asset_Path_OG
                    </label>
                    <input
                        type="text"
                        id="ogImage"
                        name="ogImage"
                        value={article.ogImage || ''}
                        onChange={handleArticleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-emerald-500/50 outline-none transition-colors"
                    />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="createdAt" className="text-[10px] uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                        <Calendar size={12} /> System_Timestamp
                    </label>
                    <input
                        type="datetime-local"
                        id="createdAt"
                        name="createdAt"
                        value={article.createdAt.substring(0, 16)}
                        onChange={(e) => setArticle({ ...article, createdAt: new Date(e.target.value).toISOString() })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-emerald-500/50 outline-none transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Content_Segments</h3>
                    <button
                        type="button"
                        onClick={addSection}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-400 transition-colors"
                    >
                        <Plus size={14} /> Add_Segment
                    </button>
                </div>

                {article.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="relative border border-zinc-800 rounded-xl p-5 space-y-4 bg-zinc-900/20 backdrop-blur-sm group">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase">Segment::{sectionIndex + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeSection(sectionIndex)}
                                className="text-zinc-600 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div>
                            <label htmlFor={`section-${sectionIndex}-heading`} className="block text-[9px] uppercase text-zinc-500 mb-1">Segment_Heading</label>
                            <input
                                type="text"
                                id={`section-${sectionIndex}-heading`}
                                name="heading"
                                value={section.heading}
                                onChange={(e) => handleSectionChange(sectionIndex, e)}
                                className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-zinc-700"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`section-${sectionIndex}-content`} className="block text-[9px] uppercase text-zinc-500 mb-1">Raw_Payload_Data</label>
                            <textarea
                                id={`section-${sectionIndex}-content`}
                                name="content"
                                value={section.content}
                                onChange={(e) => handleSectionChange(sectionIndex, e)}
                                rows={4}
                                className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-zinc-700 resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Items within Section */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <div className="flex items-center justify-between">
                                <h5 className="text-[9px] font-bold uppercase text-zinc-400 flex items-center gap-2">
                                    <Box size={12} /> Nested_Object_Array
                                </h5>
                                <button
                                    type="button"
                                    onClick={() => addItem(sectionIndex)}
                                    className="text-[8px] font-bold text-emerald-500/60 hover:text-emerald-400 uppercase tracking-widest"
                                >
                                    [+] Insert_Object
                                </button>
                            </div>

                            {section.items?.map((item, itemIndex) => (
                                <div key={itemIndex} className="border-l border-zinc-800 ml-2 pl-4 py-2 space-y-3 relative">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[8px] uppercase text-zinc-600 mb-1">Item_Identifier</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(sectionIndex, itemIndex, e)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-[10px] text-zinc-300 outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] uppercase text-zinc-600 mb-1">Item_Asset_URI</label>
                                            <input
                                                type="text"
                                                name="image"
                                                value={item.image || ''}
                                                onChange={(e) => handleItemChange(sectionIndex, itemIndex, e)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-[10px] text-zinc-300 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[8px] uppercase text-zinc-600 mb-1">Item_Descriptor</label>
                                        <textarea
                                            name="description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(sectionIndex, itemIndex, e)}
                                            rows={2}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-[10px] text-zinc-300 outline-none resize-none"
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Details within Item */}
                                    {item.details?.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                name="label"
                                                placeholder="KEY"
                                                value={detail.label}
                                                onChange={(e) => handleDetailChange(sectionIndex, itemIndex, detailIndex, e)}
                                                className="w-1/3 bg-black border border-zinc-800 rounded p-1.5 text-[9px] text-emerald-500 uppercase outline-none"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="value"
                                                placeholder="VAL"
                                                value={detail.value}
                                                onChange={(e) => handleDetailChange(sectionIndex, itemIndex, detailIndex, e)}
                                                className="w-2/3 bg-black border border-zinc-800 rounded p-1.5 text-[9px] text-zinc-400 outline-none"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDetail(sectionIndex, itemIndex, detailIndex)}
                                                className="text-zinc-700 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => addDetail(sectionIndex, itemIndex)}
                                            className="text-[8px] font-bold text-zinc-500 hover:text-zinc-300 uppercase"
                                        >
                                            + Add_Key_Val
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(sectionIndex, itemIndex)}
                                            className="text-[8px] font-bold text-rose-500/50 hover:text-rose-500 uppercase"
                                        >
                                            Delete_Object
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="submit"
                className="w-full mt-10 bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            >
                Commit_To_Uplink
            </button>
        </form>
    );
};

export default BlogArticleForm;