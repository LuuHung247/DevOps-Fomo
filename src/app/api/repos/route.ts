import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveRepositories } from '@/lib/github';
import { getCachedRepos, setCachedRepos } from '@/lib/cache';
import { RepoItem, CategoryId, ReposApiResponse } from '@/lib/types';
import { SEED_REPOSITORIES } from '@/lib/seeds';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'all') as CategoryId | 'all';
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const minStars = parseInt(searchParams.get('minStars') || '0', 10);
    const language = (searchParams.get('language') || '').trim().toLowerCase();
    const sortBy = searchParams.get('sortBy') || 'stars';
    const forceRefresh = searchParams.get('refresh') === 'true';

    let repos: RepoItem[] | null = null;
    let isCached = false;

    if (!forceRefresh) {
      repos = getCachedRepos('all');
      if (repos && repos.length > 0) {
        isCached = true;
      }
    }

    if (!repos || repos.length === 0) {
      try {
        repos = await fetchLiveRepositories();
        setCachedRepos('all', repos);
        isCached = false;
      } catch (err) {
        console.error('Failed to fetch live repos, falling back to seeds:', err);
        repos = SEED_REPOSITORIES;
      }
    }

    // Stats calculations over full pool
    const totalRepos = repos.length;
    const totalStars = repos.reduce((acc, r) => acc + r.stars, 0);
    
    const categoryCounts: Record<CategoryId, number> = {
      'trending': repos.filter(r => r.categories.includes('trending') || r.velocityLabel === '⚡ Explosive' || r.velocityLabel === '🔥 Hot Rising').length,
      'agentic-ai': repos.filter(r => r.categories.includes('agentic-ai')).length,
      'devops-infra': repos.filter(r => r.categories.includes('devops-infra')).length,
      'mlops': repos.filter(r => r.categories.includes('mlops')).length,
      'architecture': repos.filter(r => r.categories.includes('architecture')).length,
      'hall-of-fame': repos.filter(r => r.categories.includes('hall-of-fame') || r.stars >= 30000).length,
      'favorites': 0, // Client manages favorites
    };

    // Filter by category
    let filtered = repos;
    if (category !== 'all' && category !== 'favorites') {
      if (category === 'trending') {
        filtered = filtered.filter(r => r.categories.includes('trending') || r.velocityLabel === '⚡ Explosive' || r.velocityLabel === '🔥 Hot Rising');
      } else if (category === 'hall-of-fame') {
        filtered = filtered.filter(r => r.categories.includes('hall-of-fame') || r.stars >= 30000);
      } else {
        filtered = filtered.filter(r => r.categories.includes(category));
      }
    }

    // Filter by minStars
    if (minStars > 0) {
      filtered = filtered.filter(r => r.stars >= minStars);
    }

    // Filter by language
    if (language && language !== 'all') {
      filtered = filtered.filter(r => (r.language || '').toLowerCase() === language);
    }

    // Filter by search query
    if (search) {
      filtered = filtered.filter(r => 
        r.fullName.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search) ||
        r.topics.some(t => t.toLowerCase().includes(search)) ||
        (r.language && r.language.toLowerCase().includes(search)) ||
        (r.aiSummary?.tagline && r.aiSummary.tagline.toLowerCase().includes(search))
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'velocity') {
        return (b.velocityScore || 0) - (a.velocityScore || 0);
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return b.stars - a.stars;
    });

    const responseData: ReposApiResponse = {
      repos: filtered,
      total: filtered.length,
      cached: isCached,
      cacheTime: new Date().toISOString(),
      stats: {
        totalRepos,
        totalStars,
        trendingCount: categoryCounts.trending,
        categoryCounts,
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in /api/repos:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve repositories' },
      { status: 500 }
    );
  }
}
