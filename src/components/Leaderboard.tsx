'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface LeaderboardProps {
  repos: RepoItem[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ repos }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter explosive breakouts or top velocity items
  const explosiveRepos = repos.filter(
    (r) => r.velocityLabel === 'EXPLOSIVE' || (r.velocityScore && r.velocityScore >= 98)
  ).slice(0, 5);

  if (explosiveRepos.length === 0) return null;

  const handleCopy = (e: React.MouseEvent, repo: RepoItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(repo.url);
    setCopiedId(repo.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-8 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 border-b border-red-500/30 pb-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <h2 className="font-mono text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
            🔥 BREAKOUT LEADERBOARD
          </h2>
        </div>
        <span className="text-[11px] font-mono text-amber-400 font-semibold hidden sm:inline">
          Today's Top Viral Tools
        </span>
      </div>

      {/* Leaderboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {explosiveRepos.map((repo, idx) => {
          const rank = idx + 1;
          const isTopRank = rank === 1;

          return (
            <div
              key={repo.id}
              className={`p-3.5 sm:p-4 rounded-xl transition-all duration-300 ${
                isTopRank
                  ? 'fomo-flame-card border border-red-500 md:col-span-2'
                  : 'bg-gradient-to-br from-red-950/30 via-slate-900 to-slate-950 border border-red-500/40 hover:border-red-500/80 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                {/* Left: Rank & Title */}
                <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                  {/* Rank Badge */}
                  <span
                    className={`flex-shrink-0 flex items-center justify-center font-mono font-black text-xs w-6 h-6 rounded-lg ${
                      isTopRank
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                        : rank === 2
                        ? 'bg-amber-500 text-slate-950'
                        : rank === 3
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{rank}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-sm sm:text-base text-white hover:text-red-400 font-mono transition-colors truncate"
                      >
                        {repo.fullName}
                      </a>
                      <span className="fomo-flame-tag px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold">
                        BREAKOUT
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-snug font-normal">
                      {repo.description}
                    </p>

                    {/* Growth delta / signal */}
                    {repo.growthDeltaText && (
                      <div className="mt-2 inline-flex items-center font-mono text-[11px] font-bold text-amber-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                        ⚡ {repo.growthDeltaText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Stats & Copy */}
                <div className="flex flex-col items-end space-y-2 flex-shrink-0 font-mono text-xs">
                  <span className="text-amber-300 font-extrabold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {formatNumber(repo.stars)} ⭐
                  </span>

                  <button
                    onClick={(e) => handleCopy(e, repo)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all border whitespace-nowrap ${
                      copiedId === repo.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {copiedId === repo.id ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
