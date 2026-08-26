'use client';

import React, { useRef, useEffect } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-5 font-sans">
      <div className="relative font-sans">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repository by name, author, topics (e.g., 'agent', 'k8s', 'vllm')... (Press '/' to focus)"
            className="w-full pl-10 pr-20 py-3 rounded-2xl bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono shadow-inner"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 px-2 py-0.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 transition-colors"
            >
              Clear
            </button>
          )}

          <div className="absolute right-3.5 hidden sm:flex items-center pointer-events-none font-mono">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-800/90 border border-slate-700 rounded-md">
              /
            </kbd>
          </div>
        </div>

        {/* Counter & Query Info */}
        <div className="flex justify-between items-center px-2 mt-2 text-[11px] text-slate-400 font-mono">
          <span>
            SHOWING: <strong className="text-cyan-300">{filteredCount}</strong> OF <strong className="text-slate-300">{totalCount}</strong> REPOSITORIES
          </span>
          {searchQuery && (
            <span>
              FILTERED BY: <strong className="text-amber-300 font-bold">"{searchQuery}"</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
