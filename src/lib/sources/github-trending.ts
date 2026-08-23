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
  
  // 1. Overall Daily Trending (Top breakout stars across all topics)
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
      results.push(...parseTrendingHtml(html, 'daily'));
    }
  } catch (err) {
    console.error('Error fetching Daily GitHub Trending:', err);
  }

  // 2. Language-specific Trending (Python, TypeScript, Go, Rust, C++)
  const langUrls = [
    'https://github.com/trending/python?since=daily',
    'https://github.com/trending/typescript?since=daily',
    'https://github.com/trending/go?since=daily',
    'https://github.com/trending/rust?since=daily',
    'https://github.com/trending/c++?since=daily',
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
      results.push(...parseTrendingHtml(html, 'weekly'));
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
