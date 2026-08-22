'use client';

import React from 'react';

interface HeaderProps {
  totalRepos: number;
  totalStars: number;
  trendingCount: number;
  favoritesCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalRepos,
  totalStars,
  trendingCount,
  favoritesCount,
  isRefreshing,
  onRefresh,
  showFavoritesOnly,
  onToggleFavorites,
  onOpenExport,
}) => {
  const formatStars = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Status */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-tight text-white font-mono">
              DevOps<span className="text-amber-400">-FOMO</span>
            </span>
          </a>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            RADAR ONLINE
          </span>
        </div>

        {/* Live Counters */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            TRACKED: <strong className="text-white font-bold">{totalRepos}</strong>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            TOTAL STARS: <strong className="text-amber-300 font-bold">{formatStars(totalStars)}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            Export
          </button>

          {/* Bookmarks Toggle */}
          <button
            onClick={onToggleFavorites}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            Bookmarks {favoritesCount > 0 && `(${favoritesCount})`}
          </button>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-all disabled:opacity-50"
          >
            {isRefreshing ? 'Syncing...' : 'Sync'}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/LuuHung247/DevOps-Fomo"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors hidden sm:inline-block"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};
