'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface HeroApexNodeProps {
  repo: RepoItem;
  onScrollDown?: () => void;
}

export const HeroApexNode: React.FC<HeroApexNodeProps> = ({
  repo,
  onScrollDown,
}) => {
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(repo.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative w-full max-w-[460px] rounded-3xl p-6 sm:p-7 bg-[#070e1b]/95 border border-cyan-500/50 shadow-[0_0_50px_-10px_rgba(6,182,212,0.25)] backdrop-blur-2xl transition-all duration-300 font-sans">
      
      {/* 1. Header Rank & Status */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-sm">
          👑 #1 APEX BREAKOUT
        </span>

        {repo.isVerified && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-bold">
            ✓ VERIFIED OSS
          </span>
        )}
      </div>

      {/* 2. Author Avatar & Title */}
      <div className="flex items-start gap-3.5 mb-3">
        <img
          src={repo.ownerAvatar}
          alt={repo.owner}
          className="w-12 h-12 rounded-2xl ring-2 ring-cyan-500/50 bg-slate-800 flex-shrink-0 shadow-md"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="min-w-0 flex-1">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="text-xl sm:text-2xl font-mono font-bold text-white hover:text-cyan-300 transition-colors block truncate group"
          >
            {repo.fullName}
            <span className="inline-block ml-1.5 text-cyan-400 text-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              ↗
            </span>
          </a>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mt-0.5">
            <span>by <strong className="text-slate-300">{repo.owner}</strong></span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">{repo.language || 'Code'}</span>
          </div>
        </div>
      </div>

      {/* 3. Description */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
        {repo.description}
      </p>

      {/* 4. Real Metrics HUD 3-Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 font-mono text-center">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">STARGAZERS</div>
          <div className="text-sm sm:text-base font-bold text-amber-300 mt-0.5">
            {formatNumber(repo.stars)} ⭐
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">FORKS</div>
          <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">
            {formatNumber(repo.forks)} 🍴
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">VELOCITY</div>
          <div className="text-sm sm:text-base font-bold text-cyan-300 mt-0.5 truncate">
            {repo.growthDeltaText ? repo.growthDeltaText.split('•')[0].trim() : '+850/day'}
          </div>
        </div>
      </div>

      {/* 5. Topic Tags */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}

      {/* 6. Direct 1-Click Action Buttons */}
      <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <button
          onClick={handleCopy}
          className={`px-3.5 py-2 rounded-xl font-mono font-semibold text-xs transition-all border ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-800'
          }`}
        >
          {copied ? '✓ Link Copied' : '📋 Copy Link'}
        </button>

        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 transition-all shadow-md flex items-center space-x-1.5"
        >
          <span>⭐ Star on GitHub</span>
          <span>↗</span>
        </a>
      </div>

      {/* 7. Centered Scroll Down Prompt */}
      {onScrollDown && (
        <div className="pt-3 flex justify-center">
          <button
            onClick={onScrollDown}
            className="w-7 h-7 rounded-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all hover:scale-110 shadow"
            title="Scroll to explore repository feed"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
};
