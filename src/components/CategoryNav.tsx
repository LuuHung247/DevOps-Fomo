'use client';

import React from 'react';
import { CategoryId } from '@/lib/types';

interface CategoryNavProps {
  activeCategory: CategoryId | 'all' | 'buzz';
  onSelectCategory: (cat: CategoryId | 'all' | 'buzz') => void;
  categoryCounts: Record<CategoryId, number>;
  totalCount: number;
}

interface TabDef {
  id: CategoryId | 'all' | 'buzz';
  name: string;
  isBuzz?: boolean;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  const tabs: TabDef[] = [
    { id: 'trending', name: '🔥 Trending & Rising' },
    { id: 'all', name: 'All Ecosystem' },
    { id: 'agentic-ai', name: 'Agentic AI & LLMs' },
    { id: 'devops-infra', name: 'DevOps & Cloud-Native' },
    { id: 'mlops', name: 'MLOps & LLMOps' },
    { id: 'architecture', name: 'Architecture & Design' },
    { id: 'buzz', name: '📰 Community Buzz', isBuzz: true },
  ];

  const getCount = (id: CategoryId | 'all' | 'buzz') => {
    if (id === 'all') return totalCount;
    if (id === 'buzz') return 0;
    return categoryCounts[id as CategoryId] || 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-2 mb-4 font-mono">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = getCount(tab.id);
          const isBuzz = tab.isBuzz;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isActive
                  ? isBuzz
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : isBuzz
                    ? 'bg-slate-900/60 text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-slate-800/80'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
              }`}
            >
              <span>{tab.name}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
