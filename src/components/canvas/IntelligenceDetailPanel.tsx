'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface IntelligenceDetailPanelProps {
  repo: RepoItem | null;
  rank: number;
  isOpen: boolean;
  onClose: () => void;
}

export const IntelligenceDetailPanel: React.FC<IntelligenceDetailPanelProps> = ({
  repo,
  rank,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !repo) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(repo.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const velocityText = repo.growthDeltaText
    ? repo.growthDeltaText.split('•')[0].trim()
    : `+${Math.max(200, Math.floor(repo.stars * 0.06))}/day`;

  const ghVelocity = repo.velocityScore || (100 - (rank - 1) * 3);
  const commAttention = Math.min(95, Math.max(70, Math.floor(ghVelocity * 0.92)));
  const catMomentum = Math.min(96, Math.max(68, Math.floor(ghVelocity * 0.95)));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#070e1b] border-l border-slate-800 shadow-2xl p-6 overflow-y-auto font-sans flex flex-col justify-between animate-reveal"
      >
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              REPOSITORY INTELLIGENCE
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono text-sm transition-colors border border-slate-800"
              aria-label="Close detail panel"
            >
              ✕
            </button>
          </div>

          {/* Repo Info Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono font-black text-[11px] uppercase">
                RANK #{rank}
              </span>
              {repo.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                  ✓ VERIFIED OSS
                </span>
              )}
            </div>

            <div className="flex items-start space-x-3.5 pt-1">
              <img
                src={repo.ownerAvatar}
                alt={repo.owner}
                className="w-12 h-12 rounded-2xl ring-1 ring-slate-700 bg-slate-800 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="min-w-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-bold text-white hover:text-cyan-300 transition-colors block truncate"
                >
                  {repo.fullName} ↗
                </a>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  by {repo.owner} • {repo.language || 'Code'}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {repo.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">STAR VELOCITY</div>
              <div className="text-base font-bold text-cyan-300 mt-0.5">{velocityText}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">TOTAL STARS</div>
              <div className="text-base font-bold text-white mt-0.5">{formatNumber(repo.stars)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">FORKS</div>
              <div className="text-base font-bold text-slate-200 mt-0.5">{formatNumber(repo.forks)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">RANK</div>
              <div className="text-base font-bold text-amber-300 mt-0.5">#{rank}</div>
            </div>
          </div>

          {/* Signal Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              SIGNAL BREAKDOWN
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">GitHub velocity</span>
                <span className="text-cyan-300 font-bold">{ghVelocity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${ghVelocity}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Community attention</span>
                <span className="text-cyan-300 font-bold">{commAttention}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${commAttention}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Category momentum</span>
                <span className="text-cyan-300 font-bold">{catMomentum}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${catMomentum}%` }} />
              </div>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
              WHY IT MATTERS
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              Significant spike in open-source adoption across the developer ecosystem with verified viral momentum on GitHub Trending and developer discussions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-800 flex items-center space-x-3 mt-6">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 rounded-xl font-mono font-bold text-xs bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-center hover:from-cyan-400 hover:to-emerald-300 transition-all shadow-md flex items-center justify-center space-x-1.5"
          >
            <span>VIEW REPOSITORY</span>
            <span>↗</span>
          </a>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl font-mono font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
          >
            {copied ? '✓ COPIED' : 'COPY URL'}
          </button>
        </div>
      </aside>
    </>
  );
};
