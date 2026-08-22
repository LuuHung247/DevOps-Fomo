import { DiscoveredRepo } from '../types';

const RELEVANT_KEYWORDS = [
  'ai', 'agent', 'llm', 'devops', 'kubernetes', 'docker', 'terraform',
  'mlops', 'cloud', 'infrastructure', 'deploy', 'container', 'helm',
  'gitops', 'cicd', 'pipeline', 'monitor', 'observ', 'security',
  'automat', 'orchestrat', 'serverless', 'microservice', 'platform',
  'model', 'inference', 'vector', 'embedding', 'rag', 'prompt',
  'copilot', 'coding', 'developer', 'tool', 'framework', 'cli',
  'rust', 'go', 'python', 'typescript', 'system', 'design',
  'awesome', 'roadmap', 'cheatsheet', 'guide', 'learn',
];

function isRelevantRepo(name: string, description: string): boolean {
  const text = `${name} ${description}`.toLowerCase();
  return RELEVANT_KEYWORDS.some(kw => text.includes(kw));
}

function extractRepoFromUrl(url: string): string | null {
  const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
  if (!match) return null;
  return match[1].replace(/\.git$/, '').replace(/[#?].*$/, '');
}

export async function fetchGitHubTrending(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  const periods: Array<{ param: string; period: 'daily' | 'weekly' }> = [
    { param: 'since=daily', period: 'daily' },
    { param: 'since=weekly', period: 'weekly' },
  ];

  for (const { param, period } of periods) {
    try {
      const url = `https://github.com/trending?${param}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DevOps-FOMO/1.0)',
          'Accept': 'text/html',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.warn(`GitHub Trending fetch failed (${period}): ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Parse repo entries from the trending page HTML
      // Each repo is in an <article> with class "Box-row"
      // The repo link is in an <h2> with <a href="/owner/repo">
      const repoPattern = /<h2[^>]*class="[^"]*h3[^"]*"[^>]*>\s*<a[^>]*href="\/([^"]+)"[^>]*>/g;
      const descPattern = /<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/g;
      const starsPattern = /(\d[\d,]*)\s*stars\s*today/gi;
      
      let repoMatch;
      const repoNames: string[] = [];
      
      while ((repoMatch = repoPattern.exec(html)) !== null) {
        const fullName = repoMatch[1].trim();
        if (fullName.includes('/') && !fullName.includes('/blob/') && !fullName.includes('/tree/')) {
          repoNames.push(fullName);
        }
      }

      // Fallback: also try the simpler href pattern for trending repos
      if (repoNames.length === 0) {
        const hrefPattern = /href="\/([^\/]+\/[^\/\s"]+)"[^>]*class="[^"]*Link[^"]*"/g;
        let hrefMatch;
        while ((hrefMatch = hrefPattern.exec(html)) !== null) {
          const name = hrefMatch[1].trim();
          if (name.includes('/') && !name.startsWith('features/') && 
              !name.startsWith('login') && !name.startsWith('signup') &&
              !name.includes('/blob/') && !name.includes('/tree/') &&
              !name.includes('/issues') && !name.includes('/pull')) {
            repoNames.push(name);
          }
        }
      }

      // Even more aggressive fallback: look for any /owner/repo pattern in trending context
      if (repoNames.length === 0) {
        const broadPattern = /\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_.]+)/g;
        const seen = new Set<string>();
        let broadMatch;
        while ((broadMatch = broadPattern.exec(html)) !== null) {
          const name = broadMatch[1];
          if (name.includes('/') && !seen.has(name) && 
              !name.startsWith('features/') && !name.startsWith('site/') &&
              !name.startsWith('login') && !name.startsWith('signup') &&
              !name.includes('.css') && !name.includes('.js') &&
              name.split('/').length === 2) {
            seen.add(name);
            if (seen.size <= 25) {
              repoNames.push(name);
            }
          }
        }
      }

      // Deduplicate
      const uniqueRepos = Array.from(new Set(repoNames)).slice(0, 25);

      for (const fullName of uniqueRepos) {
        results.push({
          fullName,
          url: `https://github.com/${fullName}`,
          source: 'github-trending',
          trendingPeriod: period,
          description: '',
        });
      }
    } catch (err) {
      console.error(`Error fetching GitHub trending (${period}):`, err);
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
