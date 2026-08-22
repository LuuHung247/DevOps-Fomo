'use client';

import React from 'react';

interface FilterBarProps {
  sortBy: 'velocity' | 'stars' | 'updated';
  onSortByChange: (val: 'velocity' | 'stars' | 'updated') => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  onSortByChange,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-5 font-mono text-xs">
      <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
        
        {/* Left: Live Status / Philosophy */}
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
            Live Stream • Curated without vanity hype
          </span>
          <span className="text-[11px] text-slate-300 font-medium sm:hidden">
            Live Feed
          </span>
        </div>

        {/* Right: Sort Selector & Optional Refresh */}
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-[11px] font-semibold"
            >
              {isRefreshing ? 'Syncing...' : '↻ Sync'}
            </button>
          )}

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'velocity' | 'stars' | 'updated')}
              className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono cursor-pointer"
            >
              <option value="velocity">🔥 Velocity / FOMO Score</option>
              <option value="updated">⚡ Recently Updated / Releases</option>
              <option value="stars">⭐ Total Stars</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
