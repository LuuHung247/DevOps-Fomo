import { DiscoveredRepo } from '../types';

// Curated awesome lists relevant to AI & DevOps
const AWESOME_LISTS = [
  { repo: 'Zijian-Ni/awesome-ai-agents-2026', name: 'awesome-ai-agents-2026' },
  { repo: 'ai-for-developers/awesome-ai-coding-tools', name: 'awesome-ai-coding-tools' },
  { repo: 'VoltAgent/awesome-agent-skills', name: 'awesome-agent-skills' },
  { repo: 'ComposioHQ/awesome-claude-skills', name: 'awesome-claude-skills' },
  { repo: 'e2b-dev/awesome-ai-agents', name: 'awesome-ai-agents' },
  { repo: 'bregman-arie/devops-exercises', name: 'devops-exercises' },
  { repo: 'awesome-selfhosted/awesome-selfhosted', name: 'awesome-selfhosted' },
  { repo: 'ramitsurana/awesome-kubernetes', name: 'awesome-kubernetes' },
];

function extractGitHubRepos(markdown: string): string[] {
  const pattern = /github\.com\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_.]+)/g;
  const repos: string[] = [];
  let match;
  const seen = new Set<string>();

  while ((match = pattern.exec(markdown)) !== null) {
    let repo = match[1]
      .replace(/\.git$/, '')
      .replace(/[#?].*$/, '')
      .replace(/\).*$/, '')
      .replace(/['"\]>].*$/, '');

    // Filter out non-repo paths
    if (repo.includes('/blob') || repo.includes('/tree') || 
        repo.includes('/issues') || repo.includes('/pull') ||
        repo.includes('/wiki') || repo.includes('/releases') ||
        repo.includes('/actions') || repo.includes('/commit') ||
        repo.includes('.md') || repo.includes('.txt') ||
        repo.split('/').length !== 2) {
      continue;
    }

    const key = repo.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      repos.push(repo);
    }
  }

  return repos;
}

export async function fetchAwesomeListRepos(): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3.raw',
    'User-Agent': 'DevOps-FOMO/1.0',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  // Process top 5 lists in parallel with 3s timeout
  const listsToProcess = AWESOME_LISTS.slice(0, token ? 8 : 4);

  const fetchPromises = listsToProcess.map(async (list) => {
    try {
      const url = `https://api.github.com/repos/${list.repo}/readme`;
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 86400 },
      });

      if (!res.ok) return [];

      const data = await res.json();
      let content = '';
      if (data.content) {
        content = Buffer.from(data.content, 'base64').toString('utf-8');
      }

      if (!content) return [];

      const repos = extractGitHubRepos(content);
      const listResults: DiscoveredRepo[] = [];

      for (const repoName of repos) {
        if (repoName.toLowerCase() === list.repo.toLowerCase()) continue;
        listResults.push({
          fullName: repoName,
          url: `https://github.com/${repoName}`,
          source: 'awesome-list',
          awesomeListName: list.name,
          description: `Curated in ${list.name}`,
        });
      }
      return listResults;
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
  const repoMap = new Map<string, DiscoveredRepo & { lists: string[] }>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    const existing = repoMap.get(key);
    if (!existing) {
      repoMap.set(key, { ...repo, lists: [repo.awesomeListName || ''] });
    } else {
      if (repo.awesomeListName && !existing.lists.includes(repo.awesomeListName)) {
        existing.lists.push(repo.awesomeListName);
      }
    }
  }

  return Array.from(repoMap.values()).map(r => ({
    ...r,
    awesomeListName: r.lists.join(', '),
  }));
}
