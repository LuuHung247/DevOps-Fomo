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

  const handleShareX = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stars = formatNumber(repo.stars);
    const label = repo.velocityLabel === 'EXPLOSIVE' ? '🔥 VIRAL BREAKOUT' : repo.velocityLabel === 'HOT RISING' ? '📈 HOT RISING' : repo.velocityLabel === 'EARLY GEM' ? '🌱 EARLY GEM' : repo.velocityLabel === 'COMMUNITY PICK' ? '💬 COMMUNITY PICK' : '⭐ ESTABLISHED';
    const tweet = `${label}: ${repo.fullName} (${stars}★)\n\n"${repo.description?.slice(0, 100)}..."\n\nSpotted on TechFOMO.dev 👇\nhttps://dev-ops-fomo.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank', 'noopener');
  };

  // Build social signal hints
  const socialHints: string[] = [];
  if (repo.growthDeltaText) {
    socialHints.push(repo.growthDeltaText);
  }
  if (repo.socialSignals?.githubTrending === 'daily') {
    socialHints.push('Trending on GitHub today');
  } else if (repo.socialSignals?.githubTrending === 'weekly') {
    socialHints.push('Trending on GitHub this week');
  }
  if (repo.socialSignals?.hnTopScore && repo.socialSignals.hnTopScore > 30) {
    socialHints.push(`${repo.socialSignals.hnTopScore} pts on Hacker News`);
  }
  if (repo.socialSignals?.devtoMentions && repo.socialSignals.devtoMentions > 0) {
    socialHints.push('Featured on Dev.to');
  }

  // Frame card class based on velocity and big updates
  const getCardFrameClass = () => {
    if (repo.velocityLabel === 'EXPLOSIVE') {
      return 'fomo-flame-card border border-red-500/70';
    }
    if (repo.velocityLabel === 'ESTABLISHED') {
      if (repo.hasBigUpdate) {
        return 'fomo-classic-card border border-emerald-500/50 shadow-emerald-950/40';
      }
      return 'fomo-classic-card';
    }
    if (repo.hasBigUpdate) {
      return 'fomo-update-card border border-emerald-500/60';
    }
    if (repo.velocityLabel === 'HOT RISING') {
      return 'fomo-rising-card';
    }
    if (repo.velocityLabel === 'EARLY GEM') {
      return 'border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/60';
    }
    if (repo.velocityLabel === 'COMMUNITY PICK') {
      return 'fomo-community-card';
    }
    return 'bg-slate-900/90 border border-slate-800 hover:border-slate-700';
  };

  // Tag styling based on velocity
  const getTagClass = (label?: RepoItem['velocityLabel']) => {
    switch (label) {
      case 'EXPLOSIVE':
        return 'fomo-flame-tag px-2 py-0.5 text-[10px] tracking-wide';
      case 'HOT RISING':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/50 px-1.5 py-0.2 text-[10px] font-bold';
      case 'EARLY GEM':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.2 text-[10px] font-bold';
      case 'COMMUNITY PICK':
        return 'bg-violet-500/20 text-violet-300 border border-violet-500/50 px-1.5 py-0.2 text-[10px] font-bold';
      case 'ESTABLISHED':
        return 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 text-[10px] font-bold';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 text-[10px] font-bold';
    }
  };

  const isExplosive = repo.velocityLabel === 'EXPLOSIVE';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 shadow-md font-sans ${getCardFrameClass()}`}>
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
        
        {/* Left: Name, Owner & Badges */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className={`font-bold transition-colors text-base sm:text-lg font-mono break-words leading-tight inline-block ${
                isExplosive ? 'text-white hover:text-red-400' : 'text-white hover:text-emerald-400'
              }`}
              title="Click to open GitHub repository"
            >
              {repo.fullName}
            </a>
          </div>

          <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1 font-mono text-[11px] text-slate-400">
            <span>by <strong className="text-slate-300 font-medium">{repo.owner}</strong></span>
            
            {repo.isVerified && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                VERIFIED
              </span>
            )}
            
            {repo.velocityLabel && (
              <span className={`rounded ${getTagClass(repo.velocityLabel)}`}>
                [{repo.velocityLabel === 'EXPLOSIVE' ? 'VIRAL BREAKOUT' : repo.velocityLabel === 'EARLY GEM' ? '🌱 EARLY GEM' : repo.velocityLabel}]
              </span>
            )}

            {repo.hasBigUpdate && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-bold animate-pulse">
                [⚡ BIG UPDATE]
              </span>
            )}
          </div>
        </div>

        {/* Right: Metrics & Copy Link Button */}
        <div className="flex items-center justify-between sm:justify-end space-x-2.5 flex-shrink-0 font-mono text-xs pt-1 sm:pt-0">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <span className={isExplosive ? 'text-amber-300 font-extrabold' : 'text-amber-300 font-bold'}>
              {formatNumber(repo.stars)} stars
            </span>
            <span className="text-slate-600">•</span>
            <span>{formatNumber(repo.forks)} forks</span>
          </div>

          <button
            onClick={handleShareX}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap border bg-slate-950 hover:bg-[#1a8cd8]/20 text-slate-400 hover:text-[#1a8cd8] border-slate-800 hover:border-[#1a8cd8]/50"
            title="Share on X (Twitter)"
          >
            𝕏 Share
          </button>

          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap border ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
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

      {/* Social Signal & Growth Hints */}
      {socialHints.length > 0 && (
        <div className="mb-3 font-mono text-[11px] flex flex-wrap gap-x-3 gap-y-1">
          {socialHints.map((hint, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                isExplosive
                  ? 'bg-red-950/40 text-amber-300 border-red-500/30'
                  : repo.hasBigUpdate
                  ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-950 text-slate-300 border-slate-800'
              }`}
            >
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
