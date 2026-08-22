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
      favorites: 0,
    },
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minStars, setMinStars] = useState(0);
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'velocity' | 'updated'>('stars');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals & Bookmarks
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('devops_fomo_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage:', e);
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('devops_fomo_favorites', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to write to localStorage:', e);
      }
      return next;
    });
  };

  // Fetch repositories from API
  const fetchRepos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all' && activeCategory !== 'favorites') {
        params.append('category', activeCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (minStars > 0) {
        params.append('minStars', minStars.toString());
      }
      if (language) {
        params.append('language', language);
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
  }, [activeCategory, searchQuery, minStars, language, sortBy]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Display list (handling client-side favorites filter if enabled)
  const displayedRepos = showFavoritesOnly
    ? repos.filter((r) => favorites.includes(r.id))
    : repos;

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      {/* Top Navbar */}
      <Header
        totalRepos={stats.totalRepos}
        totalStars={stats.totalStars}
        trendingCount={stats.trendingCount}
        favoritesCount={favorites.length}
        isRefreshing={refreshing}
        onRefresh={() => fetchRepos(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={displayedRepos.length}
          totalCount={stats.totalRepos}
        />

        {/* Category Navigation Tabs */}
        {!showFavoritesOnly && (
          <CategoryNav
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setShowFavoritesOnly(false);
            }}
            categoryCounts={stats.categoryCounts}
            totalCount={stats.totalRepos}
          />
        )}

        {/* Filter Controls Bar */}
        <FilterBar
          minStars={minStars}
          onMinStarsChange={setMinStars}
          language={language}
          onLanguageChange={setLanguage}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Main Repositories Grid / List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Favorites Alert Banner if viewing saved */}
          {showFavoritesOnly && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between font-mono">
              <div className="text-amber-300 text-sm font-semibold">
                [SAVED BOOKMARKS] ({favorites.length} items)
              </div>
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Show All
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl p-6 h-56 bg-slate-900 border border-slate-800 animate-pulse">
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-slate-800 rounded w-1/2" />
                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-4/5" />
                  </div>
                  <div className="h-8 bg-slate-800 rounded w-full mt-auto" />
                </div>
              ))}
            </div>
          )}

          {/* Repositories Cards */}
          {!loading && displayedRepos.length > 0 && (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col space-y-3'
              }
            >
              {displayedRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isFavorite={favorites.includes(repo.id)}
                  onToggleFavorite={handleToggleFavorite}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && displayedRepos.length === 0 && (
            <div className="rounded-2xl p-12 text-center max-w-lg mx-auto my-12 bg-slate-900 border border-slate-800 font-mono">
              <h3 className="text-base font-bold text-white mb-2">NO REPOSITORIES FOUND</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {showFavoritesOnly
                  ? "No repositories in your saved bookmarks list."
                  : "No repositories matched your active search or filter criteria."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMinStars(0);
                  setLanguage('');
                  setActiveCategory('all');
                  setShowFavoritesOnly(false);
                }}
                className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
        repos={displayedRepos}
      />
    </div>
  );
}
