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

// ====== SEARCH QUERIES (Targeting both established and newly emerging AI/DevOps) ======
const SEARCH_QUERIES = [
  // --- Emerging Breakout Stars (Created recently with high traction) ---
  'created:>2025-01-01 stars:>200',
  'created:>2024-09-01 stars:>1000 topic:ai',
  'created:>2024-09-01 stars:>500 topic:agent',
  'created:>2024-09-01 stars:>500 topic:devops',
  'created:>2024-09-01 stars:>300 topic:security',

  // --- AI Security, Penetration Testing, Guardrails & Red Teaming ---
  'topic:ai-security OR topic:red-teaming OR topic:devsecops stars:>150',
  'topic:penetration-testing OR topic:pentesting OR topic:vulnerability-scanner stars:>300',
  'strix OR AI-Infra-Guard OR "AI Red Teaming" OR "AI penetration testing" in:readme stars:>100',
  'topic:prompt-injection OR topic:jailbreak stars:>200',

  // --- AI Agent Skills, Harnesses & MCP Ecosystem ---
  'topic:agent-skills OR topic:claude-skills OR topic:skills stars:>100',
  'topic:agentic-ai stars:>500',
  'topic:ai-agent stars:>500',
  'topic:mcp OR "model context protocol" in:readme stars:>200',
  '"agent skills" OR "claude skills" OR "awesome-agent-skills" in:readme stars:>100',
  '"deepseek-harness" OR "browser-harness" OR "agent harness" in:readme stars:>100',
  'topic:llmops stars:>500',
  'topic:rag stars:>1000',
  'topic:vector-database stars:>500',
  'topic:model-serving stars:>500',

  // --- Core DevOps, Cloud-Native & Observability ---
  'topic:kubernetes stars:>5000',
  'topic:devops stars:>3000',
  'topic:terraform stars:>2000',
  'topic:ebpf stars:>1000',
  'topic:gitops stars:>1000',
  'topic:monitoring stars:>3000',
  'topic:opentelemetry stars:>1000',
  'topic:devsecops stars:>500',
  'topic:platform-engineering stars:>500',
];

// ====== CATEGORY CLASSIFICATION ======
export function determineCategories(topics: string[], desc: string, stars: number): CategoryId[] {
  const categories: CategoryId[] = [];
  const lowerDesc = (desc || '').toLowerCase();
  const lowerTopics = (topics || []).map(t => t.toLowerCase());

  // Agentic AI & AI
  const aiKeywords = [
    'ai', 'agent', 'llm', 'autonomous', 'gpt', 'rag', 'langchain', 'langgraph',
    'llama', 'deepseek', 'ollama', 'vllm', 'inference', 'embedding',
    'copilot', 'cursor', 'claude', 'openai', 'anthropic', 'gemini',
    'mcp', 'model-context', 'swe-agent', 'coding-agent', 'devin',
    'autogen', 'crewai', 'metagpt', 'agentic', 'multi-agent',
    'prompt', 'chatbot', 'transformer', 'fine-tun', 'lora', 'red-teaming',
    'ai-security', 'guardrail', 'jailbreak',
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
    'envoy', 'istio', 'linkerd', 'kustomize', 'opentofu', 'kong', 'netdata',
    'sre', 'reliability', 'incident', 'on-call', 'runbook', 'sysadmin',
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

// ====== ACCURATE VELOCITY & ATTENTION SCORING ======
export function calculateVelocity(
  stars: number,
  createdAt?: string,
  updatedAt?: string,
  extraSignals?: {
    isTrendingToday?: boolean;
    isTrendingWeekly?: boolean;
    hnTopScore?: number;
    devtoReactions?: number;
  }
): { score: number; label: RepoItem['velocityLabel']; hasBigUpdate?: boolean; growthText?: string } {
  const now = Date.now();
  const created = createdAt ? new Date(createdAt).getTime() : 0;
  const updated = updatedAt ? new Date(updatedAt).getTime() : now;
  
  // Calculate exact age in days
  const ageDays = created > 0 ? Math.max(1, (now - created) / (1000 * 60 * 60 * 24)) : 1000;
  const daysSinceUpdate = Math.max(0, (now - updated) / (1000 * 60 * 60 * 24));
  
  const starsPerDay = stars / ageDays;

  // 1. CLASSIC FIRST: Proven standards in the industry
  // Repos with >= 25k stars OR (>= 2 years old with >= 12k stars) OR (>= 3 years old with >= 8k stars)
  const isClassicStandard = stars >= 25000 || (ageDays >= 730 && stars >= 12000) || (ageDays >= 1095 && stars >= 8000);

  if (isClassicStandard) {
    // If a classic repo released an active update in the last 48h or has update signal
    const hasBigUpdate = daysSinceUpdate <= 3 && ((extraSignals?.hnTopScore || 0) > 20 || (extraSignals?.devtoReactions || 0) > 10);
    return {
      score: hasBigUpdate ? 96 : Math.min(95, 75 + Math.round(stars / 10000)),
      label: 'CLASSIC',
      hasBigUpdate,
      growthText: hasBigUpdate ? 'Active Major Release' : 'Proven Standard',
    };
  }

  // 2. EXPLOSIVE: Strictly for True Viral Phenomena (< 6 months old with massive traction)
  const isPhenomenon = 
    (extraSignals?.isTrendingToday && ageDays <= 180 && stars >= 1500) ||
    (ageDays <= 90 && starsPerDay >= 40 && stars >= 1500) ||
    ((extraSignals?.hnTopScore || 0) >= 250 && ageDays <= 120);

  if (isPhenomenon) {
    return {
      score: 99,
      label: 'EXPLOSIVE',
      growthText: extraSignals?.isTrendingToday
        ? 'Trending #1 Today'
        : `+${Math.round(starsPerDay)} stars/day • Viral Breakout`,
    };
  }

  // 3. COMMUNITY PICK: Viral on Hacker News or Dev.to
  if (
    (extraSignals?.hnTopScore && extraSignals.hnTopScore >= 40) ||
    (extraSignals?.devtoReactions && extraSignals.devtoReactions >= 20)
  ) {
    return {
      score: 92,
      label: 'COMMUNITY PICK',
      growthText: extraSignals?.hnTopScore
        ? `${extraSignals.hnTopScore} pts on Hacker News`
        : 'Featured on Dev.to',
    };
  }

  // 4. HOT RISING: Young projects with solid sustained upward growth
  if (ageDays <= 730 && starsPerDay >= 8 && stars >= 1000) {
    return {
      score: Math.min(94, 82 + Math.round(starsPerDay * 1.5)),
      label: 'HOT RISING',
      growthText: `+${Math.round(starsPerDay)} stars/day`,
    };
  }

  // 5. TOP RATED: Solid high-quality tools
  return {
    score: Math.min(88, 65 + Math.round(stars / 5000)),
    label: 'TOP RATED',
    growthText: `${Math.round(stars / 1000)}k stars`,
  };
}

// ====== GITHUB SEARCH API FETCHER ======
export async function fetchGitHubSearchRepos(headers: Record<string, string>): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  const token = !!headers['Authorization'];

  const queries = token ? SEARCH_QUERIES : SEARCH_QUERIES.slice(0, 10);

  for (const query of queries) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
      const res = await fetch(url, { headers, next: { revalidate: 3600 } });

      if (!res.ok) {
        console.warn(`GitHub Search API for "${query}" returned ${res.status}`);
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
            forks: item.forks_count,
            openIssues: item.open_issues_count,
            language: item.language || undefined,
            topics: item.topics || [],
            createdAt: item.created_at,
            updatedAt: item.updated_at,
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
