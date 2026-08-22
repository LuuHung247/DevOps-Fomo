'use client';

import React from 'react';
import { CategoryId } from '@/lib/types';
import { Flame, Bot, Server, Brain, Compass, Trophy, Bookmark } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  categoryCounts: Record<CategoryId, number>;
  totalCount: number;
}

interface TabDef {
  id: CategoryId | 'all';
  name: string;
  icon: React.ReactNode;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  const tabs: TabDef[] = [
    {
      id: 'all',
      name: 'All Repos',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'trending',
      name: 'Trending & Rising',
      icon: <Flame className="w-4 h-4 text-orange-400 animate-pulse" />,
    },
    {
      id: 'agentic-ai',
      name: 'Agentic AI & LLMs',
      icon: <Bot className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'devops-infra',
      name: 'DevOps & Cloud-Native',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'mlops',
      name: 'MLOps & LLMOps',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'architecture',
      name: 'Architecture & Design',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'hall-of-fame',
      name: 'Hall of Fame (30k+⭐)',
      icon: <Trophy className="w-4 h-4 text-yellow-400" />,
    },
  ];

  const getCount = (id: CategoryId | 'all') => {
    if (id === 'all') return totalCount;
    return categoryCounts[id] || 0;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = getCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border border-brand-500/50 shadow-md shadow-brand-500/10'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-300 font-bold'
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
