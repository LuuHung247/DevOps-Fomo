'use client';

import React from 'react';

interface HeaderProps {
  totalRepos: number;
  totalStars: number;
}

export const Header: React.FC<HeaderProps> = ({ totalRepos, totalStars }) => {
  const formatStars = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toString();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="/" className="flex items-center space-x-1.5">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-mono">
            DevOps<span className="text-amber-400">-FOMO</span>
          </span>
        </a>

        {/* Right Info & GitHub Link */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="text-slate-400 hidden sm:block">
            <span className="text-white font-bold">{totalRepos}</span> repos • <span className="text-amber-300 font-bold">{formatStars(totalStars)}</span> stars
          </div>

          <a
            href="https://github.com/LuuHung247/DevOps-Fomo"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-colors font-semibold"
          >
            GitHub
          </a>
        </div>

      </div>
    </header>
  );
};
