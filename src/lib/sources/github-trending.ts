import { DiscoveredRepo } from '../types';

export async function fetchGitHubTrending(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  
  // 1. Primary: Overall Daily Trending (Top 5 are true daily breakouts)
  try {
    const res = await fetch('https://github.com/trending?since=daily', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const html = await res.text();
      const repoPattern = /href="\/([a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+)"[^>]*class="[^"]*Link/g;
      let match;
      let rank = 0;

      while ((match = repoPattern.exec(html)) !== null) {
        const fullName = match[1].trim();
        if (
          fullName.includes('/') &&
          !fullName.startsWith('features/') &&
          !fullName.startsWith('site/') &&
          !fullName.startsWith('login') &&
          !fullName.startsWith('signup') &&
          !fullName.includes('/blob/') &&
          !fullName.includes('/tree/')
        ) {
          rank++;
          results.push({
            fullName,
            url: `https://github.com/${fullName}`,
            source: 'github-trending',
            trendingPeriod: rank <= 5 ? 'daily' : 'weekly',
            description: '',
            createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
  } catch (err) {
    console.error('Error fetching Daily GitHub Trending:', err);
  }

  // 2. Secondary Language Trending (Python, Go, TypeScript, Rust) - Treated as weekly/rising
  const langUrls = [
    'https://github.com/trending/python?since=daily',
    'https://github.com/trending/go?since=daily',
    'https://github.com/trending/typescript?since=daily',
    'https://github.com/trending/rust?since=daily',
  ];

  for (const url of langUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;

      const html = await res.text();
      const repoPattern = /href="\/([a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+)"[^>]*class="[^"]*Link/g;
      let match;

      while ((match = repoPattern.exec(html)) !== null) {
        const fullName = match[1].trim();
        if (
          fullName.includes('/') &&
          !fullName.startsWith('features/') &&
          !fullName.startsWith('site/') &&
          !fullName.startsWith('login') &&
          !fullName.startsWith('signup') &&
          !fullName.includes('/blob/') &&
          !fullName.includes('/tree/')
        ) {
          results.push({
            fullName,
            url: `https://github.com/${fullName}`,
            source: 'github-trending',
            trendingPeriod: 'weekly',
            description: '',
            createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error(`Error fetching language trending (${url}):`, err);
    }
  }

  // Deduplicate
  const seen = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    if (!seen.has(key) || repo.trendingPeriod === 'daily') {
      seen.set(key, repo);
    }
  }

  return Array.from(seen.values());
}
