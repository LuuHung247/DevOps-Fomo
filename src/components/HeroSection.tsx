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

  return (
    <section className="relative pt-6 pb-2 sm:pt-8 sm:pb-3 px-4 sm:px-6 max-w-4xl mx-auto text-center font-sans">
      
      {/* Main Headline */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 font-sans leading-tight">
        We track the hype <span className="text-emerald-400">so you don't have to</span>
      </h1>

      <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-4 leading-relaxed font-normal">
        Real-time intelligence filtering GitHub trending, Hacker News, and developer signals down to what actually matters.
      </p>

      {/* Search Input Box */}
      <div className="relative max-w-xl mx-auto font-sans">
        <div className="relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repository, author, or keyword... (Press '/' to focus)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 px-2 py-0.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors"
            >
              Clear
            </button>
          )}
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none font-mono">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded">
              /
            </kbd>
          </div>
        </div>

        {/* Counter Info */}
        <div className="flex justify-between items-center px-2 mt-2 text-[11px] text-slate-400 font-mono">
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
