'use client';

import React from 'react';
import { CategoryId } from '@/lib/types';

interface CategoryNavProps {
  activeCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  categoryCounts: Record<CategoryId, number>;
  totalCount: number;
}

interface TabDef {
  id: CategoryId | 'all';
  name: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  const tabs: TabDef[] = [
    { id: 'all', name: 'All Ecosystem' },
    { id: 'trending', name: 'Trending & Rising' },
    { id: 'agentic-ai', name: 'Agentic AI & LLMs' },
    { id: 'devops-infra', name: 'DevOps & Cloud-Native' },
    { id: 'mlops', name: 'MLOps & LLMOps' },
    { id: 'architecture', name: 'Architecture & Design' },
    { id: 'hall-of-fame', name: 'Hall of Fame (30k+ Stars)' },
  ];

  const getCount = (id: CategoryId | 'all') => {
    if (id === 'all') return totalCount;
    return categoryCounts[id] || 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-2 mb-4 font-mono">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = getCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
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
