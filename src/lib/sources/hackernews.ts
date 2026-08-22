import { DiscoveredRepo } from '../types';

const RELEVANCE_KEYWORDS = [
  'ai', 'agent', 'llm', 'devops', 'kubernetes', 'docker', 'terraform',
  'cloud', 'infrastructure', 'deploy', 'container', 'cicd', 'pipeline',
  'monitor', 'observability', 'security', 'automat', 'serverless',
  'microservice', 'model', 'inference', 'vector', 'rag', 'prompt',
  'copilot', 'coding', 'developer', 'tool', 'framework', 'mlops',
  'platform', 'orchestrat', 'gitops', 'sre', 'system-design',
  'open-source', 'self-host', 'cli', 'terminal', 'rust', 'golang',
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
    // Stories that link directly to GitHub repos
    `https://hn.algolia.com/api/v1/search?query=github.com&tags=story&numericFilters=points>30,created_at_i>${thirtyDaysAgo}&hitsPerPage=50`,
    // Stories about AI agents, DevOps tools
    `https://hn.algolia.com/api/v1/search?query=ai+agent+github&tags=story&numericFilters=points>20,created_at_i>${thirtyDaysAgo}&hitsPerPage=30`,
    `https://hn.algolia.com/api/v1/search?query=devops+tool+github&tags=story&numericFilters=points>20,created_at_i>${thirtyDaysAgo}&hitsPerPage=30`,
    `https://hn.algolia.com/api/v1/search?query=open+source+llm&tags=story&numericFilters=points>30,created_at_i>${thirtyDaysAgo}&hitsPerPage=30`,
    `https://hn.algolia.com/api/v1/search?query=kubernetes+new+tool&tags=story&numericFilters=points>20,created_at_i>${thirtyDaysAgo}&hitsPerPage=20`,
  ];

  for (const queryUrl of queries) {
    try {
      const res = await fetch(queryUrl, {
        headers: { 'User-Agent': 'DevOps-FOMO/1.0' },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.warn(`HN API returned ${res.status} for query`);
        continue;
      }

      const data: HNSearchResponse = await res.json();
      
      if (!data.hits) continue;

      for (const hit of data.hits) {
        const repoName = extractGitHubRepos(hit.title, hit.url || '');
        if (!repoName) continue;

        // Check relevance
        if (!isRelevant(hit.title) && hit.points < 100) continue;

        results.push({
          fullName: repoName,
          url: `https://github.com/${repoName}`,
          description: hit.title,
          source: 'hackernews',
          socialScore: hit.points,
          hnPoints: hit.points,
          hnComments: hit.num_comments,
        });
      }
    } catch (err) {
      console.error('Error fetching HN data:', err);
    }
  }

  // Deduplicate and keep highest scoring entry
  const repoMap = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    const existing = repoMap.get(key);
    if (!existing || (repo.hnPoints || 0) > (existing.hnPoints || 0)) {
      // Aggregate mentions
      if (existing) {
        repo.socialScore = (repo.socialScore || 0) + (existing.socialScore || 0);
      }
      repoMap.set(key, repo);
    }
  }

  return Array.from(repoMap.values());
}
