'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RepoItem, CategoryId, ReposApiResponse } from '@/lib/types';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryNav } from '@/components/CategoryNav';
import { FilterBar } from '@/components/FilterBar';
import { RepoCard } from '@/components/RepoCard';
import { ExportModal } from '@/components/ExportModal';

export default function Home() {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ReposApiResponse['stats']>({
    totalRepos: 0,
    totalStars: 0,
    trendingCount: 0,
    categoryCounts: {
      trending: 0,
      'agentic-ai': 0,
      'devops-infra': 0,
      mlops: 0,
      architecture: 0,
      'hall-of-fame': 0,
    },
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minStars, setMinStars] = useState(0);
  const [sortBy, setSortBy] = useState<'stars' | 'velocity' | 'updated'>('stars');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Fetch repositories from API
  const fetchRepos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (minStars > 0) {
        params.append('minStars', minStars.toString());
      }
      params.append('sortBy', sortBy);
      if (isRefresh) {
        params.append('refresh', 'true');
      }

      const res = await fetch(`/api/repos?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: ReposApiResponse = await res.json();
      setRepos(data.repos);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory, searchQuery, minStars, sortBy]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <Header
        totalRepos={stats.totalRepos}
        totalStars={stats.totalStars}
        trendingCount={stats.trendingCount}
        isRefreshing={refreshing}
        onRefresh={() => fetchRepos(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={repos.length}
          totalCount={stats.totalRepos}
        />

        {/* Category Navigation Tabs */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={stats.categoryCounts}
          totalCount={stats.totalRepos}
        />

        {/* Filter Controls Bar */}
        <FilterBar
          minStars={minStars}
          onMinStarsChange={setMinStars}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Repositories Single Clean Feed List */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse">
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-5 bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-800 rounded w-16" />
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-1/4 mb-4" />
                  <div className="space-y-2 mb-6">
                    <div className="h-3.5 bg-slate-800 rounded w-full" />
                    <div className="h-3.5 bg-slate-800 rounded w-4/5" />
                  </div>
                  <div className="h-8 bg-slate-800 rounded w-full mt-auto" />
                </div>
              ))}
            </div>
          )}

          {/* Repositories Feed */}
          {!loading && repos.length > 0 && (
            <div className="space-y-4">
              {repos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && repos.length === 0 && (
            <div className="rounded-2xl p-12 text-center my-12 bg-slate-900 border border-slate-800 font-mono">
              <h3 className="text-base font-bold text-white mb-2">NO REPOSITORIES FOUND</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                No repositories matched your active search or star filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMinStars(0);
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">DevOps-FOMO</span>
            <span> • Verified AI & DevOps Hub</span>
          </div>
          <p className="text-slate-400">
            Powered by Next.js and GitHub Open Data.
          </p>
        </div>
      </footer>

      {/* Export Catalog Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        repos={repos}
      />
    </div>
  );
}
