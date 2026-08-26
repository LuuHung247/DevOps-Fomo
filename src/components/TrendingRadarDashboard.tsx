'use client';

import React, { useState, useEffect } from 'react';
import { RepoItem } from '@/lib/types';
import { ThreeHeroCanvas } from '@/components/threeui/ThreeHeroCanvas';

interface TrendingRadarDashboardProps {
  repos: RepoItem[];
}

export const TrendingRadarDashboard: React.FC<TrendingRadarDashboardProps> = ({ repos }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Take top 5 breakout projects
  const topBreakouts = repos.slice(0, 5);
  const activeRepo = topBreakouts[selectedIndex] || topBreakouts[0];

  // Auto-rotate every 6s when user is not manually interacting
  useEffect(() => {
    if (!isAutoRotate || topBreakouts.length === 0) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % topBreakouts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoRotate, topBreakouts.length]);

  if (!activeRepo) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(activeRepo.url);
    setCopiedId(activeRepo.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const rankBadges = [
    { label: '👑 #1 APEX BREAKOUT', color: 'from-amber-400 via-orange-500 to-amber-500', text: 'text-slate-950', ring: 'ring-amber-400/50' },
    { label: '⚡ #2 VIRAL SURGE', color: 'from-cyan-400 via-blue-500 to-teal-400', text: 'text-slate-950', ring: 'ring-cyan-400/50' },
    { label: '🚀 #3 HYPER RISING', color: 'from-orange-400 via-amber-500 to-rose-500', text: 'text-slate-950', ring: 'ring-orange-400/50' },
    { label: '💎 #4 COMMUNITY GEM', color: 'from-emerald-400 via-teal-500 to-cyan-400', text: 'text-slate-950', ring: 'ring-emerald-400/50' },
    { label: '🌐 #5 RADAR SIGNAL', color: 'from-violet-400 via-purple-500 to-indigo-400', text: 'text-white', ring: 'ring-violet-400/50' },
  ];

  const currentBadge = rankBadges[selectedIndex] || rankBadges[0];

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-8 font-sans">
      
      {/* 1. CINEMATIC INTRO & BRAND SLOGAN HOOK */}
      <div className="text-center mb-8 space-y-3">
        {/* Live Radar Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-xs font-black uppercase tracking-wider text-cyan-300">
            LIVE INTELLIGENCE RADAR • REAL-TIME TECH PULSE
          </span>
        </div>

        {/* Hero Slogan */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          We track the hype <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            so you don't have to.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The definitive open-source radar detecting viral AI breakthroughs, DevOps infrastructure, and developer tools before they peak.
        </p>

        {/* Live Metrics Ticker */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 pt-2 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="text-emerald-400 font-bold">●</span>
            <span>7,100+ Repos Scanned</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-amber-400 font-bold">⭐</span>
            <span>25.1M+ Stars Tracked</span>
          </div>
          <div className="flex items-center space-x-1.5 hidden sm:flex">
            <span className="text-cyan-400 font-bold">⚡</span>
            <span>5-Tier Velocity Engine</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S HOT BREAKOUTS: RANKING + DETAIL FOCUS STAGE */}
      <div
        onMouseEnter={() => setIsAutoRotate(false)}
        onMouseLeave={() => setIsAutoRotate(true)}
        className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black/95 border border-cyan-500/30 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.2)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient Canvas Background */}
        <ThreeHeroCanvas className="opacity-75" />

        {/* Stage Header */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5 mb-5">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>🔥 TODAY'S BREAKOUT PHENOMENA</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono text-slate-400">
              Click any tool below to focus
            </span>
          </div>

          <div className="font-mono text-xs text-slate-400">
            Spotlight <span className="text-cyan-400 font-bold">#{selectedIndex + 1}</span> of {topBreakouts.length}
          </div>
        </div>

        {/* 2-Column Responsive Layout: Ranking List on Left, Deep-Dive Focus on Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT: Top 5 Interactive Ranking List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2 justify-between">
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
                  className={`w-full p-3 rounded-2xl text-left transition-all duration-200 flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-cyan-400 shadow-[0_0_20px_-3px_rgba(6,182,212,0.35)] scale-[1.02]'
                      : 'bg-slate-950/60 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Rank Number Badge */}
                    <span
                      className={`flex-shrink-0 flex items-center justify-center font-mono font-black text-xs w-7 h-7 rounded-xl shadow-md ${
                        rankNum === 1
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950'
                          : rankNum === 2
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950'
                          : rankNum === 3
                          ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{rankNum}
                    </span>

                    {/* Repo Name & Delta */}
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-bold text-xs sm:text-sm text-white truncate">
                        {repo.fullName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                        {repo.growthDeltaText || repo.description}
                      </div>
                    </div>
                  </div>

                  {/* Stars Pill */}
                  <div className="flex-shrink-0 font-mono text-xs font-bold text-amber-300 bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-800">
                    {formatNumber(repo.stars)} ⭐
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Focused Deep-Dive Spotlight Card (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border border-cyan-500/40 shadow-2xl flex flex-col justify-between relative group">
            
            <div>
              {/* Card Header: Rank Badge & Velocity */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-black bg-gradient-to-r ${currentBadge.color} ${currentBadge.text} shadow-md flex items-center gap-1.5`}
                >
                  {currentBadge.label}
                </span>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    ● Velocity: {activeRepo.velocityScore || 99}/100
                  </span>
                </div>
              </div>

              {/* Title & Avatar */}
              <div className="flex items-start gap-3.5 mt-2">
                <img
                  src={activeRepo.ownerAvatar}
                  alt={activeRepo.owner}
                  className={`w-12 h-12 rounded-2xl ring-2 ${currentBadge.ring} bg-slate-800 flex-shrink-0 shadow-lg`}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={activeRepo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg sm:text-xl font-mono font-black text-white hover:text-cyan-300 transition-colors block truncate"
                  >
                    {activeRepo.fullName}
                    <span className="inline-block ml-1.5 text-cyan-400">↗</span>
                  </a>
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mt-1">
                    <span className="text-cyan-400 font-semibold">{activeRepo.language || 'Code'}</span>
                    <span>•</span>
                    <span>{formatNumber(activeRepo.stars)} Stargazers</span>
                    <span>•</span>
                    <span>{formatNumber(activeRepo.forks)} Forks</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 mt-3 leading-relaxed font-normal">
                {activeRepo.description}
              </p>

              {/* Growth Delta Highlight */}
              {activeRepo.growthDeltaText && (
                <div className="mt-3.5 inline-flex items-center font-mono text-xs font-bold text-amber-200 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
                  ⚡ {activeRepo.growthDeltaText}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeRepo.topics && activeRepo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-xl font-mono font-semibold text-xs transition-all border ${
                    copiedId === activeRepo.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  {copiedId === activeRepo.id ? '✓ Copied' : '📋 Copy'}
                </button>
                <a
                  href={activeRepo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 transition-all shadow-md flex items-center gap-1"
                >
                  <span>Explore</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
