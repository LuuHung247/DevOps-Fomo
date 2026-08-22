'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface RepoCardProps {
  repo: RepoItem;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-md shadow-black/40 font-sans">
      
      {/* Header Row: Title & Top Right Actions / Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
        
        {/* Left: Name, Owner & Status Badges */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-white hover:text-emerald-400 transition-colors text-base sm:text-lg font-mono break-words leading-tight"
            >
              {repo.fullName}
            </a>
          </div>

          <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1 font-mono text-[11px] text-slate-400">
            <span>by <strong className="text-slate-300 font-medium">{repo.owner}</strong></span>
            {repo.isVerified && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                VERIFIED
              </span>
            )}
            {repo.velocityLabel && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-950 text-amber-300 border border-amber-500/30 font-bold">
                [{repo.velocityLabel}]
              </span>
            )}
          </div>
        </div>

        {/* Right: Metrics & Redirect Button */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 flex-shrink-0 font-mono text-xs pt-1 sm:pt-0">
          <div className="flex items-center space-x-2.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <span className="text-amber-300 font-bold">{formatNumber(repo.stars)} stars</span>
            <span className="text-slate-500">•</span>
            <span>{formatNumber(repo.forks)} forks</span>
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold border border-emerald-400 transition-colors text-xs inline-flex items-center whitespace-nowrap shadow-sm"
          >
            Open Repo
          </a>
        </div>

      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed font-normal">
        {repo.description}
      </p>

      {/* Topics Pills */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
        {repo.topics.slice(0, 5).map((topic) => (
          <span
            key={topic}
            className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
          >
            #{topic}
          </span>
        ))}
        {repo.topics.length > 5 && (
          <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
            +{repo.topics.length - 5}
          </span>
        )}
      </div>

    </div>
  );
};
