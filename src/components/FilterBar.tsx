'use client';

import React from 'react';

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
    { label: 'Python', val: 'python' },
    { label: 'Go', val: 'go' },
    { label: 'Rust', val: 'rust' },
    { label: 'TypeScript', val: 'typescript' },
    { label: 'Shell / Bash', val: 'shell' },
  ];

  const starThresholds = [
    { label: 'Any', val: 0 },
    { label: '5k+', val: 5000 },
    { label: '10k+', val: 10000 },
    { label: '25k+', val: 25000 },
    { label: '50k+', val: 50000 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Star Threshold */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Stars:</span>
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {starThresholds.map((th) => (
                <button
                  key={th.val}
                  onClick={() => onMinStarsChange(th.val)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    minStars === th.val
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
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
            <span className="text-slate-400 font-semibold">Lang:</span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono cursor-pointer"
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
            <span className="text-slate-400 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'stars' | 'velocity' | 'updated')}
              className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono cursor-pointer"
            >
              <option value="stars">Most Stars (Desc)</option>
              <option value="velocity">Velocity / Growth Rate</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GRID
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                viewMode === 'compact'
                  ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LIST
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
