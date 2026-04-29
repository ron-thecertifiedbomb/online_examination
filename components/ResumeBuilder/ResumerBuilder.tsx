"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Plus, Trash2, Download, RotateCcw, FileText,
    User, Briefcase, GraduationCap, Users, PenTool, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DateRangePicker from "../DateRangePicker/DateRangePicker";
import Input from "../shared/Input/Input";
import Textarea from "../shared/TextArea/TextArea";
import Button from "../shared/Button/Button";
import { twolayoutPDF } from "../../lib/printPdf.ts/twolayoutPDF";
import { ModernMinimalistPreview } from "./preview/ModernMinimalistPreview";

export default function ResumeBuilder() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [personal, setPersonal] = useState({ fullName: "", title: "", email: "", phone: "", location: "", summary: "" });
    const [experience, setExperience] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [references, setReferences] = useState<any[]>([]);

    useEffect(() => {
        const raw = localStorage.getItem("resumeBuilder:v1");
        if (raw) {
            const parsed = JSON.parse(raw);
            setPersonal(parsed.personal || personal);
            setExperience(parsed.experience || []);
            setEducation(parsed.education || []);
            setSkills(parsed.skills || []);
            setReferences(parsed.references || []);
        } else {
            setExperience([{ id: Date.now(), company: "", role: "", start: "", end: "", details: "" }]);
            setEducation([{ id: Date.now() + 1, school: "", degree: "", start: "", end: "", details: "" }]);
            setReferences([{ id: Date.now() + 2, name: "", contact: "", relation: "" }]);
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (hasLoaded) {
            const payload = { personal, experience, education, skills, references };
            localStorage.setItem("resumeBuilder:v1", JSON.stringify(payload));
        }
    }, [personal, experience, education, skills, references, hasLoaded]);

    const updatePersonal = (key: string, value: string) => setPersonal(s => ({ ...s, [key]: value }));
    const addExperience = () => setExperience(s => [...s, { id: Date.now(), company: "", role: "", start: "", end: "", details: "" }]);
    const updateExperience = (id: number, key: string, value: string) => setExperience(s => s.map(row => (row.id === id ? { ...row, [key]: value } : row)));
    const removeExperience = (id: number) => setExperience(s => s.filter(x => x.id !== id));

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify({ personal, experience, education, skills, references }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${personal.fullName || "resume"}.json`;
        a.click();
    };

    if (!hasLoaded) return null;

    return (
        <div className="w-full bg-black text-zinc-300 font-sans selection:bg-emerald-500 selection:text-black">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* HUD HEADER */}
                <div className="flex justify-between items-start bg-[#080808] border border-zinc-900 p-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3 h-3 text-emerald-500" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System.Resume_v2</h2>
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase font-mono tracking-tighter italic">
                            Status: ARCHITECTING_PROFILE // Persistence: LOCAL_STORAGE
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={downloadJSON} className="p-2 border border-zinc-900 hover:text-white transition-colors"><Download size={16} /></button>
                        <button onClick={() => { localStorage.removeItem("resumeBuilder:v1"); window.location.reload(); }} className="p-2 border border-zinc-900 hover:text-red-500 transition-colors"><RotateCcw size={16} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: DATA ENTRY */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* PERSONAL INFO */}
                        <Module title="Personal_Identity" icon={<User size={14} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(personal).filter(([k]) => k !== "summary").map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <label className="text-[8px] uppercase font-mono text-zinc-600">{key}</label>
                                        <input
                                            value={value}
                                            onChange={(e) => updatePersonal(key, e.target.value)}
                                            className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-emerald-500/50 outline-none transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-1">
                                <label className="text-[8px] uppercase font-mono text-zinc-600">Executive_Summary</label>
                                <textarea
                                    value={personal.summary}
                                    onChange={(e) => updatePersonal("summary", e.target.value)}
                                    className="w-full bg-black border border-zinc-900 p-3 text-xs text-white h-32 resize-none focus:border-emerald-500/50 outline-none transition-all"
                                />
                            </div>
                        </Module>

                        {/* EXPERIENCE */}
                        <Module title="Professional_Timeline" icon={<Briefcase size={14} />}>
                            <div className="space-y-6">
                                {experience.map((exp, idx) => (
                                    <div key={exp.id} className="p-4 border border-zinc-900 bg-black/50 relative group">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <input placeholder="COMPANY" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="bg-transparent border-b border-zinc-900 p-2 text-xs outline-none focus:border-emerald-500 transition-all" />
                                            <input placeholder="ROLE" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} className="bg-transparent border-b border-zinc-900 p-2 text-xs outline-none focus:border-emerald-500 transition-all" />
                                        </div>
                                        <textarea placeholder="DETAILS" value={exp.details} onChange={(e) => updateExperience(exp.id, "details", e.target.value)} className="w-full bg-transparent border border-zinc-900 p-3 text-[11px] h-20 resize-none outline-none" />
                                        <button onClick={() => removeExperience(exp.id)} className="absolute -top-2 -right-2 bg-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                                    </div>
                                ))}
                                <button onClick={addExperience} className="w-full border border-dashed border-zinc-800 p-3 text-[10px] uppercase tracking-widest hover:border-emerald-500 transition-all flex items-center justify-center gap-2">
                                    <Plus size={14} /> Append_Experience
                                </button>
                            </div>
                        </Module>

                    </div>

                    {/* RIGHT: PREVIEW & EXPORT */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="sticky top-24">
                            <div className="flex justify-between items-center px-1 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Render_Output</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => twolayoutPDF(personal, experience, education, references, skills)}
                                        className="bg-emerald-600 text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                                    >
                                        <FileText size={12} /> Generate_PDF
                                    </button>
                                </div>
                            </div>

                            {/* PREVIEW CONTAINER: Mimics a printed sheet */}
                            <div className="bg-[#080808] border border-zinc-900 p-1 shadow-2xl">
                                <div className="bg-white overflow-hidden aspect-[1/1.41] transform scale-100 origin-top">
                                    <ModernMinimalistPreview
                                        personal={personal}
                                        experience={experience}
                                        education={education}
                                        references={references}
                                        skills={skills}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for industrial modules
function Module({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-[#080808] border border-zinc-900 p-6 relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-900 text-emerald-500">{icon}</div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{title}</h3>
            </div>
            {children}
        </div>
    );
}