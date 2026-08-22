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
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-lg shadow-black/40 flex flex-col justify-between font-sans">
      
      {/* Top Section */}
      <div>
        {/* Title & Badges Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-white hover:text-emerald-400 transition-colors text-base sm:text-lg font-mono break-words leading-tight"
          >
            {repo.fullName}
          </a>

          {/* Status Badges */}
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 font-mono text-[10px] flex-shrink-0">
            {repo.isVerified && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                VERIFIED
              </span>
            )}
            {repo.velocityLabel && (
              <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/30 font-bold">
                [{repo.velocityLabel}]
              </span>
            )}
          </div>
        </div>

        {/* Owner Subtitle */}
        <div className="text-xs text-slate-400 font-mono mb-3">
          by <span className="text-slate-300">{repo.owner}</span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed font-normal">
          {repo.description}
        </p>

        {/* Topics Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5 font-mono text-[11px]">
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

      {/* Bottom Metrics & Actions Row */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 font-mono text-xs">
        
        {/* Metrics Counter */}
        <div className="flex items-center space-x-3.5 text-slate-400">
          <span className="text-amber-300 font-bold">Stars: {formatNumber(repo.stars)}</span>
          <span className="text-slate-400">Forks: {formatNumber(repo.forks)}</span>
        </div>

        {/* Action Link to GitHub */}
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border border-emerald-400 transition-colors text-xs inline-flex items-center"
        >
          View on GitHub
        </a>

      </div>

    </div>
  );
};
