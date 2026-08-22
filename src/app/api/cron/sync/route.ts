import { NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/discovery';
import { setCachedRepos } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('[Cron Sync] Starting scheduled multi-source synchronization...');
    const startTime = Date.now();

    // Force fresh data collection across all 5 layers
    const repos = await fetchAllSources();
    
    // Save to persistent file + memory cache
    setCachedRepos('all', repos);

    const duration = Date.now() - startTime;
    console.log(`[Cron Sync] Successfully synchronized ${repos.length} repositories in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Multi-source real-time intelligence synchronized successfully',
      totalRepos: repos.length,
      durationMs: duration,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron Sync] Synchronization failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown synchronization error',
      },
      { status: 500 }
    );
  }
}
