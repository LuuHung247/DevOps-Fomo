'use client';

import React, { useState, useRef } from 'react';
import { RepoItem } from '@/lib/types';

interface LeaderboardProps {
  repos: RepoItem[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ repos }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'explosive' | 'rising' | 'community'>('explosive');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 1. Filter top viral and breakout repositories
  const explosiveRepos = repos.filter(
    (r) => r.velocityLabel === 'EXPLOSIVE' || (r.velocityScore && r.velocityScore >= 98)
  );

  const risingRepos = repos.filter(
    (r) => r.velocityLabel === 'HOT RISING' || (r.velocityScore && r.velocityScore >= 94 && r.velocityScore < 98)
  );

  const communityRepos = repos.filter(
    (r) => r.velocityLabel === 'COMMUNITY PICK' || r.velocityLabel === 'EARLY GEM' || (r.socialSignals && (r.socialSignals.hnTopScore || r.socialSignals.devtoTopReactions))
  );

  // Selected pool based on tab
  const currentPool = activeTab === 'explosive' 
    ? (explosiveRepos.length >= 3 ? explosiveRepos : repos.slice(0, 5))
    : activeTab === 'rising'
    ? (risingRepos.length >= 3 ? risingRepos : repos.slice(2, 7))
    : (communityRepos.length >= 3 ? communityRepos : repos.slice(1, 6));

  const spotlightItem = currentPool[0];
  const challengers = currentPool.slice(1, 5);

  if (!spotlightItem) return null;

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
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-10 font-sans">
      {/* Container with Cyber Glassmorphism Surface */}
      <div className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black/95 border border-cyan-500/30 shadow-[0_0_50px_-10px_rgba(6,182,212,0.15)] backdrop-blur-xl overflow-hidden">
        
        {/* Background Ambient Glow Orbs (ThreeUI cyber aesthetics) */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Rail */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
                WEEKLY RADAR SPOTLIGHT
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                LIVE LEADERBOARD
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-1 flex items-center gap-1.5">
              <span>🚀 Top Breakout Phenomena of the Week</span>
            </h2>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setActiveTab('explosive')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                activeTab === 'explosive'
                  ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-md shadow-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Explosive
            </button>
            <button
              onClick={() => setActiveTab('rising')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                activeTab === 'rising'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Rising
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                activeTab === 'community'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💎 Community
            </button>
          </div>
        </div>

        {/* Spotlight & Challenger Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* #1 APEX CHAMPION SPOTLIGHT (Larger Hero Card) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-gradient-to-br from-red-950/40 via-slate-900/90 to-slate-950 border border-red-500/50 shadow-xl shadow-red-950/30 hover:border-red-400 transition-all duration-300 group">
            <div>
              {/* Card Header: Rank Badge & Velocity */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-black bg-gradient-to-r from-amber-400 to-orange-500 text-black flex items-center gap-1 shadow-md shadow-amber-500/20">
                    👑 #1 APEX BREAKOUT
                  </span>
                  {spotlightItem.velocityLabel && (
                    <span className="fomo-flame-tag px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase">
                      {spotlightItem.velocityLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 text-amber-300 font-mono font-bold text-xs bg-slate-950/90 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-inner">
                  <span>⭐ {formatNumber(spotlightItem.stars)}</span>
                </div>
              </div>

              {/* Repo Title & Avatar */}
              <div className="flex items-start gap-3 mt-2">
                <img
                  src={spotlightItem.ownerAvatar}
                  alt={spotlightItem.owner}
                  className="w-10 h-10 rounded-xl ring-2 ring-red-500/40 bg-slate-800 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={spotlightItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base sm:text-lg font-mono font-black text-white hover:text-red-400 transition-colors block truncate group-hover:underline"
                  >
                    {spotlightItem.fullName}
                  </a>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {spotlightItem.description}
                  </p>
                </div>
              </div>

              {/* Growth Delta Pill */}
              {spotlightItem.growthDeltaText && (
                <div className="mt-3.5 inline-flex items-center font-mono text-xs font-bold text-amber-200 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40 shadow-sm">
                  ⚡ {spotlightItem.growthDeltaText}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400 font-semibold">● Velocity: {spotlightItem.velocityScore || 100}/100</span>
                <span>•</span>
                <span>{spotlightItem.language || 'Code'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleCopy(e, spotlightItem)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                    copiedId === spotlightItem.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedId === spotlightItem.id ? '✓ Copied' : 'Copy'}
                </button>
                <a
                  href={spotlightItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white transition-all shadow-md shadow-red-950 flex items-center gap-1"
                >
                  <span>Explore</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* CHALLENGERS RAIL (#2 to #5) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {challengers.map((repo, idx) => {
              const rank = idx + 2;
              const isHovered = hoveredId === repo.id;

              return (
                <div
                  key={repo.id}
                  onMouseEnter={() => setHoveredId(repo.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`p-3 rounded-xl transition-all duration-200 border flex items-center justify-between gap-3 ${
                    isHovered
                      ? 'bg-slate-800/90 border-cyan-400/60 shadow-lg shadow-cyan-950/40 -translate-y-0.5'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Rank & Title */}
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <span
                      className={`flex-shrink-0 flex items-center justify-center font-mono font-black text-xs w-6 h-6 rounded-lg ${
                        rank === 2
                          ? 'bg-slate-300 text-slate-950 font-extrabold'
                          : rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      #{rank}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-bold text-xs sm:text-sm text-white hover:text-cyan-300 transition-colors truncate block"
                        >
                          {repo.fullName}
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {repo.growthDeltaText || repo.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stars & Action */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-amber-300 font-mono font-extrabold text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {formatNumber(repo.stars)} ⭐
                    </span>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="View on GitHub"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
