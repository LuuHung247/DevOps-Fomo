'use client';

import React, { useRef, useEffect } from 'react';

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
    { label: 'Hot Rising', query: 'rising' },
    { label: 'Agentic AI', query: 'agent' },
    { label: 'Kubernetes', query: 'kubernetes' },
    { label: 'LLMOps', query: 'serving' },
    { label: 'System Design', query: 'system-design' },
    { label: 'Rust Power', query: 'rust' },
    { label: 'DevSecOps', query: 'security' },
  ];

  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center font-sans">
      
      {/* Category Subtitle Pill */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded text-xs font-mono font-bold bg-slate-900 border border-emerald-500/30 text-emerald-400 mb-6">
        <span>AI & DEVOPS ECOSYSTEM TRACKER</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 font-sans leading-tight">
        Discover Verified Repositories in <span className="text-emerald-400">AI & DevOps</span>
      </h1>

      <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
        Curated intelligence tracking star growth velocity, distributed system architectures, autonomous AI frameworks, and cloud-native infrastructure.
      </p>

      {/* Quick Tag Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-xs font-mono">
        <span className="text-slate-400 font-semibold mr-1">PRESETS:</span>
        {quickTags.map((tag) => {
          const isActive = searchQuery.toLowerCase() === tag.query.toLowerCase();
          return (
            <button
              key={tag.label}
              onClick={() => onSearchChange(isActive ? '' : tag.query)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              [{tag.label}]
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="relative max-w-2xl mx-auto font-sans">
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repository, author, topic, or keyword... (Press '/' to focus)"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900 text-white placeholder-slate-400 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-14 px-2 py-1 text-xs font-mono text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none font-mono">
            <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded">
              /
            </kbd>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex justify-between items-center px-2 mt-3 text-xs text-slate-400 font-mono">
          <span>
            SHOWING: <strong className="text-emerald-300">{filteredCount}</strong> OF <strong className="text-slate-300">{totalCount}</strong> REPOSITORIES
          </span>
          {searchQuery && (
            <span>
              QUERY: <strong className="text-amber-300 font-bold">"{searchQuery}"</strong>
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
