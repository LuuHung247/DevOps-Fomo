'use client';

import React, { useState } from 'react';
import { RepoItem } from '@/lib/types';
import { Star, GitFork, AlertCircle, ExternalLink, Sparkles, Bookmark, Copy, Check, TrendingUp, ShieldCheck } from 'lucide-react';

interface RepoCardProps {
  repo: RepoItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenAiInsight: (repo: RepoItem) => void;
  viewMode?: 'grid' | 'compact';
}

const LANGUAGE_COLORS: Record<string, string> = {
  python: 'bg-blue-500',
  go: 'bg-cyan-500',
  rust: 'bg-orange-600',
  typescript: 'bg-blue-600',
  javascript: 'bg-yellow-400',
  shell: 'bg-green-500',
  c: 'bg-slate-400',
  'c++': 'bg-pink-500',
  default: 'bg-emerald-400',
};

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  isFavorite,
  onToggleFavorite,
  onOpenAiInsight,
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

  const langKey = (repo.language || '').toLowerCase();
  const langColor = LANGUAGE_COLORS[langKey] || LANGUAGE_COLORS.default;

  const starHistoryUrl = `https://star-history.com/#${repo.fullName}&Date`;

  if (viewMode === 'compact') {
    return (
      <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={repo.ownerAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
            alt={repo.owner}
            className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-800 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white hover:text-brand-400 transition-colors text-sm truncate"
              >
                {repo.fullName}
              </a>
              {repo.isVerified && (
                <span title="Community Verified">
                  <ShieldCheck className="w-4 h-4 text-brand-400 flex-shrink-0" />
                </span>
              )}
              {repo.velocityLabel && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/20">
                  {repo.velocityLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xl mt-0.5">
              {repo.description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{formatNumber(repo.stars)}</span>
          </div>

          {repo.language && (
            <div className="hidden sm:flex items-center space-x-1 text-slate-400">
              <span className={`w-2 h-2 rounded-full ${langColor}`} />
              <span>{repo.language}</span>
            </div>
          )}

          <button
            onClick={() => onOpenAiInsight(repo)}
            className="px-2.5 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center space-x-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>AI Review</span>
          </button>

          <button
            onClick={() => onToggleFavorite(repo.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full group relative overflow-hidden">
      
      {/* Top Bar: Owner & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={repo.ownerAvatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
              alt={repo.owner}
              className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white hover:text-brand-400 transition-colors text-base truncate block"
                  title={repo.fullName}
                >
                  {repo.name}
                </a>
                {repo.isVerified && (
                  <span title="Community Verified Core Repo">
                    <ShieldCheck className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 truncate block">by {repo.owner}</span>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleFavorite(repo.id)}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save repo'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Velocity Pill */}
        {repo.velocityLabel && (
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/90 text-amber-300 border border-amber-500/30 mb-3 shadow-sm shadow-amber-500/5">
            <span>{repo.velocityLabel}</span>
            <span className="text-[10px] text-slate-400 font-mono">({repo.velocityScore}% vitality)</span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed font-normal">
          {repo.description}
        </p>

        {/* AI Tagline Highlight if present */}
        {repo.aiSummary?.tagline && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-4 flex items-start space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
            <p className="italic text-[11px] text-slate-300 line-clamp-2">
              "{repo.aiSummary.tagline}"
            </p>
          </div>
        )}

        {/* Topic Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 font-mono"
            >
              #{topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
              +{repo.topics.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Stats & Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
        
        {/* Numbers Row */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{formatNumber(repo.stars)}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <GitFork className="w-3.5 h-3.5" />
              <span>{formatNumber(repo.forks)}</span>
            </div>
          </div>

          {repo.language && (
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${langColor}`} />
              <span className="text-slate-300 font-sans">{repo.language}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          
          {/* AI Deep Dive Button */}
          <button
            onClick={() => onOpenAiInsight(repo)}
            className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-brand-500/10 to-teal-500/10 hover:from-brand-500/20 hover:to-teal-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-sm shadow-brand-500/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Review</span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Copy as Markdown link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Star History Link */}
          <a
            href={starHistoryUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 transition-colors"
            title="View Star History Chart"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </a>

          {/* Direct GitHub Link */}
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Open in GitHub"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
