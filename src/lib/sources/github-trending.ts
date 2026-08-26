import { DiscoveredRepo } from '../types';

function parseTrendingHtml(html: string, period: 'daily' | 'weekly'): DiscoveredRepo[] {
  const list: DiscoveredRepo[] = [];
  
  // Parse article blocks in GitHub trending HTML
  const articleRegex = /<article[^>]*class="[^"]*Box-row[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  let articleMatch;
  let rank = 0;

  while ((articleMatch = articleRegex.exec(html)) !== null) {
    const block = articleMatch[1];

    // Extract repo name
    const repoMatch = /href="\/([a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+)"[^>]*class="[^"]*Link/i.exec(block);
    if (!repoMatch) continue;

    const fullName = repoMatch[1].trim();
    if (
      !fullName.includes('/') ||
      fullName.startsWith('features/') ||
      fullName.startsWith('site/') ||
      fullName.startsWith('login') ||
      fullName.startsWith('signup') ||
      fullName.includes('/blob/') ||
      fullName.includes('/tree/')
    ) {
      continue;
    }

    rank++;

    // Extract description
    let description = '';
    const descMatch = /<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/i.exec(block);
    if (descMatch) {
      description = descMatch[1].replace(/<[^>]+>/g, '').trim();
    }

    // Extract stars today
    let trendingStarsToday: number | undefined;
    const starsTodayMatch = /([0-9,]+)\s+stars\s+today/i.exec(block);
    if (starsTodayMatch) {
      trendingStarsToday = parseInt(starsTodayMatch[1].replace(/,/g, ''), 10);
    }

    // Extract language
    let language: string | undefined;
    const langMatch = /itemprop="programmingLanguage">([^<]+)</i.exec(block);
    if (langMatch) {
      language = langMatch[1].trim();
    }

    list.push({
      fullName,
      url: `https://github.com/${fullName}`,
      source: 'github-trending',
      trendingPeriod: rank <= 5 ? 'daily' : period,
      trendingStarsToday,
      description,
      language,
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Fallback simple regex if article regex matched nothing
  if (list.length === 0) {
    const fallbackRegex = /href="\/([a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+)"[^>]*class="[^"]*Link/g;
    let match;
    let r = 0;
    while ((match = fallbackRegex.exec(html)) !== null) {
      const fullName = match[1].trim();
      if (fullName.includes('/') && !fullName.startsWith('features/') && !fullName.startsWith('site/')) {
        r++;
        list.push({
          fullName,
          url: `https://github.com/${fullName}`,
          source: 'github-trending',
          trendingPeriod: r <= 5 ? 'daily' : period,
          description: '',
          createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  return list;
}

export async function fetchGitHubTrending(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html',
  };

  const urls = [
    { url: 'https://github.com/trending?since=daily', period: 'daily' as const },
    { url: 'https://github.com/trending/python?since=daily', period: 'weekly' as const },
    { url: 'https://github.com/trending/typescript?since=daily', period: 'weekly' as const },
    { url: 'https://github.com/trending/go?since=daily', period: 'weekly' as const },
    { url: 'https://github.com/trending/rust?since=daily', period: 'weekly' as const },
  ];

  // Fetch all in parallel with strict 3-second timeout
  const fetchPromises = urls.map(async ({ url, period }) => {
    try {
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 1800 },
      });
      if (!res.ok) return [];
      const html = await res.text();
      return parseTrendingHtml(html, period);
    } catch {
      return [];
    }
  });

  const settled = await Promise.allSettled(fetchPromises);
  for (const item of settled) {
    if (item.status === 'fulfilled' && Array.isArray(item.value)) {
      results.push(...item.value);
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
