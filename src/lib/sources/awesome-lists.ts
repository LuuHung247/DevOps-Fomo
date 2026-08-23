import { DiscoveredRepo } from '../types';

// Curated awesome lists relevant to AI & DevOps
const AWESOME_LISTS = [
  { repo: 'Zijian-Ni/awesome-ai-agents-2026', name: 'awesome-ai-agents-2026' },
  { repo: 'ai-for-developers/awesome-ai-coding-tools', name: 'awesome-ai-coding-tools' },
  { repo: 'VoltAgent/awesome-agent-skills', name: 'awesome-agent-skills' },
  { repo: 'ComposioHQ/awesome-claude-skills', name: 'awesome-claude-skills' },
  { repo: 'e2b-dev/awesome-ai-agents', name: 'awesome-ai-agents' },
  { repo: 'sbilly/awesome-security', name: 'awesome-security' },
  { repo: 'enaqx/awesome-pentest', name: 'awesome-pentest' },
  { repo: 'sindresorhus/awesome', name: 'awesome' },
  { repo: 'trimstray/the-book-of-secret-knowledge', name: 'secret-knowledge' },
  { repo: 'bregman-arie/devops-exercises', name: 'devops-exercises' },
  { repo: 'ibraheemdev/modern-unix', name: 'modern-unix' },
  { repo: 'avelino/awesome-go', name: 'awesome-go' },
  { repo: 'vinta/awesome-python', name: 'awesome-python' },
  { repo: 'josephmisiti/awesome-machine-learning', name: 'awesome-ml' },
  { repo: 'awesome-selfhosted/awesome-selfhosted', name: 'awesome-selfhosted' },
  { repo: 'veggiemonk/awesome-docker', name: 'awesome-docker' },
  { repo: 'ramitsurana/awesome-kubernetes', name: 'awesome-kubernetes' },
  { repo: 'shuaibiyy/awesome-terraform', name: 'awesome-terraform' },
  { repo: 'kyrolabs/awesome-langchain', name: 'awesome-langchain' },
];

const RELEVANCE_KEYWORDS = [
  'agent', 'skill', 'skills', 'harness', 'pentest', 'penetrat', 'vulnerab', 'red-team',
  'llm', 'ai', 'devops', 'kubernetes', 'docker', 'terraform',
  'ansible', 'helm', 'gitops', 'ci', 'cd', 'pipeline', 'monitor',
  'observ', 'security', 'cloud', 'serverless', 'container', 'platform',
  'mlops', 'vector', 'embedding', 'inference', 'model', 'deploy',
  'autom', 'orchestrat', 'terminal', 'cli', 'tool', 'framework',
];

function extractGitHubRepos(markdown: string): string[] {
  // Match GitHub repo links in markdown: [text](https://github.com/owner/repo) or bare URLs
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

function isRelevantRepo(repoName: string): boolean {
  const lower = repoName.toLowerCase();
  return RELEVANCE_KEYWORDS.some(kw => lower.includes(kw));
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

  // Only process a subset without token to avoid rate limiting
  const listsToProcess = token ? AWESOME_LISTS : AWESOME_LISTS.slice(0, 5);

  for (const list of listsToProcess) {
    try {
      const url = `https://api.github.com/repos/${list.repo}/readme`;
      const res = await fetch(url, {
        headers,
        next: { revalidate: 86400 }, // Cache for 24 hours
      });

      if (!res.ok) {
        console.warn(`Failed to fetch README for ${list.repo}: ${res.status}`);
        continue;
      }

      const data = await res.json();
      
      // README content is base64 encoded
      let content = '';
      if (data.content) {
        content = Buffer.from(data.content, 'base64').toString('utf-8');
      }

      if (!content) continue;

      const repos = extractGitHubRepos(content);

      for (const repoName of repos) {
        // Skip self-reference
        if (repoName.toLowerCase() === list.repo.toLowerCase()) continue;

        results.push({
          fullName: repoName,
          url: `https://github.com/${repoName}`,
          source: 'awesome-list',
          awesomeListName: list.name,
          description: `Curated in ${list.name}`,
        });
      }
    } catch (err) {
      console.error(`Error fetching awesome list ${list.repo}:`, err);
    }
  }

  // Deduplicate and track which awesome lists mention each repo
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
