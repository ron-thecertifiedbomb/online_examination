/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import { NesRomDropzone } from "./NesRomDropzone";
import { ConfirmDialog } from "./ConfirmDialog";
import { Play, Trash2, Box, Calendar, HardDrive } from "lucide-react";
import {
    type NesRomEntry,
    getNesRomList,
    upsertNesRomEntry,
    putNesRomBytes,
    deleteNesRom,
    touchNesLastPlayed,
} from "@/lib/storage/nesRomStore";

async function hashRom(bytes: Uint8Array): Promise<string> {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    const digest = await crypto.subtle.digest("SHA-256", ab);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 16);
}

type Props = {
    onPlay: (romHash: string, name: string) => void;
};

export function NesRomLibrary({ onPlay }: Props) {
    const [list, setList] = useState<NesRomEntry[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<NesRomEntry | null>(null);

    const refresh = useCallback(() => setList(getNesRomList()), []);

    useEffect(() => { refresh(); }, [refresh]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    const handleImport = useCallback(
        async (file: File) => {
            const buf = await file.arrayBuffer();
            const bytes = new Uint8Array(buf);
            const romHash = await hashRom(bytes);
            await putNesRomBytes(romHash, bytes);
            upsertNesRomEntry({
                romHash,
                name: file.name,
                size: bytes.length,
                addedAt: Date.now(),
                lastPlayedAt: null,
            });
            refresh();
            setToast(`DATABASE_UPDATE: ${file.name} INGESTED`);
        },
        [refresh],
    );

    const handleDelete = useCallback(
        async (romHash: string) => {
            await deleteNesRom(romHash);
            refresh();
            setToast("SECTOR_CLEARED: ROM PURGED");
        },
        [refresh],
    );

    const handlePlay = useCallback(
        (entry: NesRomEntry) => {
            touchNesLastPlayed(entry.romHash);
            refresh();
            onPlay(entry.romHash, entry.name);
        },
        [onPlay, refresh],
    );

    function fmtSize(n: number) {
        if (n < 1024) return `${n} B`;
        if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
        return `${(n / (1024 * 1024)).toFixed(1)} MB`;
    }

    function fmtDate(ts: number | null) {
        if (!ts) return "NEVER";
        return new Date(ts).toLocaleDateString(undefined, {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        }).toUpperCase();
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Upload Zone */}
            <div className="relative group">
             
                <div className="relative">
                    <NesRomDropzone onFile={handleImport} />
                </div>
            </div>

            {/* System Notification */}
            {toast && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-400 uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]" role="status">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {toast}
                </div>
            )}

            {list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/30">
                    <Box size={32} className="text-zinc-700 mb-4" />
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                        Library_Empty // Waiting_For_Input
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((entry) => (
                        <div key={entry.romHash} className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 p-4 transition-all hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">

                            {/* Card Header: Cover Art or Placeholder */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 mb-4 border border-zinc-800/50">
                                {entry.coverDataUrl ? (
                                    <img
                                        src={entry.coverDataUrl}
                                        alt={entry.name}
                                        className="h-full w-full object-cover pixel-perfect transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-800">
                                        <Box size={40} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* ROM Info */}
                            <div className="mb-6 flex-1 space-y-1">
                                <h3 className="truncate text-xs font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                                    {entry.name.replace(".nes", "").replace(/_/g, " ")}
                                </h3>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500">
                                        <HardDrive size={10} /> {fmtSize(entry.size)}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500">
                                        <Calendar size={10} /> LAST: {fmtDate(entry.lastPlayedAt)}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 border-t border-zinc-900 pt-4">
                                <button
                                    onClick={() => handlePlay(entry)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black transition hover:bg-emerald-500 active:scale-95"
                                >
                                    <Play size={12} fill="currentColor" /> Play
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(entry)}
                                    className="flex items-center justify-center rounded-lg border border-zinc-800 p-2 text-zinc-500 transition hover:border-rose-500/50 hover:text-rose-500 active:scale-95"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={deleteTarget !== null}
                title="TERMINATE_ROM"
                message={`CRITICAL: Wipe "${deleteTarget?.name ?? ""}" from local storage? This action is irreversible.`}
                confirmLabel="CONFIRM_PURGE"
                danger
                onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget.romHash); setDeleteTarget(null); }}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}