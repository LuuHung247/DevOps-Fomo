'use client';

import React from 'react';
import { CategoryId } from '@/lib/types';
import { Flame, Bot, Server, Brain, Compass, Trophy, Layers } from 'lucide-react';

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
  activeColor: string;
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
      name: 'All Ecosystem',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      activeColor: 'border-emerald-500/50 shadow-emerald-500/10 text-emerald-300',
    },
    {
      id: 'trending',
      name: 'Trending & Rising',
      icon: <Flame className="w-4 h-4 text-orange-400 animate-pulse" />,
      activeColor: 'border-orange-500/50 shadow-orange-500/10 text-orange-300',
    },
    {
      id: 'agentic-ai',
      name: 'Agentic AI & LLMs',
      icon: <Bot className="w-4 h-4 text-cyan-400" />,
      activeColor: 'border-cyan-500/50 shadow-cyan-500/10 text-cyan-300',
    },
    {
      id: 'devops-infra',
      name: 'DevOps & Cloud-Native',
      icon: <Server className="w-4 h-4 text-emerald-400" />,
      activeColor: 'border-emerald-500/50 shadow-emerald-500/10 text-emerald-300',
    },
    {
      id: 'mlops',
      name: 'MLOps & LLMOps',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      activeColor: 'border-purple-500/50 shadow-purple-500/10 text-purple-300',
    },
    {
      id: 'architecture',
      name: 'Architecture & Design',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      activeColor: 'border-blue-500/50 shadow-blue-500/10 text-blue-300',
    },
    {
      id: 'hall-of-fame',
      name: 'Hall of Fame (30k+⭐)',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      activeColor: 'border-amber-500/50 shadow-amber-500/10 text-amber-300',
    },
  ];

  const getCount = (id: CategoryId | 'all') => {
    if (id === 'all') return totalCount;
    return categoryCounts[id] || 0;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-800/80">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          const count = getCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? `bg-slate-900 border ${tab.activeColor} shadow-lg text-white`
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-slate-900/80 text-slate-400'
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
