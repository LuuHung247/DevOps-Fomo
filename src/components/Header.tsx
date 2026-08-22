'use client';

import React from 'react';

interface HeaderProps {
  totalRepos: number;
  totalStars: number;
  trendingCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalRepos,
  totalStars,
  trendingCount,
  isRefreshing,
  onRefresh,
  onOpenExport,
}) => {
  const formatStars = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 transition-all font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo & Radar Status */}
        <div className="flex items-center space-x-2.5">
          <a href="/" className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
              DevOps<span className="text-amber-400">-FOMO</span>
            </span>
          </a>
          <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            RADAR ONLINE
          </span>
        </div>

        {/* Live Metrics on Desktop */}
        <div className="hidden md:flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            TRACKED: <strong className="text-white font-bold">{totalRepos}</strong>
          </div>
          <div className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            STARS: <strong className="text-amber-300 font-bold">{formatStars(totalStars)}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            Export
          </button>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-all disabled:opacity-50"
          >
            {isRefreshing ? 'Syncing...' : 'Sync'}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/LuuHung247/DevOps-Fomo"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};
