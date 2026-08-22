'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface RepoCardProps {
  repo: RepoItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  viewMode?: 'grid' | 'compact';
}

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  isFavorite,
  onToggleFavorite,
  viewMode = 'grid',
}) => {
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleCopyMarkdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const md = `[${repo.fullName}](${repo.url}) - ${repo.description}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const starHistoryUrl = `https://star-history.com/#${repo.fullName}&Date`;

  if (viewMode === 'compact') {
    return (
      <div className={`p-4 rounded-xl bg-slate-900 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans ${isFavorite ? 'border-amber-500/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'}`}>
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white hover:text-emerald-400 transition-colors text-sm truncate font-mono"
              >
                {repo.fullName}
              </a>
              {repo.isVerified && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              )}
              {repo.velocityLabel && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                  {repo.velocityLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xl mt-1">
              {repo.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0 text-xs font-mono">
          <div className="text-amber-400 font-bold">
            Stars: {formatNumber(repo.stars)}
          </div>

          {repo.language && (
            <div className="hidden md:block text-slate-400">
              Lang: {repo.language}
            </div>
          )}

          <button
            onClick={() => onToggleFavorite(repo.id)}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {isFavorite ? 'Saved' : 'Save'}
          </button>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono"
          >
            GitHub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between h-full font-sans ${isFavorite ? 'border-amber-500/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'}`}>
      
      {/* Top Bar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white hover:text-emerald-400 transition-colors text-base truncate block font-mono"
              >
                {repo.name}
              </a>
              {repo.isVerified && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono truncate block mt-0.5">by {repo.owner}</span>
          </div>

          <button
            onClick={() => onToggleFavorite(repo.id)}
            className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                : 'bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Velocity Pill */}
        {repo.velocityLabel && (
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-amber-300 border border-amber-500/30 mb-3">
            <span>[{repo.velocityLabel}]</span>
            <span className="text-slate-400 font-normal">({repo.velocityScore}% score)</span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed font-normal">
          {repo.description}
        </p>

        {/* Topic Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5 font-mono">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
            >
              #{topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 font-mono">
        
        {/* Metrics Row */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="text-amber-400 font-bold">Stars: {formatNumber(repo.stars)}</span>
            <span>Forks: {formatNumber(repo.forks)}</span>
          </div>

          {repo.language && (
            <span className="text-slate-300">Lang: {repo.language}</span>
          )}
        </div>

        {/* Action Links Row */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <button
            onClick={handleCopyMarkdown}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-center"
          >
            {copied ? 'Copied MD' : 'Copy MD'}
          </button>

          <a
            href={starHistoryUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors text-center"
          >
            History
          </a>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition-colors text-center"
          >
            GitHub
          </a>
        </div>

      </div>

    </div>
  );
};
