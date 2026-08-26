'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface VariantProps {
  repos: RepoItem[];
}

export const VariantMarqueeTicker: React.FC<VariantProps> = ({ repos }) => {
  const topRepos = repos.slice(0, 6);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="w-full font-sans">
      {/* Sleek Marquee Banner Container */}
      <div className="relative rounded-xl p-2.5 bg-slate-950/80 border border-slate-800 shadow-inner flex items-center gap-3 overflow-hidden">
        
        {/* Left Live Badge */}
        <div className="flex items-center space-x-2 flex-shrink-0 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-red-400">
            RADAR TICKER
          </span>
        </div>

        {/* Horizontal Ticker Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {topRepos.map((repo, idx) => {
            const rank = idx + 1;

            return (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 flex-shrink-0 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs font-mono group"
              >
                <span className="text-amber-400 font-extrabold text-[11px]">
                  #{rank}
                </span>
                <span className="text-white font-bold group-hover:text-cyan-300 transition-colors">
                  {repo.fullName.split('/')[1] || repo.fullName}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatNumber(repo.stars)} ⭐
                </span>
                {repo.growthDeltaText && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 hidden sm:inline">
                    {repo.growthDeltaText.split('•')[0]}
                  </span>
                )}
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
};
