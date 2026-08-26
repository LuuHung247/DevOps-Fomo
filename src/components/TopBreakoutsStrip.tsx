'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface TopBreakoutsStripProps {
  repos: RepoItem[];
}

export const TopBreakoutsStrip: React.FC<TopBreakoutsStripProps> = ({ repos }) => {
  const top3 = repos.slice(0, 3);
  if (top3.length < 3) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const configs = [
    { rank: '👑 #1 APEX', border: 'border-amber-500/50 hover:border-amber-400', badge: 'bg-amber-400 text-slate-950', glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]' },
    { rank: '⚡ #2 VIRAL', border: 'border-cyan-500/50 hover:border-cyan-400', badge: 'bg-cyan-400 text-slate-950', glow: 'shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)]' },
    { rank: '🚀 #3 HOT', border: 'border-orange-500/50 hover:border-orange-400', badge: 'bg-orange-500 text-slate-950', glow: 'shadow-[0_0_20px_-5px_rgba(249,115,22,0.2)]' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {top3.map((repo, idx) => {
          const cfg = configs[idx] || configs[0];

          return (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className={`p-3.5 rounded-2xl bg-slate-900/80 border ${cfg.border} ${cfg.glow} transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${cfg.badge}`}>
                    {cfg.rank}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {formatNumber(repo.stars)} ⭐
                  </span>
                </div>

                <div className="font-mono font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                  {repo.fullName}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {repo.description}
                </p>
              </div>

              {repo.growthDeltaText && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 truncate">
                    ⚡ {repo.growthDeltaText.split('•')[0]}
                  </span>
                  <span className="text-slate-500 group-hover:text-white transition-colors">
                    ↗
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};
