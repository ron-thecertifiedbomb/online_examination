'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit3, Filter, Star, Search,
  CheckCircle2, Circle, X, Save, LayoutGrid, Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
  category: string;
  dueDate?: string;
  createdAt: string;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Personal');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'important'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>(['Personal', 'Work', 'Shopping', 'Health', 'Learning']);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Persistence Logic
  useEffect(() => {
    const savedTodos = localStorage.getItem('lizard-todos');
    const savedCats = localStorage.getItem('lizard-cats');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedCats) setCategories(JSON.parse(savedCats));
  }, []);

  useEffect(() => {
    localStorage.setItem('lizard-todos', JSON.stringify(todos));
    localStorage.setItem('lizard-cats', JSON.stringify(categories));
  }, [todos, categories]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      important: false,
      category: selectedCategory,
      createdAt: new Date().toISOString()
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const getFilteredTodos = () => {
    return todos.filter(t => {
      const matchesFilter = filter === 'all' ||
        (filter === 'active' && !t.completed) ||
        (filter === 'completed' && t.completed) ||
        (filter === 'important' && t.important);
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesCategory && matchesSearch;
    });
  };

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    important: todos.filter(t => t.important && !t.completed).length
  };

  return (
    <div className="w-full min-h-screen bg-black text-zinc-300 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
              System<span className="text-emerald-500">.Task</span>
            </h1>
            <p className="text-[10px] tracking-[0.4em] text-zinc-600 uppercase">
              Operational Efficiency: {todos.length > 0 ? Math.round(((todos.length - stats.active) / todos.length) * 100) : 0}%
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#080808] border border-zinc-900 p-2">
            <Search className="w-4 h-4 text-zinc-700 ml-2" />
            <input
              type="text"
              placeholder="SEARCH_LOGS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs uppercase tracking-widest w-40 md:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: CONTROL PANEL */}
          <aside className="lg:col-span-4 space-y-6">

            {/* ADD TASK BOX */}
            <div className="bg-[#080808] border border-zinc-900 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 text-[8px] text-zinc-800 font-mono uppercase tracking-tighter">input_module_v3</div>
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-6">Initialize Task</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="TASK_DESCRIPTION..."
                  className="w-full bg-black border border-zinc-800 p-4 text-sm focus:border-emerald-500/50 transition-all outline-none text-white placeholder:text-zinc-800"
                />
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 bg-black border border-zinc-800 p-3 text-[10px] uppercase tracking-widest text-zinc-400 outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button
                    onClick={addTodo}
                    className="bg-emerald-600 hover:bg-emerald-500 text-black px-6 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ALL', val: stats.total, color: 'text-zinc-500' },
                { label: 'ACTIVE', val: stats.active, color: 'text-emerald-500' },
                { label: 'IMP', val: stats.important, color: 'text-purple-500' }
              ].map(s => (
                <div key={s.label} className="bg-[#080808] border border-zinc-900 p-4 text-center">
                  <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
                  <div className="text-[8px] tracking-tighter text-zinc-700 uppercase font-mono">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CATEGORY FILTER */}
            <nav className="bg-[#080808] border border-zinc-900 p-6 space-y-2">
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-4">Directories</h2>
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left p-3 text-[10px] uppercase tracking-widest flex justify-between border ${activeCategory === 'all' ? 'border-emerald-500/50 text-white bg-emerald-500/5' : 'border-transparent text-zinc-600'}`}
              >
                <span>Root_All</span>
                <LayoutGrid className="w-3 h-3" />
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left p-3 text-[10px] uppercase tracking-widest border transition-all ${activeCategory === cat ? 'border-emerald-500/50 text-white bg-emerald-500/5' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN COLUMN: TASK LIST */}
          <main className="lg:col-span-8 space-y-4">

            {/* FILTERS BAR */}
            <div className="flex gap-1 mb-6">
              {['all', 'active', 'completed', 'important'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${filter === f ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-600 border-zinc-900 hover:border-zinc-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* THE LIST */}
            <div className="space-y-3">
              <AnimatePresence mode='popLayout'>
                {getFilteredTodos().map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group bg-[#080808] border border-zinc-900 p-4 transition-all hover:border-zinc-700 ${todo.completed ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t))}
                        className={`transition-all ${todo.completed ? 'text-emerald-500' : 'text-zinc-800 hover:text-emerald-500'}`}
                      >
                        {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>

                      <div className="flex-1 overflow-hidden">
                        {editingTodo?.id === todo.id ? (
                          <div className="flex gap-2">
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="bg-black border border-emerald-500/30 p-1 text-sm text-white w-full outline-none"
                              autoFocus
                            />
                            <button onClick={() => {
                              setTodos(todos.map(t => t.id === todo.id ? { ...t, text: editText } : t));
                              setEditingTodo(null);
                            }}><Save className="w-4 h-4 text-emerald-500" /></button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className={`text-sm uppercase tracking-tight font-medium ${todo.completed ? 'line-through text-zinc-700' : 'text-zinc-200'}`}>
                              {todo.text}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter bg-zinc-950 px-1 border border-zinc-900">
                                {todo.category}
                              </span>
                              <span className="text-[8px] font-mono text-zinc-700 uppercase">
                                {new Date(todo.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setTodos(todos.map(t => t.id === todo.id ? { ...t, important: !t.important } : t))}
                          className={`${todo.important ? 'text-purple-500' : 'text-zinc-800 hover:text-purple-400'}`}
                        >
                          <Star className={`w-4 h-4 ${todo.important ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => { setEditingTodo(todo); setEditText(todo.text); }}
                          className="text-zinc-800 hover:text-blue-400 p-1"
                        ><Edit3 className="w-4 h-4" /></button>
                        <button
                          onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                          className="text-zinc-800 hover:text-red-500 p-1"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;