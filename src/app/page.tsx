'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RepoItem, CategoryId, ReposApiResponse } from '@/lib/types';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryNav } from '@/components/CategoryNav';
import { FilterBar } from '@/components/FilterBar';
import { RepoCard } from '@/components/RepoCard';
import { AiInsightModal } from '@/components/AiInsightModal';
import { ExportModal } from '@/components/ExportModal';
import { Flame, Sparkles, Server, Brain, Bot, Compass, Trophy, AlertCircle, BookmarkCheck, Download, Layers } from 'lucide-react';

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
  const [selectedRepoForAi, setSelectedRepoForAi] = useState<RepoItem | null>(null);
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
    <div className="min-h-screen flex flex-col justify-between">
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
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between shadow-lg shadow-amber-500/5">
              <div className="flex items-center space-x-2 text-amber-300 text-sm font-semibold">
                <BookmarkCheck className="w-5 h-5 text-amber-400" />
                <span>Viewing Saved Bookmarks ({favorites.length} items)</span>
              </div>
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="text-xs text-slate-400 hover:text-white underline font-mono"
              >
                Show All Ecosystem
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="hud-card rounded-2xl p-6 h-64 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-800/80" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-5/6" />
                  </div>
                  <div className="h-9 bg-slate-800 rounded-xl w-full mt-auto" />
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
                  onOpenAiInsight={setSelectedRepoForAi}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && displayedRepos.length === 0 && (
            <div className="hud-panel rounded-2xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-800 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Repositories Found</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {showFavoritesOnly
                  ? "You haven't bookmarked any repositories yet. Click the bookmark icon on any card to save it!"
                  : "No repositories matched your active search or filters. Try adjusting your query or star threshold."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMinStars(0);
                  setLanguage('');
                  setActiveCategory('all');
                  setShowFavoritesOnly(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-bold text-slate-200">DevOps-FOMO</span>
            <span>• Verified AI & DevOps Intelligence Radar</span>
          </div>
          <p className="text-slate-400">
            Powered by Next.js, GitHub Open Data, and Generative AI Insights.
          </p>
        </div>
      </footer>

      {/* AI Deep Dive Modal */}
      <AiInsightModal
        repo={selectedRepoForAi}
        onClose={() => setSelectedRepoForAi(null)}
      />

      {/* Export Catalog Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        repos={displayedRepos}
      />
    </div>
  );
}
