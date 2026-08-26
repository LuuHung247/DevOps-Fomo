'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RepoItem, CategoryId, ReposApiResponse, BuzzItem, BuzzApiResponse } from '@/lib/types';
import { Header } from '@/components/Header';
import { SplashIntro } from '@/components/SplashIntro';
import { TechFomoCanvas } from '@/components/canvas/TechFomoCanvas';
import { SearchBar } from '@/components/SearchBar';
import { CategoryNav } from '@/components/CategoryNav';
import { FilterBar } from '@/components/FilterBar';
import { RepoCard } from '@/components/RepoCard';
import { Pagination } from '@/components/Pagination';
import { BuzzFeed } from '@/components/BuzzFeed';

export default function Home() {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [buzzItems, setBuzzItems] = useState<BuzzItem[]>([]);
  const [buzzLoading, setBuzzLoading] = useState(false);
  const [buzzFetched, setBuzzFetched] = useState(false);

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
    },
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all' | 'buzz'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'velocity' | 'updated'>('velocity');
  const retryCountRef = useRef(0);

  // Fetch repositories with retry resilience
  const fetchRepos = useCallback(async (isBackground = false) => {
    if (!isBackground && repos.length === 0) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all' && activeCategory !== 'buzz') {
        params.append('category', activeCategory);
      }
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('sortBy', sortBy);

      const res = await fetch(`/api/repos?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: ReposApiResponse = await res.json();
      if (data && Array.isArray(data.repos)) {
        setRepos(data.repos);
        if (data.stats) {
          setStats(data.stats);
        }
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      if (retryCountRef.current < 2 && repos.length === 0) {
        retryCountRef.current += 1;
        setTimeout(() => fetchRepos(isBackground), 1000);
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [activeCategory, searchQuery, sortBy, repos.length]);

  // Fetch buzz on first visit to that tab
  const fetchBuzz = useCallback(async () => {
    if (buzzFetched) return;
    setBuzzLoading(true);
    try {
      const res = await fetch('/api/buzz');
      if (!res.ok) throw new Error('Buzz fetch failed');
      const data: BuzzApiResponse = await res.json();
      setBuzzItems(data.items);
      setBuzzFetched(true);
    } catch (err) {
      console.error('Buzz fetch error:', err);
    } finally {
      setBuzzLoading(false);
    }
  }, [buzzFetched]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  // Trigger buzz fetch when buzz tab selected
  useEffect(() => {
    if (activeCategory === 'buzz') {
      fetchBuzz();
    }
  }, [activeCategory, fetchBuzz]);

  useEffect(() => {
    if (activeCategory !== 'buzz') {
      fetchRepos();
    }
  }, [fetchRepos, activeCategory]);

  // Silent background sync every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeCategory !== 'buzz') fetchRepos(true);
    }, 120000);
    return () => clearInterval(interval);
  }, [fetchRepos, activeCategory]);

  // Pagination
  const totalPages = Math.ceil(repos.length / itemsPerPage) || 1;
  const paginatedRepos = repos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isBuzzMode = activeCategory === 'buzz';

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#030712] font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. CINEMATIC SPLASH INTRO (Runs once on first visit) */}
      <SplashIntro />

      {/* 2. UNIFIED STICKY HEADER */}
      <Header totalRepos={stats.totalRepos} totalStars={stats.totalStars} />

      {/* 3. FULLPAGE SNAP CONTAINER (Unified background, 1 frame switch) */}
      <main className="flex-1 w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#030712]">
        
        {/* FRAME 1: TOP BREAKOUTS SPATIAL STAGE (Fits 1 Full Frame) */}
        {!searchQuery && !isBuzzMode && (
          <section className="h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col justify-center items-center overflow-hidden bg-[#030712]">
            <TechFomoCanvas repos={repos} />
          </section>
        )}

        {/* FRAME 2: DIRECTORY / ALL REPOSITORIES SUMMARY (Scroll switches into this frame) */}
        <section id="main-feed" className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col justify-between pt-6 pb-12 bg-[#030712]">
          
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex-1">
            
            {/* SEARCH BAR */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filteredCount={repos.length}
              totalCount={stats.totalRepos}
            />

            {/* CATEGORY TABS */}
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              categoryCounts={stats.categoryCounts}
              totalCount={stats.totalRepos}
            />

            {/* BUZZ MODE OR REPOSITORY FEED */}
            {isBuzzMode ? (
              <>
                <div className="max-w-4xl mx-auto mb-5 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-semibold text-[11px]">
                      📰 COMMUNITY BUZZ — HN · REDDIT · DEV.TO
                    </span>
                    <span className="text-slate-500 text-[10px] hidden sm:inline">
                      Refreshes every 15 min
                    </span>
                  </div>
                </div>
                <BuzzFeed items={buzzItems} loading={buzzLoading} />
              </>
            ) : (
              <>
                {/* Filter Bar */}
                <FilterBar sortBy={sortBy} onSortByChange={setSortBy} />

                {/* Repository Feed */}
                <div id="repository-feed" className="space-y-4">

                  {/* Loading Skeleton */}
                  {loading && repos.length === 0 && (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm animate-pulse">
                          <div className="flex justify-between items-center mb-3">
                            <div className="h-5 bg-slate-800 rounded w-1/3" />
                            <div className="h-4 bg-slate-800 rounded w-24" />
                          </div>
                          <div className="h-3 bg-slate-800 rounded w-1/4 mb-3" />
                          <div className="space-y-2 mb-4">
                            <div className="h-3.5 bg-slate-800 rounded w-full" />
                            <div className="h-3.5 bg-slate-800 rounded w-4/5" />
                          </div>
                          <div className="h-5 bg-slate-800 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Repos Grid */}
                  {paginatedRepos.length > 0 && (
                    <div className="space-y-4">
                      {paginatedRepos.map((repo, idx) => (
                        <RepoCard key={repo.id} repo={repo} index={idx} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {repos.length > itemsPerPage && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={repos.length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  )}

                  {/* Empty State */}
                  {!loading && repos.length === 0 && (
                    <div className="rounded-2xl p-12 text-center my-12 bg-slate-900/90 border border-slate-800 font-mono shadow-xl">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        🔍
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">NO REPOSITORIES FOUND</h3>
                      <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
                        No repositories matched your active search or filter criteria.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('trending');
                          setSortBy('velocity');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          <footer className="border-t border-slate-800/80 bg-[#030712] py-8 text-center text-xs text-slate-400 font-mono mt-12">
            <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-200">TechFOMO<span className="text-cyan-400">.dev</span></span>
                <span> • We track the hype so you don't have to</span>
              </div>
              <p className="text-slate-400">Powered by Next.js and Real-Time Multi-Source Intelligence.</p>
            </div>
          </footer>
        </section>

      </main>
    </div>
  );
}
