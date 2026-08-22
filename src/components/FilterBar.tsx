'use client';

import React from 'react';

interface FilterBarProps {
  sortBy: 'velocity' | 'stars' | 'updated';
  onSortByChange: (val: 'velocity' | 'stars' | 'updated') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-5 font-mono text-xs">
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Left: Section Label */}
        <span className="text-slate-400 font-semibold text-[11px]">
          REPOSITORY FEED
        </span>

        {/* Right: Sort Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold hidden sm:inline text-[11px]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'velocity' | 'stars' | 'updated')}
            className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono cursor-pointer"
          >
            <option value="velocity">🔥 Growth Velocity</option>
            <option value="updated">⚡ Recent Releases</option>
            <option value="stars">⭐ Total Stars</option>
          </select>
        </div>

      </div>
    </div>
  );
};
