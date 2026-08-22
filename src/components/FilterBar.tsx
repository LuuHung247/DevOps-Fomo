'use client';

import React from 'react';
import { Filter, ArrowUpDown, Code2, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  minStars: number;
  onMinStarsChange: (val: number) => void;
  language: string;
  onLanguageChange: (val: string) => void;
  sortBy: 'stars' | 'velocity' | 'updated';
  onSortByChange: (val: 'stars' | 'velocity' | 'updated') => void;
  viewMode: 'grid' | 'compact';
  onViewModeChange: (val: 'grid' | 'compact') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  minStars,
  onMinStarsChange,
  language,
  onLanguageChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
}) => {
  const languages = [
    { label: 'All Languages', val: '' },
    { label: 'Python', val: 'python', color: 'bg-blue-400' },
    { label: 'Go', val: 'go', color: 'bg-cyan-400' },
    { label: 'Rust', val: 'rust', color: 'bg-orange-500' },
    { label: 'TypeScript', val: 'typescript', color: 'bg-blue-500' },
    { label: 'Shell / Bash', val: 'shell', color: 'bg-emerald-400' },
  ];

  const starThresholds = [
    { label: 'Any Stars', val: 0 },
    { label: '⭐ 5k+', val: 5000 },
    { label: '⭐ 10k+', val: 10000 },
    { label: '⭐ 25k+', val: 25000 },
    { label: '⭐ 50k+', val: 50000 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs shadow-xl shadow-black/40">
        
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3.5">
          
          {/* Star Filter Pills */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Threshold:</span>
            </span>
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {starThresholds.map((th) => (
                <button
                  key={th.val}
                  onClick={() => onMinStarsChange(th.val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    minStars === th.val
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.label} value={lang.val}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Sorting & View Options */}
        <div className="flex items-center space-x-3 ml-auto">
          
          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'stars' | 'velocity' | 'updated')}
              className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              <option value="stars">⭐ Most Stars (Hall of Fame)</option>
              <option value="velocity">🔥 Star Velocity / Momentum</option>
              <option value="updated">⏱️ Recently Updated</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-emerald-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bento Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'compact'
                  ? 'bg-slate-800 text-emerald-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
