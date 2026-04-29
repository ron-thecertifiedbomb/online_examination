'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Trash2, Moon, Sun, Code2, Terminal,
    Zap, Copy, Sparkles, AlertCircle, Info, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExecutionResult {
    type: 'log' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
}

const JsPlayground: React.FC = () => {
    const [code, setCode] = useState<string>(`// LIZARD INTERACTIVE JS RUNTIME v3.0\n\nconst greet = (name) => {\n  console.log(\`Initializing session for \${name}...\`);\n};\n\ngreet('Developer');\n\n// Try some logic below\nconst stack = ['Next.js', 'Tailwind', 'Vantablack'];\nconsole.log('Active Stack:', stack);`);

    const [output, setOutput] = useState<ExecutionResult[]>([]);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [executionTime, setExecutionTime] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const examples = {
        arrayMethods: `// Array Methods Demo\nconst fruits = ['apple', 'banana', 'orange'];\nconsole.log('Map:', fruits.map(f => f.toUpperCase()));\nconsole.log('Filter:', fruits.filter(f => f.includes('a')));`,
        objectManipulation: `// Object Logic\nconst user = { name: 'Ron', role: 'Dev' };\nconst meta = { ...user, status: 'Online' };\nconsole.log('Spread Result:', meta);\nconsole.log('Keys:', Object.keys(meta));`,
        asyncFunctions: `// Async Simulation\nasync function simulateFetch() {\n  console.log('Fetching from Lizard API...');\n  await new Promise(r => setTimeout(r, 1000));\n  console.log('Success: 200 OK');\n}\nsimulateFetch();`,
    };

    const executeCode = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setOutput([]);
        const startTime = performance.now();

        try {
            const capturedLogs: ExecutionResult[] = [];
            const customConsole = (type: any) => (...args: any[]) => {
                const message = args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                capturedLogs.push({ type, message, timestamp: new Date() });
            };

            const originalLog = console.log;
            console.log = customConsole('log');
            console.error = customConsole('error');
            console.warn = customConsole('warning');
            console.info = customConsole('info');

            try {
                const func = new Function(code);
                func();
            } catch (err) {
                capturedLogs.push({ type: 'error', message: String(err), timestamp: new Date() });
            }

            console.log = originalLog;
            setOutput(capturedLogs);
        } finally {
            setExecutionTime(performance.now() - startTime);
            setIsRunning(false);
        }
    };

    return (
        <div className="w-full bg-black text-zinc-300 font-sans selection:bg-emerald-500 selection:text-black">
            <div className="max-w-7xl mx-auto py-10">

                {/* TOOLBAR */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#080808] border border-zinc-900 p-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-500 p-2 rounded-none">
                            <Terminal className="text-black w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">JS_Playground.sys</h2>
                            <p className="text-[9px] text-zinc-600 uppercase font-mono tracking-tighter">Environment: Browser_V8_Runtime</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setOutput([])} className="p-2 hover:bg-zinc-900 border border-zinc-900 transition-all">
                            <Trash2 className="w-4 h-4 text-zinc-500" />
                        </button>
                        <button
                            onClick={executeCode}
                            disabled={isRunning}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {isRunning ? <Zap className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
                            Execute
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">

                    {/* SIDEBAR: EXAMPLES */}
                    <aside className="lg:col-span-3 space-y-1">
                        <div className="bg-[#080808] border border-zinc-900 p-4 mb-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Quick_Templates
                            </span>
                        </div>
                        {Object.keys(examples).map((key) => (
                            <button
                                key={key}
                                onClick={() => setCode(examples[key as keyof typeof examples])}
                                className="w-full group text-left p-4 bg-[#080808] border border-zinc-900 hover:border-emerald-500/50 transition-all flex justify-between items-center"
                            >
                                <span className="text-[10px] uppercase font-mono tracking-tighter text-zinc-500 group-hover:text-white">{key.replace(/([A-Z])/g, '_$1')}</span>
                                <ChevronRight className="w-3 h-3 text-zinc-800 group-hover:text-emerald-500" />
                            </button>
                        ))}
                    </aside>

                    {/* EDITOR AREA */}
                    <div className="lg:col-span-9 flex flex-col gap-1">
                        <div className="relative group">
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] bg-zinc-900 text-zinc-500 px-2 py-1 uppercase font-mono">Input_Buffer</span>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-80 bg-[#050505] border border-zinc-900 p-6 font-mono text-sm text-emerald-500/90 focus:outline-none focus:border-emerald-500/30 transition-all resize-none leading-relaxed"
                                spellCheck="false"
                            />
                        </div>

                        {/* CONSOLE OUTPUT */}
                        <div className="bg-[#080808] border border-zinc-900 min-h-[200px] flex flex-col">
                            <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-900 bg-black/50">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Console_Output</span>
                                {executionTime > 0 && <span className="text-[8px] font-mono text-zinc-700">{executionTime.toFixed(2)}ms</span>}
                            </div>

                            <div className="p-4 font-mono text-xs space-y-2 overflow-y-auto max-h-60">
                                <AnimatePresence initial={false}>
                                    {output.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                            <Code2 className="w-10 h-10 mb-2" />
                                            <p className="text-[10px] uppercase tracking-[0.2em]">Ready for execution...</p>
                                        </div>
                                    ) : (
                                        output.map((res, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={i}
                                                className={`flex gap-3 p-2 border-l-2 ${res.type === 'error' ? 'border-red-500 bg-red-500/5 text-red-400' :
                                                        res.type === 'warning' ? 'border-yellow-500 text-yellow-500' : 'border-emerald-500/50 text-zinc-400'
                                                    }`}
                                            >
                                                <span className="text-zinc-800 shrink-0">{i + 1}</span>
                                                <span className="whitespace-pre-wrap break-all uppercase tracking-tighter">{res.message}</span>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JsPlayground;