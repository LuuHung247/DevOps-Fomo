'use client';

import React from 'react';
import { Filter, ArrowUpDown, Code2, LayoutGrid, List } from 'lucide-react';

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
  const languages = ['all', 'Python', 'Go', 'Rust', 'TypeScript', 'Shell'];
  const starThresholds = [
    { label: 'Any Stars', val: 0 },
    { label: '⭐ 5k+', val: 5000 },
    { label: '⭐ 10k+', val: 10000 },
    { label: '⭐ 25k+', val: 25000 },
    { label: '⭐ 50k+', val: 50000 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Star Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Stars:</span>
            <div className="flex items-center space-x-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              {starThresholds.map((th) => (
                <button
                  key={th.val}
                  onClick={() => onMinStarsChange(th.val)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    minStars === th.val
                      ? 'bg-brand-500/20 text-brand-300 font-semibold'
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
              className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang === 'all' ? '' : lang.toLowerCase()}>
                  {lang === 'all' ? 'All Languages' : lang}
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
              className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="stars">Most Stars (Total)</option>
              <option value="velocity">Star Growth / Velocity 🔥</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`p-1.5 rounded ${viewMode === 'compact' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Compact View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
