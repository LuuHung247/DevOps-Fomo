'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface SatelliteNodeProps {
  repo: RepoItem;
  rank: number;
  className?: string;
}

export const SatelliteNode: React.FC<SatelliteNodeProps> = ({
  repo,
  rank,
  className = '',
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getRankBadge = (r: number) => {
    switch (r) {
      case 2:
        return { label: '⚡ #2 MOMENTUM', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 3:
        return { label: '🚀 #3 BREAKOUT', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 4:
        return { label: '💎 #4 RISING', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 5:
        return { label: '🌐 #5 RISING', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40' };
      default:
        return { label: `#${r} RISING`, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getRankBadge(rank);

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className={`w-full max-w-[260px] sm:max-w-[280px] rounded-2xl p-4 bg-[#070e1b]/95 border border-slate-800/90 hover:border-cyan-500/50 hover:bg-[#0b1426] transition-all duration-200 shadow-lg backdrop-blur-md group hover:-translate-y-1 block ${className}`}
    >
      {/* Header Row: Rank Badge + Stars */}
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-xs font-mono font-bold text-amber-300">
          {formatNumber(repo.stars)} ⭐
        </span>
      </div>

      {/* Repo Title */}
      <div className="font-bold text-sm text-white tracking-tight truncate group-hover:text-cyan-300 transition-colors flex items-center justify-between">
        <span className="truncate">{repo.fullName}</span>
        <span className="opacity-0 group-hover:opacity-100 text-cyan-400 text-xs transition-opacity ml-1 flex-shrink-0">
          ↗
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug font-normal">
        {repo.description}
      </p>

      {/* Footer Info: Growth Delta & Language */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
        <span className="text-cyan-300 font-bold truncate">
          ⚡ {repo.growthDeltaText ? repo.growthDeltaText.split('•')[0].trim() : `+${Math.max(100, Math.floor(repo.stars * 0.04))}/day`}
        </span>
        <span className="text-slate-400 font-semibold">
          {repo.language || 'Code'}
        </span>
      </div>
    </a>
  );
};
