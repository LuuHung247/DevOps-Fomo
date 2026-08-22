'use client';

import React from 'react';
import { Flame, Sparkles, RefreshCw, Star, Github, Bookmark } from 'lucide-react';

interface HeaderProps {
  totalRepos: number;
  totalStars: number;
  trendingCount: number;
  favoritesCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
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
}) => {
  const formatStars = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 p-0.5 shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DevOps<span className="text-amber-400 font-mono">-FOMO</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                v1.0 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI & DevOps High-Utility Repos Tracker
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="hidden md:flex items-center space-x-5 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Tracked: <strong className="text-white font-mono">{totalRepos}</strong> repos</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Aggregated: <strong className="text-white font-mono">{formatStars(totalStars)}</strong> stars</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Favorites Filter Button */}
          <button
            onClick={onToggleFavorites}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
            title="View saved bookmarks"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Saved</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300 font-mono">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Sync / Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:text-white transition-all disabled:opacity-50"
            title="Force refresh live repository data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            title="Explore on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
