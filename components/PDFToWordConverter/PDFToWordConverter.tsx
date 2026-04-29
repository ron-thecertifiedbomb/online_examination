"use client";

import { useState, useEffect, useRef } from "react";
import { saveAs } from "file-saver";
import * as docx from "docx";
import { FileText, Upload, RefreshCcw, Download, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PDFToWordConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Optimized library loading for Next.js 14+
    useEffect(() => {
        // Ensure we only execute on the client
        if (typeof window !== "undefined") {
            const initializePdfJS = async () => {
                try {
                    // 1. Force a CommonJS-style require to bypass ESM resolution bugs
                    const pdfjs = await import("pdfjs-dist/build/pdf.min.mjs");

                    // 2. Set the worker via CDN (ensure version matches your package.json)
                    // If you are on 4.x, use this path; otherwise, adjust the version string.
                    const pdfjsVersion = "4.0.379";
                    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;

                    setPdfjsLib(pdfjs);
                    console.log("System.DocConvert: Engine_Ready");
                } catch (err) {
                    console.error("Critical System Error: PDF_Engine_Failure", err);
                }
            };

            initializePdfJS();
        }
    }, []);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const convertPDFtoWord = async () => {
        if (!file || !pdfjsLib) return;
        setLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const paragraphs: docx.Paragraph[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();

                // Group items by line for better Word formatting
                const textItems = content.items.map((item: any) => item.str);
                paragraphs.push(
                    new docx.Paragraph({
                        children: [new docx.TextRun(textItems.join(" "))],
                        spacing: { after: 200 },
                    })
                );
            }

            const doc = new docx.Document({
                sections: [{ children: paragraphs }],
            });

            const blob = await docx.Packer.toBlob(doc);
            saveAs(blob, file.name.replace(".pdf", ".docx"));
        } catch (err) {
            console.error("Conversion failed:", err);
            alert("RUNTIME_ERROR: PDF parsing failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-[#080808] border border-zinc-900 p-8 relative overflow-hidden group selection:bg-emerald-500 selection:text-black">

            {/* HUD HEADER */}
            <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <FileText className={`w-3 h-3 ${loading ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                            System.DocConvert_v1
                        </h2>
                    </div>
                    <p className="text-[9px] text-zinc-600 uppercase font-mono tracking-tighter italic">
                        {loading ? 'STATUS: PARSING_PDF_STREAM' : file ? 'BUFFER: FILE_READY' : 'STATUS: WAITING_FOR_PAYLOAD'}
                    </p>
                </div>
                <Cpu className={`w-4 h-4 ${loading ? 'text-emerald-500 animate-spin-slow' : 'text-zinc-900'}`} />
            </div>

            <div className="space-y-8">
                {/* UPLOAD ZONE */}
                <div className="relative">
                    {!file ? (
                        <motion.label
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-900 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] cursor-pointer transition-all group/upload"
                        >
                            <Upload className="w-10 h-10 text-zinc-800 group-hover/upload:text-emerald-500 transition-colors mb-4" />
                            <span className="text-[10px] tracking-[0.3em] font-black uppercase text-zinc-600 group-hover/upload:text-white">Initialize_PDF_Payload</span>
                            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                        </motion.label>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-6 bg-black border border-zinc-900"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-900 text-emerald-500">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-white uppercase tracking-wider">{file.name}</div>
                                    <div className="text-[9px] font-mono text-zinc-600 uppercase">{(file.size / 1024).toFixed(2)} KB // Ready</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-500 transition-colors"
                            >
                                [ Drop_Payload ]
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* CONVERT ACTION */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={convertPDFtoWord}
                        disabled={!file || !pdfjsLib || loading}
                        className="group relative flex items-center justify-center gap-3 bg-white text-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all disabled:opacity-10"
                    >
                        {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {loading ? "Processing_Buffer..." : "Execute_Conversion"}
                    </button>

                    {/* DECORATIVE TERMINAL LOG */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="mt-6 w-full max-w-sm"
                            >
                                <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase mb-2">
                                    <span>Allocating_Resources</span>
                                    <span>Sync_Active</span>
                                </div>
                                <div className="h-px w-full bg-zinc-900 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* BACKGROUND DECOR */}
            <div className="absolute -bottom-6 -left-4 text-8xl font-black text-white/[0.02] select-none uppercase italic pointer-events-none">
                DOC_CVT
            </div>
        </div>
    );
}