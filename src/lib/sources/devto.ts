import { DiscoveredRepo } from '../types';

const TAGS_TO_SCAN = ['devops', 'ai', 'kubernetes', 'llm', 'mlops', 'docker', 'terraform', 'cloud', 'opensource'];

function extractGitHubLinks(text: string): string[] {
  if (!text) return [];
  const pattern = /github\.com\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_.]+)/g;
  const repos: string[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const repo = match[1].replace(/\.git$/, '').replace(/[#?].*$/, '');
    // Filter out non-repo paths
    if (!repo.includes('/blob/') && !repo.includes('/tree/') && 
        !repo.includes('/issues') && !repo.includes('/pull') &&
        !repo.includes('/wiki') && !repo.includes('.md') &&
        repo.split('/').length === 2) {
      repos.push(repo);
    }
  }
  return Array.from(new Set(repos));
}

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  positive_reactions_count: number;
  comments_count: number;
  body_markdown?: string;
  tag_list: string[];
}

export async function fetchDevToRepos(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];

  const tagPromises = TAGS_TO_SCAN.map(async (tag) => {
    try {
      const url = `https://dev.to/api/articles?tag=${tag}&top=30&per_page=15`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'DevOps-FOMO/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 3600 },
      });

      if (!res.ok) return [];

      const articles: DevToArticle[] = await res.json();
      if (!Array.isArray(articles)) return [];

      const tagRepos: DiscoveredRepo[] = [];

      for (const article of articles) {
        if (article.positive_reactions_count < 10) continue;

        const descLinks = extractGitHubLinks(article.description || '');
        for (const repoName of descLinks) {
          tagRepos.push({
            fullName: repoName,
            url: `https://github.com/${repoName}`,
            description: `Mentioned in: "${article.title}"`,
            source: 'devto',
            socialScore: article.positive_reactions_count,
            devtoReactions: article.positive_reactions_count,
          });
        }
      }
      return tagRepos;
    } catch {
      return [];
    }
  });

  const settled = await Promise.allSettled(tagPromises);
  for (const item of settled) {
    if (item.status === 'fulfilled' && Array.isArray(item.value)) {
      results.push(...item.value);
    }
  }

  // Deduplicate and aggregate mentions
  const repoMap = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    const existing = repoMap.get(key);
    if (!existing) {
      repoMap.set(key, repo);
    } else {
      existing.devtoReactions = (existing.devtoReactions || 0) + (repo.devtoReactions || 0);
      existing.socialScore = (existing.socialScore || 0) + (repo.socialScore || 0);
    }
  }

  return Array.from(repoMap.values());
}
