import { RepoItem, CategoryId } from './types';
import { SEED_REPOSITORIES } from './seeds';

interface GitHubApiItem {
  id: number;
  full_name: string;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
}

const SEARCH_QUERIES = [
  'topic:devops stars:>3000',
  'topic:agentic-ai stars:>1000',
  'topic:llmops stars:>1000',
  'topic:mlops stars:>2000',
  'topic:kubernetes stars:>5000',
  'topic:system-design stars:>5000',
  'topic:iac stars:>2000',
  'topic:docker stars:>5000',
  'topic:ebpf stars:>1000',
  'topic:opentelemetry stars:>1000',
];

export function determineCategories(topics: string[], desc: string, stars: number): CategoryId[] {
  const categories: CategoryId[] = [];
  const lowerDesc = (desc || '').toLowerCase();
  const lowerTopics = (topics || []).map(t => t.toLowerCase());

  // Hall of Fame
  if (stars >= 40000) {
    categories.push('hall-of-fame');
  }

  // Agentic AI & AI
  const aiKeywords = ['ai', 'agent', 'llm', 'autonomous', 'gpt', 'rag', 'langchain', 'llama', 'deepseek', 'ollama', 'vllm', 'inference', 'embedding'];
  const hasAi = lowerTopics.some(t => aiKeywords.some(k => t.includes(k))) ||
                aiKeywords.some(k => lowerDesc.includes(k));
  if (hasAi) {
    categories.push('agentic-ai');
  }

  // DevOps & Cloud-Native
  const devopsKeywords = ['devops', 'kubernetes', 'k8s', 'docker', 'terraform', 'ansible', 'helm', 'gitops', 'ci-cd', 'iac', 'cloud-native', 'ebpf', 'container', 'crossplane', 'cilium', 'argo'];
  const hasDevops = lowerTopics.some(t => devopsKeywords.some(k => t.includes(k))) ||
                    devopsKeywords.some(k => lowerDesc.includes(k));
  if (hasDevops) {
    categories.push('devops-infra');
  }

  // MLOps & LLMOps
  const mlopsKeywords = ['mlops', 'llmops', 'vector-database', 'vector-search', 'model-serving', 'eval', 'experiment-tracking', 'feature-store', 'qdrant', 'chroma', 'milvus', 'mlflow', 'triton'];
  const hasMlops = lowerTopics.some(t => mlopsKeywords.some(k => t.includes(k))) ||
                   mlopsKeywords.some(k => lowerDesc.includes(k));
  if (hasMlops) {
    categories.push('mlops');
  }

  // Architecture & Best Practices
  const archKeywords = ['architecture', 'system-design', 'roadmap', 'best-practices', 'cheatsheet', 'interview-prep', 'guide', 'primer', 'awesome-'];
  const hasArch = lowerTopics.some(t => archKeywords.some(k => t.includes(k))) ||
                  archKeywords.some(k => lowerDesc.includes(k));
  if (hasArch) {
    categories.push('architecture');
  }

  // Default fallback if empty
  if (categories.length === 0) {
    categories.push('devops-infra');
  }

  return categories;
}

export function calculateVelocity(stars: number, createdAt: string, updatedAt: string): { score: number; label: RepoItem['velocityLabel'] } {
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  const now = Date.now();
  
  const ageDays = Math.max(1, (now - created) / (1000 * 60 * 60 * 24));
  const recentActivityDays = Math.max(0, (now - updated) / (1000 * 60 * 60 * 24));
  
  const starsPerDay = stars / ageDays;
  
  let score = Math.min(99, Math.round(starsPerDay * 5));
  if (stars >= 50000) score = Math.max(score, 92);
  
  let label: RepoItem['velocityLabel'] = 'TOP RATED';
  if (starsPerDay > 15 && ageDays < 365) {
    label = 'EXPLOSIVE';
    score = Math.max(score, 96);
  } else if (starsPerDay > 5 || recentActivityDays < 3) {
    label = 'HOT RISING';
    score = Math.max(score, 90);
  } else if (stars > 25000) {
    label = 'BATTLE-TESTED';
  }

  return { score, label };
}

export async function fetchLiveRepositories(): Promise<RepoItem[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevOps-FOMO-Aggregator',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const fetchedMap = new Map<string, RepoItem>();

  // 1. Seed repos first
  for (const seed of SEED_REPOSITORIES) {
    fetchedMap.set(seed.fullName.toLowerCase(), seed);
  }

  // 2. Fetch from GitHub Search API for trending/hot queries
  for (const query of SEARCH_QUERIES.slice(0, token ? SEARCH_QUERIES.length : 4)) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=15`;
      const res = await fetch(url, { headers, next: { revalidate: 3600 } });
      
      if (!res.ok) {
        console.warn(`GitHub API request for "${query}" returned status ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items as GitHubApiItem[]) {
          const key = item.full_name.toLowerCase();
          
          const categories = determineCategories(item.topics || [], item.description || '', item.stargazers_count);
          const velocity = calculateVelocity(item.stargazers_count, item.created_at, item.updated_at);
          
          if (velocity.label === 'EXPLOSIVE' || velocity.label === 'HOT RISING') {
            if (!categories.includes('trending')) {
              categories.push('trending');
            }
          }

          const existing = fetchedMap.get(key);
          
          const repoItem: RepoItem = {
            id: item.full_name,
            fullName: item.full_name,
            name: item.name,
            owner: item.owner.login,
            ownerAvatar: item.owner.avatar_url,
            description: item.description || 'No description provided.',
            url: item.html_url,
            stars: item.stargazers_count,
            forks: item.forks_count,
            openIssues: item.open_issues_count,
            language: item.language || 'Unknown',
            topics: (item.topics || []).slice(0, 7),
            updatedAt: item.updated_at,
            createdAt: item.created_at,
            category: categories[0] || 'devops-infra',
            categories,
            isVerified: existing?.isVerified || item.stargazers_count > 5000,
            velocityScore: velocity.score,
            velocityLabel: velocity.label,
          };

          fetchedMap.set(key, repoItem);
        }
      }
    } catch (err) {
      console.error(`Error querying GitHub API for ${query}:`, err);
    }
  }

  const allRepos = Array.from(fetchedMap.values());
  return allRepos.sort((a, b) => b.stars - a.stars);
}
