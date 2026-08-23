'use client';

import React, { useState, useEffect } from 'react';
import { BuzzItem, BuzzSource } from '@/lib/types';

interface BuzzFeedProps {
  items: BuzzItem[];
  loading: boolean;
}

const SOURCE_CONFIG: Record<BuzzSource, { label: string; color: string; bg: string; border: string }> = {
  hn: {
    label: 'Hacker News',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  reddit: {
    label: 'Reddit',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  devto: {
    label: 'Dev.to',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
};

const SOURCE_ICON: Record<BuzzSource, string> = {
  hn: 'Y',
  reddit: '⬆',
  devto: '✍',
};

function safeUrl(url: string): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch {
    // If not a valid absolute URL, check if safe relative path
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
  }
  return '#';
}

function BuzzCard({ item }: { item: BuzzItem }) {
  const cfg = SOURCE_CONFIG[item.source];
  const icon = SOURCE_ICON[item.source];
  const href = safeUrl(item.url);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group block p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 transition-all duration-200 hover:bg-slate-900"
    >
      <div className="flex items-start gap-3">
        {/* Source Badge */}
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold font-mono ${cfg.bg} ${cfg.color} border ${cfg.border}`}
        >
          {icon}
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100 group-hover:text-white leading-snug mb-1.5 line-clamp-2">
            {item.title}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500">
            {/* Source & subreddit */}
            <span className={`font-semibold ${cfg.color}`}>
              {item.source === 'reddit' && item.subreddit
                ? `r/${item.subreddit}`
                : cfg.label}
            </span>

            {/* Domain */}
            {item.domain && item.source !== 'reddit' && (
              <span className="text-slate-600">{item.domain}</span>
            )}

            {/* Score */}
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              ▲ {item.score.toLocaleString()}
            </span>

            {/* Comments */}
            {item.commentCount > 0 && (
              <span className="text-slate-500">
                💬 {item.commentCount}
              </span>
            )}

            {/* Time */}
            <span>{item.createdAt}</span>
          </div>

          {/* Dev.to tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.tags.slice(0, 4).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-500 border border-slate-800">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

const FILTER_SOURCES: { id: BuzzSource | 'all'; label: string }[] = [
  { id: 'all', label: 'All Sources' },
  { id: 'hn', label: '🟠 Hacker News' },
  { id: 'reddit', label: '🔴 Reddit' },
  { id: 'devto', label: '🟣 Dev.to' },
];

export const BuzzFeed: React.FC<BuzzFeedProps> = ({ items, loading }) => {
  const [activeSource, setActiveSource] = useState<BuzzSource | 'all'>('all');

  const filtered = activeSource === 'all'
    ? items
    : items.filter(i => i.source === activeSource);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 animate-pulse">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-4/5" />
                <div className="h-3 bg-slate-800 rounded w-2/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl p-12 text-center bg-slate-900 border border-slate-800 font-mono">
          <p className="text-slate-400 text-sm">No buzz fetched yet. Community feed will load shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Source Filter Pills */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 flex-wrap">
        {FILTER_SOURCES.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveSource(f.id as BuzzSource | 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap border transition-all ${
              activeSource === f.id
                ? 'bg-slate-800 text-white border-slate-600'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-[10px] ${activeSource === f.id ? 'text-emerald-400' : 'text-slate-600'}`}>
              {f.id === 'all' ? items.length : items.filter(i => i.source === f.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-2">
        {filtered.map(item => (
          <BuzzCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-500 font-mono text-sm">
          No posts from this source right now.
        </div>
      )}
    </div>
  );
};
