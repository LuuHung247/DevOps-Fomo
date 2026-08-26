'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface VariantProps {
  repos: RepoItem[];
}

export const VariantChipStrip: React.FC<VariantProps> = ({ repos }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const topRepos = repos.slice(0, 5);
  const selectedRepo = topRepos[selectedIdx] || topRepos[0];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (!selectedRepo) return null;

  return (
    <div className="w-full font-sans">
      {/* Chip Tabs Header */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-2">
        {topRepos.map((repo, idx) => {
          const isSelected = selectedIdx === idx;
          const rank = idx + 1;

          return (
            <button
              key={repo.id}
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                rank === 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                #{rank}
              </span>
              <span>{repo.fullName.split('/')[1] || repo.fullName}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {formatNumber(repo.stars)} ⭐
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Repo Spotlight Bar */}
      <div className="mt-2 p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-white">
              {selectedRepo.fullName}
            </span>
            {selectedRepo.growthDeltaText && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ⚡ {selectedRepo.growthDeltaText}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">
            {selectedRepo.description}
          </p>
        </div>

        <a
          href={selectedRepo.url}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex-shrink-0 transition-colors"
        >
          View Repo ↗
        </a>
      </div>
    </div>
  );
};
