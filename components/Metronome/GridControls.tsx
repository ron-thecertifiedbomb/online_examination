
import React from 'react';

interface GridControlsProps {
    beatsPerBar: number;
    setBeatsPerBar: (beats: number) => void;
    subdivision: number;
    setSubdivision: (sub: number) => void;
}

export const GridControls: React.FC<GridControlsProps> = ({
    beatsPerBar,
    setBeatsPerBar,
    subdivision,
    setSubdivision
}) => (
    <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="border-b border-zinc-900 px-3 py-2">
                <span className="text-[8px] font-mono text-zinc-600 uppercase">Signature</span>
            </div>
            <select
                value={beatsPerBar}
                onChange={(e) => setBeatsPerBar(parseInt(e.target.value))}
                className="w-full bg-transparent px-3 py-4 text-white font-mono text-sm focus:outline-none cursor-pointer appearance-none"
            >
                {[2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n} className="bg-zinc-900">{n}/4 TIME</option>)}
            </select>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="border-b border-zinc-900 px-3 py-2">
                <span className="text-[8px] font-mono text-zinc-600 uppercase">Division</span>
            </div>
            <select
                value={subdivision}
                onChange={(e) => setSubdivision(parseInt(e.target.value))}
                className="w-full bg-transparent px-3 py-4 text-white font-mono text-sm focus:outline-none cursor-pointer appearance-none"
            >
                <option value={1} className="bg-zinc-900">1/4 NOTES</option>
                <option value={2} className="bg-zinc-900">1/8 NOTES</option>
                <option value={3} className="bg-zinc-900">TRIPLETS</option>
                <option value={4} className="bg-zinc-900">1/16 NOTES</option>
            </select>
        </div>
    </div>
);
