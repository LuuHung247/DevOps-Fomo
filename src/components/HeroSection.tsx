'use client';

import React, { useRef, useEffect } from 'react';
import { Search, X, Flame, Sparkles, Terminal, Layers } from 'lucide-react';

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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      
      {/* FOMO Live Alert Pill */}
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 text-amber-300 text-xs font-medium mb-5 shadow-lg shadow-amber-500/5 animate-pulse-slow">
        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span>No More Tech FOMO: Community-Vetted AI & DevOps Tooling</span>
      </div>

      {/* Main Punchy Heading */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
        Discover the <span className="bg-gradient-to-r from-brand-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">Highest-Utility</span> Repositories in AI & DevOps
      </h1>

      <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
        Curated tracking of star growth, battle-tested system architectures, agentic AI frameworks, and Kubernetes cloud-native power tools.
      </p>

      {/* Quick Topic Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs">
        <span className="text-slate-400 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> Popular:</span>
        {['Agentic AI', 'Kubernetes', 'LLMOps', 'System Design Primer', 'OpenTofu', 'vLLM', 'eBPF'].map((tag) => (
          <button
            key={tag}
            onClick={() => onSearchChange(tag)}
            className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
          >
            {tag}
          </button>
        ))}
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
            placeholder="Search by repo name, description, topic, or language... (Press '/' to focus)"
            className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-400 text-sm sm:text-base border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-xl shadow-black/40"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 p-1 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded shadow">
              /
            </kbd>
          </div>
        </div>

        {/* Results Counter Info */}
        <div className="flex justify-between items-center px-2 mt-3 text-xs text-slate-400">
          <span>Showing <strong className="text-white font-mono">{filteredCount}</strong> of <strong className="text-slate-300 font-mono">{totalCount}</strong> repositories</span>
          {searchQuery && (
            <span>Filtered by keyword: <span className="text-brand-400 font-medium">"{searchQuery}"</span></span>
          )}
        </div>
      </div>
    </section>
  );
};
