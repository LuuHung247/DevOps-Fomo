import { DiscoveredRepo } from '../types';

const RELEVANCE_KEYWORDS = [
  'ai', 'agent', 'agents', 'llm', 'llms', 'devops', 'kubernetes', 'docker', 'terraform',
  'cloud', 'infrastructure', 'deploy', 'container', 'cicd', 'pipeline',
  'monitor', 'observability', 'security', 'automat', 'serverless',
  'microservice', 'model', 'inference', 'vector', 'rag', 'prompt',
  'copilot', 'coding', 'developer', 'tool', 'framework', 'mlops',
  'platform', 'orchestrat', 'gitops', 'sre', 'system-design',
  'open-source', 'self-host', 'cli', 'terminal', 'rust', 'golang',
  'skill', 'skills', 'harness', 'mcp', 'reverse', 'router', 'pentest',
  'vulnerab', 'red-team', 'voice', 'speech', 'browser', 'memory',
];

function extractGitHubRepos(title: string, url: string): string | null {
  if (!url || !url.includes('github.com')) return null;
  const match = url.match(/github\.com\/([^\/]+\/[^\/\s#?]+)/);
  if (!match) return null;
  const repo = match[1].replace(/\.git$/, '');
  // Exclude non-repo paths
  if (repo.includes('/blob/') || repo.includes('/tree/') || 
      repo.includes('/issues') || repo.includes('/pull') ||
      repo.includes('/wiki') || repo.includes('/releases')) return null;
  return repo;
}

function isRelevant(title: string): boolean {
  const lower = title.toLowerCase();
  return RELEVANCE_KEYWORDS.some(kw => lower.includes(kw));
}

interface HNHit {
  objectID: string;
  title: string;
  url: string;
  points: number;
  num_comments: number;
  created_at: string;
  _tags?: string[];
}

interface HNSearchResponse {
  hits: HNHit[];
  nbHits: number;
}

export async function fetchHackerNewsRepos(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  
  // Calculate timestamp for 30 days ago
  const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

  const queries = [
    // 1. Show HN launches linking to GitHub
    `https://hn.algolia.com/api/v1/search?query=github.com&tags=show_hn&numericFilters=created_at_i>${thirtyDaysAgo}&hitsPerPage=40`,
    // 2. High-scoring stories linking directly to GitHub repos
    `https://hn.algolia.com/api/v1/search?query=github.com&tags=story&numericFilters=points>25,created_at_i>${thirtyDaysAgo}&hitsPerPage=40`,
    // 3. Stories about AI agents, DevOps tools, local models
    `https://hn.algolia.com/api/v1/search?query=ai+agent+github&tags=story&numericFilters=points>15,created_at_i>${thirtyDaysAgo}&hitsPerPage=25`,
    `https://hn.algolia.com/api/v1/search?query=devops+tool+github&tags=story&numericFilters=points>15,created_at_i>${thirtyDaysAgo}&hitsPerPage=25`,
  ];

  const fetchPromises = queries.map(async (queryUrl) => {
    try {
      const res = await fetch(queryUrl, {
        headers: { 'User-Agent': 'DevOps-FOMO/1.0' },
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 1800 },
      });

      if (!res.ok) return [];

      const data: HNSearchResponse = await res.json();
      if (!data.hits || !Array.isArray(data.hits)) return [];

      const items: DiscoveredRepo[] = [];
      for (const hit of data.hits) {
        const repoName = extractGitHubRepos(hit.title, hit.url || '');
        if (!repoName) continue;

        const isShowHN = hit._tags?.includes('show_hn') || hit.title.toLowerCase().startsWith('show hn');
        const isHighSignal = (hit.points || 0) >= 25 || isShowHN;

        if (!isHighSignal && !isRelevant(hit.title)) continue;

        items.push({
          fullName: repoName,
          url: `https://github.com/${repoName}`,
          description: hit.title,
          source: 'hackernews',
          socialScore: hit.points || 15,
          hnPoints: hit.points || 15,
          hnComments: hit.num_comments || 0,
        });
      }
      return items;
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

  // Deduplicate and keep highest scoring entry
  const repoMap = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    const existing = repoMap.get(key);
    if (!existing || (repo.hnPoints || 0) > (existing.hnPoints || 0)) {
      if (existing) {
        repo.socialScore = (repo.socialScore || 0) + (existing.socialScore || 0);
      }
      repoMap.set(key, repo);
    }
  }

  return Array.from(repoMap.values());
}
