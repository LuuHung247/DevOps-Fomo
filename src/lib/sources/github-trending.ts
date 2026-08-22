import { DiscoveredRepo } from '../types';

function extractRepoFromUrl(url: string): string | null {
  const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!match) return null;
  return match[1].replace(/\.git$/, '').replace(/[#?].*$/, '');
}

export async function fetchGitHubTrending(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  
  // Trending endpoints to scrape
  const urls = [
    { url: 'https://github.com/trending?since=daily', period: 'daily' as const },
    { url: 'https://github.com/trending/python?since=daily', period: 'daily' as const },
    { url: 'https://github.com/trending/go?since=daily', period: 'daily' as const },
    { url: 'https://github.com/trending/typescript?since=daily', period: 'daily' as const },
    { url: 'https://github.com/trending/rust?since=daily', period: 'daily' as const },
    { url: 'https://github.com/trending?since=weekly', period: 'weekly' as const },
  ];

  for (const { url, period } of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html',
        },
        next: { revalidate: 1800 },
      });

      if (!res.ok) {
        console.warn(`GitHub Trending fetch failed (${url}): ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Extract repo blocks: href="/owner/repo" in article.Box-row
      const repoPattern = /href="\/([a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+)"[^>]*class="[^"]*Link/g;
      const starsTodayPattern = /([0-9,]+)\s*stars\s*(?:today|this week)/gi;
      
      const seenOnPage = new Set<string>();
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
          !fullName.includes('/tree/') &&
          !seenOnPage.has(fullName.toLowerCase())
        ) {
          seenOnPage.add(fullName.toLowerCase());
          
          results.push({
            fullName,
            url: `https://github.com/${fullName}`,
            source: 'github-trending',
            trendingPeriod: period,
            description: '',
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // Fallback regex if Link class changed
      if (seenOnPage.size === 0) {
        const broadPattern = /<h2[^>]*>\s*<a[^>]*href="\/([^"]+)"/g;
        let broadMatch;
        while ((broadMatch = broadPattern.exec(html)) !== null) {
          const raw = broadMatch[1].trim().replace(/^\//, '');
          if (raw.split('/').length === 2 && !seenOnPage.has(raw.toLowerCase())) {
            seenOnPage.add(raw.toLowerCase());
            results.push({
              fullName: raw,
              url: `https://github.com/${raw}`,
              source: 'github-trending',
              trendingPeriod: period,
              description: '',
              createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching GitHub trending (${url}):`, err);
    }
  }

  // Deduplicate across periods (daily takes priority)
  const seen = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    if (!seen.has(key) || repo.trendingPeriod === 'daily') {
      seen.set(key, repo);
    }
  }

  return Array.from(seen.values());
}
