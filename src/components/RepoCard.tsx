'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';

interface RepoCardProps {
  repo: RepoItem;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(repo.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Build social signal hints
  const socialHints: string[] = [];
  if (repo.socialSignals?.githubTrending === 'daily') {
    socialHints.push('Trending on GitHub today');
  } else if (repo.socialSignals?.githubTrending === 'weekly') {
    socialHints.push('Trending on GitHub this week');
  }
  if (repo.socialSignals?.hnTopScore && repo.socialSignals.hnTopScore > 30) {
    socialHints.push(`${repo.socialSignals.hnTopScore} pts on Hacker News`);
  }
  if (repo.socialSignals?.devtoMentions && repo.socialSignals.devtoMentions > 0) {
    socialHints.push(`Featured on Dev.to`);
  }
  if (repo.socialSignals?.awesomeLists && repo.socialSignals.awesomeLists.length > 0) {
    socialHints.push(`In ${repo.socialSignals.awesomeLists.length} curated list${repo.socialSignals.awesomeLists.length > 1 ? 's' : ''}`);
  }

  // Velocity label color mapping
  const labelColors: Record<string, string> = {
    'EXPLOSIVE': 'bg-red-500/15 text-red-400 border-red-500/30',
    'HOT RISING': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    'COMMUNITY PICK': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    'CLASSIC': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    'TOP RATED': 'bg-slate-700/40 text-amber-300 border-amber-500/30',
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-md shadow-black/40 font-sans">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
        
        {/* Left: Name, Owner & Status Badges */}
        <div className="min-w-0 flex-1">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-white hover:text-emerald-400 transition-colors text-base sm:text-lg font-mono break-words leading-tight inline-block"
            title="Click to open GitHub repository"
          >
            {repo.fullName}
          </a>

          <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1 font-mono text-[11px] text-slate-400">
            <span>by <strong className="text-slate-300 font-medium">{repo.owner}</strong></span>
            {repo.isVerified && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                VERIFIED
              </span>
            )}
            {repo.velocityLabel && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] border font-bold ${labelColors[repo.velocityLabel] || labelColors['TOP RATED']}`}>
                [{repo.velocityLabel}]
              </span>
            )}
          </div>
        </div>

        {/* Right: Metrics & Copy Link Button */}
        <div className="flex items-center justify-between sm:justify-end space-x-2.5 flex-shrink-0 font-mono text-xs pt-1 sm:pt-0">
          <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <span className="text-amber-300 font-bold">{formatNumber(repo.stars)} stars</span>
            <span className="text-slate-600">•</span>
            <span>{formatNumber(repo.forks)} forks</span>
          </div>

          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap border ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Copy repository link"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed font-normal">
        {repo.description}
      </p>

      {/* Social Signal Hints (subtle) */}
      {socialHints.length > 0 && (
        <div className="mb-3 font-mono text-[10px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
          {socialHints.map((hint, i) => (
            <span key={i} className="text-slate-400">
              {hint}
            </span>
          ))}
        </div>
      )}

      {/* Topics Pills */}
      <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
        {repo.topics.slice(0, 5).map((topic) => (
          <span
            key={topic}
            className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
          >
            #{topic}
          </span>
        ))}
        {repo.topics.length > 5 && (
          <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
            +{repo.topics.length - 5}
          </span>
        )}
      </div>

    </div>
  );
};
