'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RepoItem } from '@/lib/types';
import { ThreeHeroCanvas } from '@/components/threeui/ThreeHeroCanvas';

interface LeaderboardProps {
  repos: RepoItem[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ repos }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Filter top 5 high-impact viral breakout tools
  const topBreakouts = repos.slice(0, 5);
  const activeRepo = topBreakouts[selectedIndex] || topBreakouts[0];

  // Auto rotate showcase every 7 seconds if user is not hovering
  useEffect(() => {
    if (!isAutoPlay || topBreakouts.length === 0) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % topBreakouts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlay, topBreakouts.length]);

  if (!activeRepo) return null;

  // 3D Card Tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsAutoPlay(true);
  };

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

  const rank = selectedIndex + 1;
  const theme = rank === 1 ? 'amber' : rank === 2 ? 'cyan' : rank === 3 ? 'violet' : 'emerald';

  const rankBadgeConfig = [
    { label: '👑 #1 APEX PHENOMENON', color: 'from-amber-400 via-orange-500 to-yellow-400', border: 'border-amber-400/60', text: 'text-black' },
    { label: '🥈 #2 TITANIUM RISING', color: 'from-cyan-300 via-blue-400 to-teal-300', border: 'border-cyan-400/60', text: 'text-black' },
    { label: '🥉 #3 RADAR BREAKOUT', color: 'from-orange-400 via-amber-500 to-rose-400', border: 'border-orange-400/60', text: 'text-black' },
    { label: '💎 #4 COMMUNITY GEM', color: 'from-violet-400 via-purple-400 to-indigo-400', border: 'border-violet-400/60', text: 'text-white' },
    { label: '⚡ #5 VELOCITY MATRIX', color: 'from-emerald-400 via-teal-400 to-cyan-400', border: 'border-emerald-400/60', text: 'text-black' },
  ][selectedIndex] || { label: `#${rank} BREAKOUT`, color: 'from-slate-200 to-slate-400', border: 'border-slate-500', text: 'text-black' };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-12 font-sans">
      
      {/* 3D Showcase Stage Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 border border-cyan-500/30 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.2)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Interactive ThreeUI Canvas Particle Backdrop */}
        <ThreeHeroCanvas theme={theme} className="opacity-70" />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Header HUD Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-300">
              WEEKLY BREAKOUT SPOTLIGHT
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              PRO PRODUCT SHOWCASE
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-400">
            <span>Spotlight</span>
            <span className="text-white font-bold">{selectedIndex + 1}</span>
            <span>/</span>
            <span>{topBreakouts.length}</span>
          </div>
        </div>

        {/* Hero Product Body */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Product Info & Big Value Prop */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Rank & Velocity Badges */}
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-mono font-black bg-gradient-to-r ${rankBadgeConfig.color} ${rankBadgeConfig.text} shadow-lg shadow-amber-500/20 flex items-center gap-1.5`}
              >
                {rankBadgeConfig.label}
              </span>

              {activeRepo.velocityLabel && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-extrabold uppercase bg-red-950/80 text-red-300 border border-red-500/40">
                  🔥 {activeRepo.velocityLabel}
                </span>
              )}

              {activeRepo.growthDeltaText && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  ⚡ {activeRepo.growthDeltaText}
                </span>
              )}
            </div>

            {/* Repo Big Title */}
            <div className="flex items-center space-x-3.5">
              <img
                src={activeRepo.ownerAvatar}
                alt={activeRepo.owner}
                className="w-12 h-12 rounded-2xl ring-2 ring-cyan-500/50 bg-slate-800 flex-shrink-0 shadow-lg shadow-black"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="min-w-0">
                <a
                  href={activeRepo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl sm:text-2xl font-mono font-black text-white hover:text-cyan-300 transition-colors truncate block group"
                >
                  {activeRepo.fullName}
                  <span className="inline-block ml-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </a>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-semibold">{activeRepo.language || 'Code'}</span>
                  <span>•</span>
                  <span>Created {new Date(activeRepo.createdAt).getFullYear()}</span>
                  <span>•</span>
                  <span className="text-slate-300">Verified Open Source</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal line-clamp-3">
              {activeRepo.description}
            </p>

            {/* Topics Pill Tags */}
            {activeRepo.topics && activeRepo.topics.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {activeRepo.topics.slice(0, 5).map((topic) => (
                  <span
                    key={topic}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}

            {/* Direct Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={activeRepo.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>⭐ Explore on GitHub</span>
                <span className="font-sans font-black">↗</span>
              </a>

              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-mono font-semibold text-xs transition-all border ${
                  copiedId === activeRepo.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {copiedId === activeRepo.id ? '✓ Link Copied' : '📋 Copy URL'}
              </button>
            </div>

          </div>

          {/* Right: Key Performance HUD Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-2xl relative">
            
            {/* Radial Velocity Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#velocityGrad)"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - (activeRepo.velocityScore || 98) / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="velocityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-2xl font-black text-white tracking-tight">
                  {activeRepo.velocityScore || 98}
                </span>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                  VELOCITY
                </span>
              </div>
            </div>

            {/* Stars & Metric Stats */}
            <div className="w-full mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/60">
                <div className="text-[10px] text-slate-400 uppercase">Stargazers</div>
                <div className="text-sm font-black text-amber-300 mt-0.5">
                  {formatNumber(activeRepo.stars)} ⭐
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/60">
                <div className="text-[10px] text-slate-400 uppercase">Forks</div>
                <div className="text-sm font-black text-slate-200 mt-0.5">
                  {formatNumber(activeRepo.forks)} 🍴
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom: Apple-Style Interactive Showcase Dock */}
        <div className="relative z-10 mt-8 pt-5 border-t border-slate-800/80">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>🔥 Select Spotlight Item:</span>
            <span className="text-slate-500 font-normal">Click to switch or auto-rotates</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {topBreakouts.map((repo, idx) => {
              const isSelected = selectedIndex === idx;
              const itemRank = idx + 1;

              return (
                <button
                  key={repo.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setIsAutoPlay(false);
                  }}
                  className={`p-2.5 rounded-xl text-left font-mono transition-all duration-200 relative flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-500 text-white shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] -translate-y-1'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                        itemRank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : itemRank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : itemRank === 3
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{itemRank}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300">
                      {formatNumber(repo.stars)} ⭐
                    </span>
                  </div>

                  <div className="font-bold text-xs truncate mt-0.5">
                    {repo.fullName.split('/')[1] || repo.fullName}
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
