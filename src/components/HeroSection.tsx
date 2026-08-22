'use client';

import React, { useRef, useEffect } from 'react';
import { Search, X, Flame, Sparkles, Terminal, Activity, Zap, Cpu, Shield } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search with '/' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        onSearchChange('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchChange]);

  const quickTags = [
    { label: '🔥 Hot Rising', query: 'rising' },
    { label: '🤖 Agentic AI', query: 'agent' },
    { label: '⚙️ Kubernetes', query: 'kubernetes' },
    { label: '🧠 LLMOps / Serving', query: 'serving' },
    { label: '📐 System Design', query: 'system-design' },
    { label: '🦀 Rust Power', query: 'rust' },
    { label: '🔒 DevSecOps', query: 'security' },
  ];

  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      
      {/* Live Radar Badge */}
      <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-xl shadow-emerald-500/5">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono tracking-wide">COMMUNITY-VERIFIED AI & DEVOPS TECH RADAR</span>
      </div>

      {/* Main Punchy Heading */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 font-sans leading-tight">
        Master The <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">Fastest-Growing</span> Repositories in AI & DevOps
      </h1>

      <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
        Real-time intelligence tracking star velocity, battle-tested system architectures, autonomous agent frameworks, and cloud-native infrastructure tooling.
      </p>

      {/* Quick Tag Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
        <span className="text-slate-400 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {quickTags.map((tag) => {
          const isActive = searchQuery.toLowerCase() === tag.query.toLowerCase();
          return (
            <button
              key={tag.label}
              onClick={() => onSearchChange(isActive ? '' : tag.query)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Global Search Input Box */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by repo name, author, topic, or keyword... (Press '/' to focus)"
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 text-white placeholder-slate-400 text-sm sm:text-base border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-2xl shadow-black/60"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-14 p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Clear search (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none">
            <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded-lg shadow">
              /
            </kbd>
          </div>
        </div>

        {/* Live Filter Counter Status */}
        <div className="flex justify-between items-center px-3 mt-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Showing <strong className="text-emerald-300">{filteredCount}</strong> of <strong className="text-slate-300">{totalCount}</strong> repos</span>
          </span>
          {searchQuery && (
            <span className="text-slate-400">
              Query: <strong className="text-amber-300 font-sans">"{searchQuery}"</strong>
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
