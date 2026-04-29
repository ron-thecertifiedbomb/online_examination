/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
    FileText,
    Scissors,
    Combine,
    Trash2,
    Plus,
    Loader2,
    ShieldCheck,
    Zap,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from "../shared/Panel/Panel";
import { ToolHeader } from "../shared/ToolHeader/ToolHeader";

interface PDFFile {
    id: string;
    file: File;
    pageCount: number;
}

export default function PdfEditor() {
    const [files, setFiles] = useState<PDFFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(e.target.files || []);
        if (uploadedFiles.length === 0) return;

        setIsProcessing(true);
        try {
            const newFiles = await Promise.all(uploadedFiles.map(async (f) => {
                const arrayBuffer = await f.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                return {
                    id: Math.random().toString(36).substring(2, 9),
                    file: f,
                    pageCount: pdfDoc.getPageCount()
                };
            }));
            setFiles(prev => [...prev, ...newFiles]);
        } catch (err) {
            console.error("LIZARD_ERROR: PDF_LOAD_FAILED", err);
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

    // 2. Surgical Download Protocol (Strict Types)
    const downloadFile = (bytes: Uint8Array, name: string) => {
        // We cast bytes to BlobPart[] to satisfy the Blob constructor
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.download = name;
        document.body.appendChild(link); // Required for some Firefox versions
        link.click();

        // Cleanup Protocol
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const mergePDFs = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);
        try {
            const mergedPdf = await PDFDocument.create();
            for (const item of files) {
                const pdfBytes = await item.file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedBytes = await mergedPdf.save();
            downloadFile(mergedBytes, `lizard_merge_${Date.now()}.pdf`);
        } catch (err) {
            console.error("LIZARD_ERROR: MERGE_FAILED", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const splitPDF = async (fileItem: PDFFile) => {
        setIsProcessing(true);
        try {
            const pdfBytes = await fileItem.file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            for (let i = 0; i < pdfDoc.getPageCount(); i++) {
                const newDoc = await PDFDocument.create();
                const [page] = await newDoc.copyPages(pdfDoc, [i]);
                newDoc.addPage(page);
                const bytes = await newDoc.save();
                downloadFile(bytes, `${fileItem.file.name.replace('.pdf', '')}_page_${i + 1}.pdf`);
            }
        } catch (err) {
            console.error("LIZARD_ERROR: SPLIT_FAILED", err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Panel as="main" className="p-4 sm:p-6 md:p-8 flex flex-col items-center space-y-6 max-w-xl mx-auto selection:bg-emerald-500 selection:text-black">
            <ToolHeader title="PDF Surgeon" />

            {/* STATUS HUD - Matches OCR/Unit Converter Area */}
            <div className="w-full bg-gradient-to-r from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-[10px] font-mono text-emerald-500 mb-2 tracking-widest uppercase">System Diagnostic</p>
                <div className="flex items-baseline justify-between flex-wrap gap-4">
                    <div className="flex items-baseline overflow-hidden">
                        <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                            {isProcessing ? "BUSY" : files.length > 0 ? "LOADED" : "IDLE"}
                        </span>
                        <span className="text-xl font-black text-zinc-500 ml-3 uppercase tracking-tighter">
                            {isProcessing ? 'Encoding' : 'Buffer'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isProcessing ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : <Activity className="w-4 h-4 text-zinc-800" />}
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                            {isProcessing ? 'Local_Stream_Busy' : 'Awaiting_Signal'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-4">
                {/* INJECTION ZONE */}
                <div
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    className={`bg-zinc-950 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all active:scale-95 group
                        ${isProcessing ? 'border-zinc-900 opacity-20 pointer-events-none' : 'border-zinc-900 hover:border-emerald-500/30'}`}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" multiple className="hidden" />
                    <Plus className="w-10 h-10 mx-auto text-zinc-800 group-hover:text-emerald-500 transition-colors mb-4" />
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Inject_PDF_Payload</span>
                </div>

                {/* PROCESSING QUEUE */}
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2 px-1">
                    <AnimatePresence mode='popLayout'>
                        {files.map((f) => (
                            <motion.div
                                key={f.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-2xl group transition-all"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <FileText className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate w-40 sm:w-64">{f.file.name}</p>
                                        <p className="text-[9px] font-mono text-emerald-500/60 uppercase">{f.pageCount} Pages</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => splitPDF(f)} className="p-3 text-zinc-600 hover:text-emerald-500 transition-colors" title="Split">
                                        <Scissors size={16} />
                                    </button>
                                    <button onClick={() => removeFile(f.id)} className="p-3 text-zinc-600 hover:text-red-500 transition-colors" title="Remove">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* MASTER EXECUTION */}
                <div className="grid grid-cols-[1fr,auto] gap-3 pt-2">
                    <button
                        disabled={files.length < 2 || isProcessing}
                        onClick={mergePDFs}
                        className={`py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95
                            ${files.length >= 2 && !isProcessing
                                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                                : "bg-zinc-950 border border-zinc-900 text-zinc-700 opacity-50"}`}
                    >
                        <Combine size={18} /> Merge_Protocol
                    </button>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl px-6 flex flex-col items-center justify-center">
                        <span className="text-[7px] text-zinc-600 uppercase font-bold tracking-tighter">Units</span>
                        <span className="text-xl font-black text-white tabular-nums">{files.length}</span>
                    </div>
                </div>

                {/* ENGINE FOOTER */}
                <div className="w-full pt-6 border-t border-zinc-900 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase flex items-center gap-1"><ShieldCheck size={10} /> Local_Enc</span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase flex items-center gap-1"><Zap size={10} /> Instant_IO</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-700 uppercase italic">Lizard.PDF_Surgeon.v1.5</span>
                </div>
            </div>
        </Panel>
    );
}