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

  for (const tag of TAGS_TO_SCAN) {
    try {
      // Fetch top articles from the last 30 days for each tag
      const url = `https://dev.to/api/articles?tag=${tag}&top=30&per_page=15`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'DevOps-FOMO/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        console.warn(`Dev.to API returned ${res.status} for tag: ${tag}`);
        continue;
      }

      const articles: DevToArticle[] = await res.json();

      for (const article of articles) {
        // Only process articles with decent engagement
        if (article.positive_reactions_count < 15) continue;

        // Extract GitHub links from description
        const descLinks = extractGitHubLinks(article.description || '');
        
        // Try to fetch the full article body for more links
        let bodyLinks: string[] = [];
        if (article.positive_reactions_count > 30) {
          try {
            const articleRes = await fetch(`https://dev.to/api/articles/${article.id}`, {
              headers: {
                'User-Agent': 'DevOps-FOMO/1.0',
                'Accept': 'application/json',
              },
              next: { revalidate: 7200 },
            });
            if (articleRes.ok) {
              const fullArticle = await articleRes.json();
              bodyLinks = extractGitHubLinks(fullArticle.body_markdown || '');
            }
          } catch {
            // Skip body fetch errors silently
          }
        }

        const allLinks = Array.from(new Set(descLinks.concat(bodyLinks)));

        for (const repoName of allLinks) {
          results.push({
            fullName: repoName,
            url: `https://github.com/${repoName}`,
            description: `Mentioned in: "${article.title}"`,
            source: 'devto',
            socialScore: article.positive_reactions_count,
            devtoReactions: article.positive_reactions_count,
          });
        }
      }
    } catch (err) {
      console.error(`Error fetching Dev.to articles for tag ${tag}:`, err);
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
      // Aggregate reactions across multiple articles
      existing.devtoReactions = (existing.devtoReactions || 0) + (repo.devtoReactions || 0);
      existing.socialScore = (existing.socialScore || 0) + (repo.socialScore || 0);
    }
  }

  return Array.from(repoMap.values());
}
