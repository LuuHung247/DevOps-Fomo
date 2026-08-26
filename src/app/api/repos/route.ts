import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/discovery';
import { getCachedRepos, setCachedRepos } from '@/lib/cache';
import { RepoItem, CategoryId, ReposApiResponse } from '@/lib/types';
import { SEED_REPOSITORIES } from '@/lib/seeds';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60s Edge CDN revalidation

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawCategory = searchParams.get('category') || 'all';
    const VALID_CATEGORIES: (CategoryId | 'all')[] = ['all', 'trending', 'agentic-ai', 'devops-infra', 'mlops', 'architecture'];
    const category: CategoryId | 'all' = VALID_CATEGORIES.includes(rawCategory as any) ? (rawCategory as CategoryId | 'all') : 'all';

    const search = (searchParams.get('search') || '').trim().toLowerCase().slice(0, 100);
    
    const parsedMinStars = parseInt(searchParams.get('minStars') || '0', 10);
    const minStars = isNaN(parsedMinStars) || parsedMinStars < 0 ? 0 : Math.min(parsedMinStars, 5000000);
    
    const rawSortBy = searchParams.get('sortBy') || 'stars';
    const VALID_SORTS = ['stars', 'velocity', 'updated'];
    const sortBy = VALID_SORTS.includes(rawSortBy) ? rawSortBy : 'stars';

    let repos: RepoItem[] | null = null;
    let isCached = false;

    // 1. Try 5-minute Cache first
    repos = getCachedRepos('all', 1000 * 60 * 5);
    if (repos && repos.length > 0) {
      isCached = true;
    } else {
      // 2. Cache Miss or Expired: Fetch 100% Real-Time Data from Live Sources
      try {
        console.log('[API /api/repos] Fetching live multi-source repositories...');
        repos = await fetchAllSources();
        if (repos && repos.length > 0) {
          setCachedRepos('all', repos);
          isCached = false;
        }
      } catch (discoveryErr) {
        console.error('[API /api/repos] Error in live discovery, falling back to seeds:', discoveryErr);
        repos = SEED_REPOSITORIES;
      }
    }

    if (!repos || repos.length === 0) {
      repos = SEED_REPOSITORIES;
    }

    // 3. Stats calculations over full live pool
    const totalRepos = repos.length;
    const totalStars = repos.reduce((acc, r) => acc + (r.stars || 0), 0);
    
    const categoryCounts: Record<CategoryId, number> = {
      'trending': repos.filter(r => 
        r.categories.includes('trending') || 
        r.velocityLabel === 'EXPLOSIVE' || 
        r.velocityLabel === 'HOT RISING' || 
        r.velocityLabel === 'EARLY GEM' || 
        r.velocityLabel === 'COMMUNITY PICK' || 
        r.hasBigUpdate ||
        (r.velocityScore && r.velocityScore >= 80)
      ).length,
      'agentic-ai': repos.filter(r => r.categories.includes('agentic-ai') || r.category === 'agentic-ai').length,
      'devops-infra': repos.filter(r => r.categories.includes('devops-infra') || r.category === 'devops-infra').length,
      'mlops': repos.filter(r => r.categories.includes('mlops') || r.category === 'mlops').length,
      'architecture': repos.filter(r => r.categories.includes('architecture') || r.category === 'architecture').length,
    };

    // 4. Filter by category
    let filtered = repos;
    if (category !== 'all') {
      if (category === 'trending') {
        filtered = filtered.filter(r => 
          r.categories.includes('trending') || 
          r.velocityLabel === 'EXPLOSIVE' || 
          r.velocityLabel === 'HOT RISING' || 
          r.velocityLabel === 'EARLY GEM' || 
          r.velocityLabel === 'COMMUNITY PICK' || 
          r.hasBigUpdate ||
          (r.velocityScore && r.velocityScore >= 80)
        );
      } else {
        filtered = filtered.filter(r => r.categories.includes(category) || r.category === category);
      }
    }

    // 5. Filter by minStars
    if (minStars > 0) {
      filtered = filtered.filter(r => r.stars >= minStars);
    }

    // 6. Filter by search query
    if (search) {
      filtered = filtered.filter(r => 
        r.fullName.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search) ||
        r.topics.some(t => t.toLowerCase().includes(search))
      );
    }

    // 7. Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'velocity') {
        return (b.velocityScore || 0) - (a.velocityScore || 0);
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return (b.stars || 0) - (a.stars || 0);
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

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error in /api/repos:', error);
    const fallback = SEED_REPOSITORIES;
    return NextResponse.json({
      repos: fallback,
      total: fallback.length,
      cached: true,
      cacheTime: new Date().toISOString(),
      stats: {
        totalRepos: fallback.length,
        totalStars: fallback.reduce((a, b) => a + b.stars, 0),
        trendingCount: fallback.filter(r => r.categories.includes('trending')).length,
        categoryCounts: {
          trending: fallback.filter(r => r.categories.includes('trending')).length,
          'agentic-ai': fallback.filter(r => r.categories.includes('agentic-ai')).length,
          'devops-infra': fallback.filter(r => r.categories.includes('devops-infra')).length,
          mlops: fallback.filter(r => r.categories.includes('mlops')).length,
          architecture: fallback.filter(r => r.categories.includes('architecture')).length,
        },
      }
    });
  }
}
