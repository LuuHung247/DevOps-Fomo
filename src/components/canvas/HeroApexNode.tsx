'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface HeroApexNodeProps {
  repo: RepoItem;
  isSelected?: boolean;
  onClick?: () => void;
  onScrollDown?: () => void;
}

export const HeroApexNode: React.FC<HeroApexNodeProps> = ({
  repo,
  isSelected = true,
  onClick,
  onScrollDown,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Derive velocity text
  const velocityText = repo.growthDeltaText
    ? repo.growthDeltaText.split('•')[0].trim()
    : `+${Math.max(350, Math.floor(repo.stars * 0.08))}/day`;

  // Signals metrics
  const ghVelocity = repo.velocityScore || 96;
  const communityScore = Math.min(95, Math.max(75, Math.floor(ghVelocity * 0.92)));

  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[420px] rounded-3xl p-6 sm:p-7 bg-[#070e1b]/95 border transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-xl ${
        isSelected
          ? 'border-cyan-500/60 shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)]'
          : 'border-slate-800/80 hover:border-cyan-500/40'
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${repo.fullName}`}
    >
      {/* 1. Header Badges */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Rank 1 Apex Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-sm">
          #1 APEX BREAKOUT
        </div>

        {/* Velocity Pill */}
        <div className="px-3 py-1.5 rounded-full bg-[#0a1b2a] border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center space-x-1.5">
          <span className="text-slate-400">Velocity</span>
          <span className="font-bold text-cyan-300">{repo.velocityScore || 99}/100</span>
        </div>
      </div>

      {/* 2. Title & GitHub Link */}
      <div className="mb-2.5">
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-2xl sm:text-[26px] font-bold text-white tracking-tight hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 leading-snug group"
        >
          <span>{repo.fullName}</span>
          <span className="text-cyan-400 text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            ↗
          </span>
        </a>
      </div>

      {/* 3. Description */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
        {repo.description || 'Full-stack AI ecosystem repository with high breakout momentum.'}
      </p>

      {/* 4. Topic Pills */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5">
        {(repo.topics && repo.topics.length > 0
          ? repo.topics.slice(0, 4)
          : ['AI Security', 'Red Teaming', 'Agent Security', 'MCP']
        ).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-[#0f172a] text-slate-300 border border-slate-700/60 font-mono text-[11px]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 5. Metrics Stat Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Star Velocity Box */}
        <div className="p-3.5 rounded-2xl bg-[#0b1326] border border-slate-800/90 font-mono">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            STAR VELOCITY
          </div>
          <div className="text-xl font-bold text-cyan-300">
            {velocityText}
          </div>
        </div>

        {/* Total Stars Box */}
        <div className="p-3.5 rounded-2xl bg-[#0b1326] border border-slate-800/90 font-mono">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            TOTAL STARS
          </div>
          <div className="text-xl font-bold text-white">
            {formatNumber(repo.stars)}
          </div>
        </div>
      </div>

      {/* 6. 7-Day Trajectory Sparkline Curve */}
      <div className="mb-5 pt-1">
        <div className="relative w-full h-12">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 320 48" fill="none">
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Filled Area */}
            <path
              d="M 0 38 Q 40 36, 80 32 T 160 22 T 240 14 T 320 6 L 320 46 L 0 46 Z"
              fill="url(#sparklineGrad)"
            />
            {/* Baseline */}
            <line x1="0" y1="46" x2="320" y2="46" stroke="#1e293b" strokeWidth="1" />
            {/* Trajectory Stroke */}
            <path
              d="M 0 38 Q 40 36, 80 32 T 160 22 T 240 14 T 320 6"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 7. WHY IS IT #1? Section */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3 font-mono">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          WHY IS IT #1?
        </div>

        {/* GitHub Velocity Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">GitHub velocity</span>
            <span className="text-white font-bold">{ghVelocity}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${ghVelocity}%` }}
            />
          </div>
        </div>

        {/* Community Attention Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">Community attention</span>
            <span className="text-white font-bold">{communityScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${communityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 8. Down-arrow Scroll Button at Center-Bottom */}
      {onScrollDown && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScrollDown();
            }}
            className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title="Scroll to explore full repository feed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
