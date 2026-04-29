'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit3, Coffee, Calendar, Clock, Target, Box, Layout, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: 'work' | 'personal' | 'health' | 'learning' | 'other';
    timeEstimate: number;
    dueDate?: string;
    createdAt: string;
}

interface NewTaskState {
    title: string;
    description: string;
    priority: Task['priority'];
    category: Task['category'];
    timeEstimate: number;
    dueDate: string;
}

export default function Planner() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<NewTaskState>({
        title: '',
        description: '',
        priority: 'medium',
        category: 'personal',
        timeEstimate: 30,
        dueDate: ''
    });
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [selectedCategory, setSelectedCategory] = useState<'all' | Task['category']>('all');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const savedTasks = localStorage.getItem('planner-tasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
    }, []);

    useEffect(() => {
        localStorage.setItem('planner-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleTaskAction = () => {
        if (!newTask.title.trim()) return;

        if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...newTask } : t));
            setEditingTask(null);
        } else {
            const task: Task = {
                id: Date.now().toString(),
                ...newTask,
                completed: false,
                createdAt: new Date().toISOString()
            };
            setTasks([task, ...tasks]);
        }

        resetForm();
    };

    const resetForm = () => {
        setNewTask({ title: '', description: '', priority: 'medium', category: 'personal', timeEstimate: 30, dueDate: '' });
        setEditingTask(null);
        setShowAddForm(false);
    };

    const startEditing = (task: Task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category,
            timeEstimate: task.timeEstimate,
            dueDate: task.dueDate || ''
        });
        setShowAddForm(true);
    };

    const getFilteredTasks = () => {
        return tasks.filter(task => {
            const statusMatch = activeFilter === 'all' || (activeFilter === 'active' ? !task.completed : task.completed);
            const catMatch = selectedCategory === 'all' || task.category === selectedCategory;
            return statusMatch && catMatch;
        });
    };

    const stats = {
        pending: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length,
        time: tasks.filter(t => !t.completed).reduce((s, t) => s + t.timeEstimate, 0)
    };

    return (
        <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500 selection:text-black">
            {/* HUD HEADER */}
            <header className="bg-[#080808] border-b border-zinc-900 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Layout className="w-3 h-3 text-emerald-500" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System.Planner_v2</h2>
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase font-mono tracking-tighter italic">Status: OPERATIONAL // Mode: STRATEGIC_PLANNING</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <div className="text-xl font-black text-white tabular-nums tracking-tighter">
                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SIDEBAR */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="bg-[#080808] border border-zinc-900 p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                                    <Target className="w-3 h-3 text-emerald-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Overview_Buffer</h3>
                                </div>
                                <StatRow label="Queue" value={stats.pending} />
                                <StatRow label="Executed" value={stats.completed} color="text-emerald-500" />
                                <StatRow label="ETA_Total" value={`${Math.floor(stats.time / 60)}h ${stats.time % 60}m`} color="text-amber-500" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                                    <Box className="w-3 h-3 text-zinc-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Filter_Logic</h3>
                                </div>
                                <FilterButton active={activeFilter === 'all'} label="ALL_LOGS" onClick={() => setActiveFilter('all')} />
                                <FilterButton active={activeFilter === 'active'} label="ACTIVE_PROCESS" onClick={() => setActiveFilter('active')} />
                                <FilterButton active={activeFilter === 'completed'} label="SYNC_COMPLETE" onClick={() => setActiveFilter('completed')} />
                            </div>
                        </div>
                    </aside>

                    {/* MAIN TASK ENGINE */}
                    <div className="lg:col-span-9 space-y-6">
                        <AnimatePresence mode="wait">
                            {showAddForm ? (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="bg-[#080808] border border-zinc-900 p-8 space-y-6 shadow-2xl shadow-emerald-500/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <HUDInput label="Task_Header" placeholder="Mission title..." value={newTask.title} onChange={(v: string) => setNewTask({ ...newTask, title: v })} />
                                            <HUDTextarea label="Task_Description" placeholder="Parameters..." value={newTask.description} onChange={(v: string) => setNewTask({ ...newTask, description: v })} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <HUDSelect label="Priority" value={newTask.priority} options={['low', 'medium', 'high']} onChange={(v: string) => setNewTask({ ...newTask, priority: v as Task['priority'] })} />
                                                <HUDSelect label="Category" value={newTask.category} options={['work', 'personal', 'health', 'learning', 'other']} onChange={(v: string) => setNewTask({ ...newTask, category: v as Task['category'] })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <HUDInput type="number" label="Time_Est (M)" value={newTask.timeEstimate} onChange={(v: string) => setNewTask({ ...newTask, timeEstimate: parseInt(v) || 0 })} />
                                                <HUDInput type="date" label="Deadline" value={newTask.dueDate} onChange={(v: string) => setNewTask({ ...newTask, dueDate: v })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleTaskAction} className="flex-1 bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all">
                                            {editingTask ? 'Commit_Changes' : 'Initialize_Task'}
                                        </button>
                                        <button onClick={resetForm} className="px-8 border border-zinc-900 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-all">Cancel</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <button onClick={() => setShowAddForm(true)} className="w-full border-2 border-dashed border-zinc-900 py-12 group hover:border-emerald-500/50 transition-all">
                                    <Plus className="w-6 h-6 mx-auto text-zinc-800 group-hover:text-emerald-500 transition-colors mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 group-hover:text-white transition-colors">Append_New_Objective</span>
                                </button>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {getFilteredTasks().map(task => (
                                <motion.div layout key={task.id} className={`bg-[#080808] border border-zinc-900 p-6 flex items-start gap-6 group hover:border-zinc-700 transition-all ${task.completed ? 'opacity-40 grayscale' : ''}`}>
                                    <button onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                                        className={`mt-1 w-5 h-5 border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-800 hover:border-emerald-500'}`}>
                                        {task.completed && <Check className="w-3 h-3" />}
                                    </button>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`text-sm font-bold text-white uppercase tracking-wider ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                                                {task.description && <p className="text-[11px] text-zinc-600 font-mono mt-1">{task.description}</p>}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEditing(task)} className="p-2 hover:text-white"><Edit3 size={14} /></button>
                                                <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="p-2 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 items-center text-[9px] font-mono">
                                            <span className={`px-2 py-0.5 font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-red-950 text-red-500' : task.priority === 'medium' ? 'bg-amber-950 text-amber-500' : 'bg-emerald-950 text-emerald-500'}`}>
                                                {task.priority}_PRIORITY
                                            </span>
                                            <div className="flex items-center gap-1.5 text-zinc-600"><Clock size={10} /> {task.timeEstimate}m</div>
                                            {task.dueDate && <div className="flex items-center gap-1.5 text-zinc-600 uppercase italic"><Calendar size={10} /> Dead: {task.dueDate}</div>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* UI UTILITIES */
const StatRow = ({ label, value, color = "text-white" }: any) => (
    <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-zinc-600 uppercase tracking-tighter">{label}</span>
        <span className={`font-bold ${color}`}>{value}</span>
    </div>
);

const FilterButton = ({ active, label, onClick }: any) => (
    <button onClick={onClick} className={`w-full text-left p-3 text-[9px] font-black tracking-widest transition-all ${active ? 'bg-zinc-900 text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}>
        {label}
    </button>
);

const HUDInput = ({ label, onChange, ...props }: any) => (
    <div className="space-y-1">
        <label className="text-[8px] uppercase font-mono text-zinc-600 tracking-widest">{label}</label>
        <input {...props} onChange={(e) => onChange(e.target.value)} className="w-full bg-black border border-zinc-900 p-3 text-[11px] text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-800" />
    </div>
);

const HUDTextarea = ({ label, onChange, ...props }: any) => (
    <div className="space-y-1">
        <label className="text-[8px] uppercase font-mono text-zinc-600 tracking-widest">{label}</label>
        <textarea {...props} onChange={(e) => onChange(e.target.value)} className="w-full bg-black border border-zinc-900 p-3 text-[11px] text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-800 h-24 resize-none" />
    </div>
);

const HUDSelect = ({ label, options, value, onChange }: any) => (
    <div className="space-y-1">
        <label className="text-[8px] uppercase font-mono text-zinc-600 tracking-widest">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black border border-zinc-900 p-3 text-[9px] uppercase tracking-widest text-zinc-400 outline-none focus:border-emerald-500/50">
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);