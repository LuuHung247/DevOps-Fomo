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
  { repo: 'trimstray/the-book-of-secret-knowledge', name: 'secret-knowledge' },
  { repo: 'ibraheemdev/modern-unix', name: 'modern-unix' },
  { repo: 'avelino/awesome-go', name: 'awesome-go' },
  { repo: 'vinta/awesome-python', name: 'awesome-python' },
  { repo: 'josephmisiti/awesome-machine-learning', name: 'awesome-ml' },
  { repo: 'veggiemonk/awesome-docker', name: 'awesome-docker' },
  { repo: 'shuaibiyy/awesome-terraform', name: 'awesome-terraform' },
  { repo: 'kyrolabs/awesome-langchain', name: 'awesome-langchain' },
];

const RELEVANCE_KEYWORDS = [
  'agent', 'skill', 'skills', 'harness', 'pentest', 'vulnerab', 'red-team',
  'llm', 'ai', 'devops', 'kubernetes', 'docker', 'terraform',
  'ansible', 'helm', 'gitops', 'ci', 'cd', 'pipeline', 'monitor',
  'observ', 'security', 'cloud', 'serverless', 'container', 'platform',
  'mlops', 'vector', 'embedding', 'inference', 'model', 'deploy',
  'autom', 'orchestrat', 'terminal', 'cli', 'tool', 'framework',
];

function isRelevantRepo(repoName: string): boolean {
  const lower = repoName.toLowerCase();
  return RELEVANCE_KEYWORDS.some(kw => lower.includes(kw));
}

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

  // Fetch raw Markdown without API rate limits in parallel with 3s timeout
  const fetchPromises = AWESOME_LISTS.map(async (list) => {
    try {
      // Try main branch first, then master
      let content = '';
      const rawUrls = [
        `https://raw.githubusercontent.com/${list.repo}/main/README.md`,
        `https://raw.githubusercontent.com/${list.repo}/master/README.md`,
      ];

      for (const url of rawUrls) {
        try {
          const res = await fetch(url, {
            signal: AbortSignal.timeout(3000),
            next: { revalidate: 86400 },
          });
          if (res.ok) {
            content = await res.text();
            break;
          }
        } catch {
          // Try next branch
        }
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
