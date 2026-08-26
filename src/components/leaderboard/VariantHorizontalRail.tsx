'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface VariantProps {
  repos: RepoItem[];
}

export const VariantHorizontalRail: React.FC<VariantProps> = ({ repos }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const topRepos = repos.slice(0, 5);

  const handleCopy = (e: React.MouseEvent, repo: RepoItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(repo.url);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="w-full font-sans">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Weekly Leaderboard • Top 5 Velocity
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-medium">
          Linear / Vercel Style
        </span>
      </div>

      {/* Horizontal Scroll Rail */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {topRepos.map((repo, idx) => {
          const rank = idx + 1;
          const isTop = rank === 1;

          return (
            <div
              key={repo.id}
              className={`snap-start flex-shrink-0 w-72 p-3.5 rounded-xl transition-all duration-300 relative group flex flex-col justify-between ${
                isTop
                  ? 'bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/40 hover:border-amber-400/80 shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)]'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isTop
                          ? 'bg-amber-400 text-slate-950'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{rank}
                    </span>
                    {repo.velocityLabel && (
                      <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                        {repo.velocityLabel}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono font-extrabold text-amber-300">
                    ⭐ {formatNumber(repo.stars)}
                  </span>
                </div>

                {/* Repo Name */}
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono font-bold text-white group-hover:text-emerald-400 transition-colors truncate block"
                >
                  {repo.fullName}
                </a>

                {/* Growth delta text */}
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  {repo.growthDeltaText || repo.description}
                </p>
              </div>

              {/* Action Bar */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {repo.language || 'Code'}
                </span>
                <button
                  onClick={(e) => handleCopy(e, repo)}
                  className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors"
                >
                  {copiedId === repo.id ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
