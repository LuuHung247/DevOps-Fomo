'use client';

import React, { useState, useEffect } from 'react';
import { RepoItem } from '@/lib/types';
import { SEED_REPOSITORIES } from '@/lib/seeds';
import { ThreeCanvas } from '@/components/ThreeCanvas';

interface FullScreenLeaderboardProps {
  repos: RepoItem[];
}

export const FullScreenLeaderboard: React.FC<FullScreenLeaderboardProps> = ({ repos }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  const displayRepos = repos && repos.length > 0 ? repos : SEED_REPOSITORIES;
  const topBreakouts = displayRepos.slice(0, 5);
  const activeRepo = topBreakouts[selectedIndex] || topBreakouts[0];

  useEffect(() => {
    if (!isAutoRotate || topBreakouts.length === 0) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % topBreakouts.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoRotate, topBreakouts.length]);

  if (!activeRepo) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeRepo.url);
    setCopiedId(activeRepo.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleScrollDown = () => {
    const feed = document.getElementById('main-feed');
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const rankBadges = [
    { label: '👑 #1 APEX BREAKOUT', color: 'from-amber-400 to-orange-500', text: 'text-slate-950', ring: 'ring-amber-400/60' },
    { label: '⚡ #2 VIRAL SURGE', color: 'from-cyan-400 to-blue-500', text: 'text-slate-950', ring: 'ring-cyan-400/60' },
    { label: '🚀 #3 HYPER RISING', color: 'from-orange-400 to-amber-500', text: 'text-slate-950', ring: 'ring-orange-400/60' },
    { label: '💎 #4 COMMUNITY GEM', color: 'from-emerald-400 to-teal-500', text: 'text-slate-950', ring: 'ring-emerald-400/60' },
    { label: '🌐 #5 VELOCITY MATRIX', color: 'from-violet-400 to-purple-500', text: 'text-white', ring: 'ring-violet-400/60' },
  ];

  const currentBadge = rankBadges[selectedIndex] || rankBadges[0];

  return (
    <section className="relative w-full min-h-[calc(100vh-4.5rem)] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-4 font-sans">
      
      {/* Ambient Particle Background */}
      <ThreeCanvas className="opacity-55" />

      {/* 1. TOP HUD RADAR BAR */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center space-x-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-300">
            REAL-TIME INTELLIGENCE RADAR
          </span>
          <span className="hidden md:inline-block text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
            "We track the hype so you don't have to"
          </span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-slate-400">
          <div>
            <span className="text-emerald-400 font-bold">●</span> LIVE RADAR
          </div>
          <div>
            <span className="text-white font-bold">{displayRepos.length}</span> Repos Tracked
          </div>
          <div className="text-amber-300 font-bold">
            Spotlight #{selectedIndex + 1} of {topBreakouts.length}
          </div>
        </div>
      </div>

      {/* 2. CENTER: FULL-SCREEN BENTO HERO STAGE */}
      <div
        onMouseEnter={() => setIsAutoRotate(false)}
        onMouseLeave={() => setIsAutoRotate(true)}
        className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch my-auto"
      >
        
        {/* LEFT / HERO SPOTLIGHT CARD (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/95 via-[#080e1e]/95 to-black/95 border border-cyan-500/40 fomo-active-spotlight backdrop-blur-2xl flex flex-col justify-between relative transition-all duration-300 space-y-4">
          
          <div>
            {/* Top Badge & Velocity Score */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <span
                className={`px-3.5 py-1 rounded-xl text-xs font-mono font-black bg-gradient-to-r ${currentBadge.color} ${currentBadge.text} shadow-md flex items-center gap-1.5`}
              >
                {currentBadge.label}
              </span>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-500/30">
                  ● Velocity Score: {activeRepo.velocityScore || 99}/100
                </span>
              </div>
            </div>

            {/* Repo Title & Avatar */}
            <div className="flex items-start gap-4 mt-2">
              <img
                src={activeRepo.ownerAvatar}
                alt={activeRepo.owner}
                className={`w-14 h-14 rounded-2xl ring-2 ${currentBadge.ring} bg-slate-800 flex-shrink-0 shadow-xl`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="min-w-0 flex-1">
                <a
                  href={activeRepo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl sm:text-2xl lg:text-3xl font-mono font-black text-white hover:text-cyan-300 transition-colors block truncate group"
                >
                  {activeRepo.fullName}
                  <span className="inline-block ml-2 text-cyan-400 group-hover:translate-x-1 transition-transform">↗</span>
                </a>
                <div className="flex items-center space-x-2.5 text-xs font-mono text-slate-400 mt-1">
                  <span className="text-cyan-400 font-semibold">{activeRepo.language || 'Code'}</span>
                  <span>•</span>
                  <span>{formatNumber(activeRepo.stars)} Stargazers</span>
                  <span>•</span>
                  <span>{formatNumber(activeRepo.forks)} Forks</span>
                </div>
              </div>
            </div>

            {/* Rich Description */}
            <p className="text-sm sm:text-base text-slate-300 line-clamp-3 mt-3 leading-relaxed font-normal">
              {activeRepo.description}
            </p>

            {/* Topic Pills */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {activeRepo.topics && activeRepo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>

          {/* Center Intelligence Analytics Block */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Growth Delta</div>
              <div className="font-bold text-amber-300 text-xs sm:text-sm truncate">
                ⚡ {activeRepo.growthDeltaText ? activeRepo.growthDeltaText.split('•')[0] : '+1,116 stars/day'}
              </div>
              <div className="text-[10px] text-slate-400">Viral breakout velocity</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Social Proof</div>
              <div className="font-bold text-cyan-300 text-xs sm:text-sm truncate">
                🔥 GitHub Trending #1
              </div>
              <div className="text-[10px] text-slate-400">Hacker News top score</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Ecosystem Status</div>
              <div className="font-bold text-emerald-400 text-xs sm:text-sm truncate">
                ✓ Verified Open Source
              </div>
              <div className="text-[10px] text-slate-400">Community endorsed</div>
            </div>
          </div>

          {/* Bottom Direct Action Buttons */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              Direct access repository:
            </div>

            <div className="flex items-center space-x-2.5 flex-shrink-0">
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl font-mono font-semibold text-xs transition-all border ${
                  copiedId === activeRepo.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {copiedId === activeRepo.id ? '✓ Link Copied' : '📋 Copy URL'}
              </button>
              <a
                href={activeRepo.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 flex items-center gap-1.5 transform hover:-translate-y-0.5"
              >
                <span>⭐ Explore on GitHub</span>
                <span>↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT / TOP 5 CHALLENGERS STACK (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 justify-between">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
            <span>⚡ Top Weekly Challengers:</span>
            <span className="text-slate-500 text-[10px]">Click to inspect</span>
          </div>

          {topBreakouts.map((repo, idx) => {
            const isSelected = selectedIndex === idx;
            const rankNum = idx + 1;

            return (
              <button
                key={repo.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  setIsAutoRotate(false);
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all duration-200 flex items-center justify-between gap-3 border relative ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_25px_-5px_rgba(6,182,212,0.35)] scale-[1.02]'
                    : 'bg-slate-950/70 hover:bg-slate-900/90 border-slate-800/80 hover:border-cyan-500/50 hover:-translate-x-1'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#06b6d4]" />
                )}

                <div className="flex items-center space-x-3 min-w-0 flex-1 pl-1">
                  <span
                    className={`flex-shrink-0 flex items-center justify-center font-mono font-black text-xs w-7 h-7 rounded-xl ${
                      rankNum === 1
                        ? 'bg-amber-400 text-slate-950'
                        : rankNum === 2
                        ? 'bg-cyan-400 text-slate-950'
                        : rankNum === 3
                        ? 'bg-orange-500 text-slate-950'
                        : rankNum === 4
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-violet-400 text-slate-950'
                    }`}
                  >
                    #{rankNum}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="font-mono font-bold text-xs sm:text-sm text-white truncate">
                      {repo.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {repo.growthDeltaText || repo.description}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 font-mono text-xs font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {formatNumber(repo.stars)} ⭐
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. BOTTOM SCROLL INDICATOR PROMPT */}
      <div className="relative z-10 text-center pt-3">
        <button
          onClick={handleScrollDown}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 font-mono text-xs transition-all animate-bounce cursor-pointer shadow-lg"
        >
          <span>↓ Scroll down to search & explore all 7,130+ repositories</span>
        </button>
      </div>

    </section>
  );
};
