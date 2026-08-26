'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface VariantProps {
  repos: RepoItem[];
}

export const VariantPodiumBento: React.FC<VariantProps> = ({ repos }) => {
  const top3 = repos.slice(0, 3);
  if (top3.length < 3) return null;

  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
          🏆 Top 3 Breakout Champions
        </span>
      </div>

      {/* 3-Column Podium Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        
        {/* #2 Silver (Left) */}
        <div className="order-2 md:order-1 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col justify-between hover:border-slate-500 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-slate-200 text-slate-950">
                🥈 #2 Silver
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {formatNumber(second.stars)} ⭐
              </span>
            </div>
            <a
              href={second.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-mono font-bold text-white hover:text-cyan-300 transition-colors truncate block"
            >
              {second.fullName}
            </a>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
              {second.growthDeltaText || second.description}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>{second.language || 'Code'}</span>
            <a href={second.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
              View ↗
            </a>
          </div>
        </div>

        {/* #1 Gold Champion (Center - Elevated) */}
        <div className="order-1 md:order-2 p-4 rounded-xl bg-gradient-to-b from-amber-500/20 via-slate-900/95 to-slate-950 border-2 border-amber-500/80 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] flex flex-col justify-between -translate-y-1 hover:border-amber-400 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-md">
                👑 #1 APEX GOLD
              </span>
              <span className="text-xs font-mono font-black text-amber-300">
                {formatNumber(first.stars)} ⭐
              </span>
            </div>
            <a
              href={first.url}
              target="_blank"
              rel="noreferrer"
              className="text-base font-mono font-black text-white hover:text-amber-400 transition-colors truncate block"
            >
              {first.fullName}
            </a>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-snug">
              {first.growthDeltaText || first.description}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-500/30 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400 font-semibold">● Velocity: {first.velocityScore || 100}/100</span>
            <a
              href={first.url}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
            >
              Explore ↗
            </a>
          </div>
        </div>

        {/* #3 Bronze (Right) */}
        <div className="order-3 md:order-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col justify-between hover:border-slate-500 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-amber-700 text-white">
                🥉 #3 Bronze
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {formatNumber(third.stars)} ⭐
              </span>
            </div>
            <a
              href={third.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-mono font-bold text-white hover:text-cyan-300 transition-colors truncate block"
            >
              {third.fullName}
            </a>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
              {third.growthDeltaText || third.description}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>{third.language || 'Code'}</span>
            <a href={third.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
              View ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
