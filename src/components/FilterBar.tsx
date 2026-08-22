'use client';

import React from 'react';

interface FilterBarProps {
  minStars: number;
  onMinStarsChange: (val: number) => void;
  sortBy: 'stars' | 'velocity' | 'updated';
  onSortByChange: (val: 'stars' | 'velocity' | 'updated') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  minStars,
  onMinStarsChange,
  sortBy,
  onSortByChange,
}) => {
  const starThresholds = [
    { label: 'Any', val: 0 },
    { label: '5k+', val: 5000 },
    { label: '10k+', val: 10000 },
    { label: '25k+', val: 25000 },
    { label: '50k+', val: 50000 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Star Threshold Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-semibold flex-shrink-0">Stars:</span>
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 flex-shrink-0">
            {starThresholds.map((th) => (
              <button
                key={th.val}
                onClick={() => onMinStarsChange(th.val)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
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

        {/* Sort Selector */}
        <div className="flex items-center space-x-2 justify-between sm:justify-end">
          <span className="text-slate-400 font-semibold flex-shrink-0">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'stars' | 'velocity' | 'updated')}
            className="w-full sm:w-auto bg-slate-950 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono cursor-pointer"
          >
            <option value="stars">Most Stars (Desc)</option>
            <option value="velocity">Velocity / Growth Rate</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>

      </div>
    </div>
  );
};
