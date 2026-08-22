import { RepoItem, CategoryId, DiscoveredRepo } from './types';

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

// ====== EXPANDED SEARCH QUERIES (30+) ======
const SEARCH_QUERIES = [
  // --- Core DevOps & Infrastructure ---
  'topic:devops stars:>3000',
  'topic:kubernetes stars:>5000',
  'topic:docker stars:>5000',
  'topic:terraform stars:>2000',
  'topic:iac stars:>2000',
  'topic:gitops stars:>1000',
  'topic:helm stars:>2000',
  'topic:ansible stars:>3000',

  // --- Observability & Security ---
  'topic:ebpf stars:>1000',
  'topic:opentelemetry stars:>1000',
  'topic:monitoring stars:>3000',
  'topic:devsecops stars:>500',

  // --- AI Agent & LLM Ecosystem ---
  'topic:agentic-ai stars:>500',
  'topic:ai-agent stars:>500',
  'topic:llm stars:>2000',
  'topic:llmops stars:>500',
  'topic:rag stars:>1000',
  'topic:vector-database stars:>500',
  'topic:model-serving stars:>500',
  'topic:prompt-engineering stars:>1000',

  // --- Emerging: AI Coding & SWE Agents ---
  '"ai agent" in:readme stars:>500 pushed:>2025-01-01',
  '"coding agent" OR "swe-agent" OR "code agent" in:readme stars:>300',
  '"mcp" OR "model context protocol" in:readme stars:>200 pushed:>2025-01-01',
  'topic:copilot stars:>500',

  // --- MLOps & Data ---
  'topic:mlops stars:>2000',
  'topic:experiment-tracking stars:>500',

  // --- Newly Created & Fast Growing ---
  'created:>2025-01-01 stars:>1000 topic:ai',
  'created:>2025-01-01 stars:>500 topic:devops',
  'created:>2024-06-01 stars:>2000 topic:agent',

  // --- Platform Engineering ---
  'topic:platform-engineering stars:>500',
  'topic:internal-developer-platform stars:>300',

  // --- System Design & Architecture ---
  'topic:system-design stars:>5000',
  'topic:roadmap stars:>5000',
];

// ====== CATEGORY CLASSIFICATION ======
export function determineCategories(topics: string[], desc: string, stars: number): CategoryId[] {
  const categories: CategoryId[] = [];
  const lowerDesc = (desc || '').toLowerCase();
  const lowerTopics = (topics || []).map(t => t.toLowerCase());

  // Hall of Fame
  if (stars >= 40000) {
    categories.push('hall-of-fame');
  }

  // Agentic AI & AI
  const aiKeywords = [
    'ai', 'agent', 'llm', 'autonomous', 'gpt', 'rag', 'langchain', 'langgraph',
    'llama', 'deepseek', 'ollama', 'vllm', 'inference', 'embedding',
    'copilot', 'cursor', 'claude', 'openai', 'anthropic', 'gemini',
    'mcp', 'model-context', 'swe-agent', 'coding-agent', 'devin',
    'autogen', 'crewai', 'metagpt', 'agentic', 'multi-agent',
    'prompt', 'chatbot', 'transformer', 'fine-tun', 'lora',
  ];
  const hasAi = lowerTopics.some(t => aiKeywords.some(k => t.includes(k))) ||
                aiKeywords.some(k => lowerDesc.includes(k));
  if (hasAi) {
    categories.push('agentic-ai');
  }

  // DevOps & Cloud-Native
  const devopsKeywords = [
    'devops', 'kubernetes', 'k8s', 'docker', 'terraform', 'ansible', 'helm',
    'gitops', 'ci-cd', 'ci/cd', 'iac', 'cloud-native', 'ebpf', 'container',
    'crossplane', 'cilium', 'argo', 'flux', 'pulumi', 'harness',
    'backstage', 'platform-engineer', 'internal-developer', 'service-mesh',
    'envoy', 'istio', 'linkerd', 'kustomize', 'opentofu',
    'sre', 'reliability', 'incident', 'on-call', 'runbook',
  ];
  const hasDevops = lowerTopics.some(t => devopsKeywords.some(k => t.includes(k))) ||
                    devopsKeywords.some(k => lowerDesc.includes(k));
  if (hasDevops) {
    categories.push('devops-infra');
  }

  // MLOps & LLMOps
  const mlopsKeywords = [
    'mlops', 'llmops', 'vector-database', 'vector-search', 'model-serving',
    'eval', 'experiment-tracking', 'feature-store', 'qdrant', 'chroma',
    'milvus', 'mlflow', 'triton', 'bentoml', 'ray', 'serving',
    'opentelemetry', 'tracing', 'ai-observability', 'phoenix', 'wandb',
    'label', 'annotation', 'dataset', 'fine-tune', 'distill',
  ];
  const hasMlops = lowerTopics.some(t => mlopsKeywords.some(k => t.includes(k))) ||
                   mlopsKeywords.some(k => lowerDesc.includes(k));
  if (hasMlops) {
    categories.push('mlops');
  }

  // Architecture & Best Practices
  const archKeywords = [
    'architecture', 'system-design', 'roadmap', 'best-practices', 'cheatsheet',
    'interview-prep', 'guide', 'primer', 'awesome-', 'curated', 'resource',
    'learning-path', 'tutorial', 'handbook', 'reference', 'pattern',
  ];
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

// ====== VELOCITY SCORING ======
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
    label = 'CLASSIC';
  }

  return { score, label };
}

// ====== GITHUB SEARCH API FETCHER (Expanded) ======
export async function fetchGitHubSearchRepos(headers: Record<string, string>): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  const token = !!headers['Authorization'];

  // Without token: limit queries to avoid rate limits
  const queries = token ? SEARCH_QUERIES : SEARCH_QUERIES.slice(0, 8);

  for (const query of queries) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
      const res = await fetch(url, { headers, next: { revalidate: 3600 } });

      if (!res.ok) {
        console.warn(`GitHub Search API for "${query}" returned ${res.status}`);
        // If rate limited, stop making more requests
        if (res.status === 403 || res.status === 429) break;
        continue;
      }

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items as GitHubApiItem[]) {
          results.push({
            fullName: item.full_name,
            url: item.html_url,
            description: item.description || '',
            stars: item.stargazers_count,
            language: item.language || undefined,
            source: 'github-search',
          });
        }
      }
    } catch (err) {
      console.error(`Error in GitHub Search for "${query}":`, err);
    }
  }

  // Deduplicate
  const seen = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, repo);
    }
  }

  return Array.from(seen.values());
}
