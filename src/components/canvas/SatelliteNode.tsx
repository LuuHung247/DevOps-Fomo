'use client';

import React from 'react';
import { RepoItem } from '@/lib/types';

interface SatelliteNodeProps {
  repo: RepoItem;
  rank: number;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
}

export const SatelliteNode: React.FC<SatelliteNodeProps> = ({
  repo,
  rank,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const getRankConfig = (r: number) => {
    switch (r) {
      case 2:
        return { label: '#2 · MOMENTUM', accent: 'text-cyan-300' };
      case 3:
        return { label: '#3 · BREAKOUT', accent: 'text-cyan-300' };
      case 4:
        return { label: '#4 · RISING', accent: 'text-cyan-300' };
      case 5:
        return { label: '#5 · RISING', accent: 'text-cyan-300' };
      default:
        return { label: `#${r} · SIGNAL`, accent: 'text-slate-300' };
    }
  };

  const config = getRankConfig(rank);

  // Derive velocity text
  const velocityText = repo.growthDeltaText
    ? repo.growthDeltaText.split('•')[0].trim()
    : `+${Math.max(150, Math.floor(repo.stars * 0.05))}/day`;

  // Derive category/tag subtitle
  const categoryText = repo.topics && repo.topics.length > 0
    ? repo.topics.slice(0, 2).map((t) => t.replace(/-/g, ' ')).join(' · ')
    : repo.language || 'Developer Tool';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Inspect rank ${rank}: ${repo.fullName}`}
      className={`w-full max-w-[240px] sm:max-w-[260px] rounded-2xl p-4 sm:p-4.5 bg-[#070e1b]/90 border transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md group ${
        isSelected
          ? 'border-cyan-400/80 bg-[#0c1629] shadow-[0_0_25px_-5px_rgba(6,182,212,0.35)] scale-[1.02]'
          : 'border-slate-800/80 hover:border-slate-700 hover:bg-[#0a1324] hover:-translate-y-1'
      } ${className}`}
    >
      {/* Rank Header Label */}
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
        <span>{config.label}</span>
        <span className="opacity-0 group-hover:opacity-100 text-cyan-400 text-xs transition-opacity">
          ↗
        </span>
      </div>

      {/* Repository Full Name */}
      <div className="font-bold text-sm sm:text-base text-white tracking-tight truncate group-hover:text-cyan-200 transition-colors">
        {repo.fullName}
      </div>

      {/* Category / Subtitle */}
      <div className="text-[11px] font-mono text-slate-400 capitalize truncate mt-0.5 mb-2.5">
        {categoryText}
      </div>

      {/* Star Velocity Tag */}
      <div className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
        {velocityText}
      </div>
    </div>
  );
};
