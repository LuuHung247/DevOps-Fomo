'use client';

import React from 'react';

interface RadarHeaderProps {
  timeRange: '7D' | '30D' | 'LIVE';
  onTimeRangeChange: (range: '7D' | '30D' | 'LIVE') => void;
  trackedCount: number;
}

export const RadarHeader: React.FC<RadarHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
  trackedCount,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans relative z-20">
      {/* Left Title Group */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-400">
            REAL-TIME INTELLIGENCE RADAR
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-[11px] text-slate-400">
            {trackedCount.toLocaleString()} signals active
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          What is breaking through?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          The developer ecosystem at a glance
        </p>
      </div>

      {/* Right Time Filter Controls */}
      <div className="flex items-center space-x-1.5 self-start sm:self-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/90 font-mono text-xs shadow-inner">
        {(['7D', '30D', 'LIVE'] as const).map((range) => {
          const isActive = timeRange === range;
          return (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {range === 'LIVE' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              )}
              <span>{range}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
