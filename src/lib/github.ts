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
  openIssues_count?: number;
  open_issues_count?: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
}

// ====== ZERO-KEYWORD DYNAMIC SEARCH ENGINE ======
// Generates rolling time-window queries to capture brand new breakout projects
// regardless of how they are named or tagged (TikTok/Trend style)
export function getDynamicSearchQueries(): string[] {
  const now = new Date();
  
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const daysAgo = (days: number) => {
    const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return formatDate(d);
  };

  const d7 = daysAgo(7);
  const d14 = daysAgo(14);
  const d30 = daysAgo(30);
  const d60 = daysAgo(60);
  const d90 = daysAgo(90);
  const d3 = daysAgo(3);

  return [
    // 1. Zero-Keyword Accelerators: Fastest rising newborn repos globally
    `created:>${d7} stars:>30`,
    `created:>${d14} stars:>60`,
    `created:>${d30} stars:>120`,
    `created:>${d60} stars:>250`,
    `created:>${d90} stars:>500`,

    // 2. Fresh pushes on high-traction projects (Active velocity)
    `pushed:>${d3} stars:>3000 topic:ai`,
    `pushed:>${d3} stars:>3000 topic:agent`,
    `pushed:>${d3} stars:>2000 topic:devops`,

    // 3. AI Agent Skills, Harnesses, MCP & Security Routers
    'topic:agent-skills OR topic:claude-skills OR topic:skills stars:>100',
    'topic:agentic-ai OR topic:ai-agent OR topic:ai-agents stars:>300',
    'topic:mcp OR "model context protocol" in:readme stars:>150',
    '"agent skills" OR "claude skills" OR "awesome-agent-skills" in:readme stars:>100',
    '"deepseek-harness" OR "browser-harness" OR "agent harness" in:readme stars:>100',
    '"reverse-skill" OR "reverse engineering" agent in:readme stars:>50',
    'topic:reverse-engineering stars:>200',

    // 4. AI Security, Penetration Testing & Red Teaming
    'topic:ai-security OR topic:red-teaming OR topic:devsecops stars:>150',
    'topic:penetration-testing OR topic:pentesting OR topic:vulnerability-scanner stars:>200',
    'strix OR "AI Red Teaming" OR "AI penetration testing" in:readme stars:>100',
    'topic:prompt-injection OR topic:jailbreak OR topic:guardrail stars:>150',

    // 5. Local-first AI, Privacy & RLM
    'topic:local-ai OR topic:local-llm OR topic:privacy-ai stars:>300',
    'topic:ollama OR "local ai" in:readme stars:>500',
    'topic:rlm OR topic:self-improving-agent stars:>100',
    '"prime-agent" OR "recursive language model" in:readme stars:>100',

    // 6. Supply Chain Security, Voice Agents & DevOps
    'topic:supply-chain OR topic:sbom OR topic:appsec stars:>150',
    'topic:voice-agent OR topic:speech-ai stars:>200',
    'topic:kubernetes stars:>3000',
    'topic:devops stars:>2000',
    'topic:terraform stars:>1500',
    'topic:ebpf stars:>800',
    'topic:gitops stars:>800',
    'topic:opentelemetry stars:>800',
  ];
}

// ====== CATEGORY CLASSIFICATION (Smart Semantic Matching) ======
export function determineCategories(topics: string[], desc: string, stars: number): CategoryId[] {
  const categories: CategoryId[] = [];
  const lowerDesc = (desc || '').toLowerCase();
  const lowerTopics = (topics || []).map(t => t.toLowerCase());

  // Agentic AI & AI Keywords (Modern expanded coverage)
  const aiKeywords = [
    'ai', 'agent', 'agents', 'llm', 'llms', 'autonomous', 'gpt', 'rag', 'langchain', 'langgraph',
    'llama', 'deepseek', 'ollama', 'vllm', 'inference', 'embedding', 'vector',
    'copilot', 'cursor', 'claude', 'openai', 'anthropic', 'gemini', 'qwen', 'mistral',
    'mcp', 'model-context', 'swe-agent', 'coding-agent', 'devin', 'cline',
    'autogen', 'crewai', 'metagpt', 'agentic', 'multi-agent', 'harness', 'skill', 'skills',
    'prompt', 'chatbot', 'transformer', 'fine-tun', 'lora', 'red-teaming',
    'ai-security', 'guardrail', 'jailbreak', 'reverse-engineering', 'reverse-skill',
    'voice-agent', 'speech', 'transcribe', 'tts', 'stt', 'browser-use', 'automation',
    'crawler', 'scraper', 'memory', 'context', 'workflow',
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
    'supply-chain', 'sbom', 'security', 'pentest', 'vulnerability', 'appsec',
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
    'label', 'annotation', 'dataset', 'distill', 'benchmark',
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
    'learning-path', 'tutorial', 'handbook', 'reference', 'pattern', 'diagram',
  ];
  const hasArch = lowerTopics.some(t => archKeywords.some(k => t.includes(k))) ||
                  archKeywords.some(k => lowerDesc.includes(k));
  if (hasArch) {
    categories.push('architecture');
  }

  // Default fallback if empty — if it has stars or trending signal, classify into agentic-ai or devops-infra
  if (categories.length === 0) {
    categories.push('agentic-ai');
    categories.push('devops-infra');
  }

  return categories;
}

// ====== MULTI-SIGNAL VELOCITY & ATTENTION SCORING (v2 — 5-Tier System) ======
export function calculateVelocity(
  stars: number,
  createdAt?: string,
  updatedAt?: string,
  extraSignals?: {
    isTrendingToday?: boolean;
    isTrendingWeekly?: boolean;
    hnTopScore?: number;
    devtoReactions?: number;
    trendingStarsToday?: number;
  }
): { score: number; label: RepoItem['velocityLabel']; hasBigUpdate?: boolean; growthText?: string } {
  const now = Date.now();
  const created = createdAt ? new Date(createdAt).getTime() : 0;
  const updated = updatedAt ? new Date(updatedAt).getTime() : now;
  
  const ageDays = created > 0 ? Math.max(1, (now - created) / (1000 * 60 * 60 * 24)) : 1000;
  const daysSinceUpdate = Math.max(0, (now - updated) / (1000 * 60 * 60 * 24));
  
  const starsPerDay = stars / ageDays;
  const hnScore = extraSignals?.hnTopScore || 0;
  const devtoReactions = extraSignals?.devtoReactions || 0;
  const trendingToday = !!extraSignals?.isTrendingToday;
  const todayStars = extraSignals?.trendingStarsToday || 0;

  // Effective daily velocity: use trendingStarsToday if available (more accurate than lifetime average)
  const effectiveVelocity = todayStars > 0 ? Math.max(starsPerDay, todayStars) : starsPerDay;

  // Staleness penalty: repos not updated in 30+ days get score reduction
  const stalenessPenalty = daysSinceUpdate > 90 ? -8 : daysSinceUpdate > 60 ? -5 : daysSinceUpdate > 30 ? -2 : 0;

  // ──────────────────────────────────────────────────────────────
  // TIER 1: ESTABLISHED — Mature industry standards (10k+ stars)
  //   Evaluated FIRST to prevent mega-repos from falsely triggering
  //   viral alerts. They get their own dignified tier.
  // ──────────────────────────────────────────────────────────────
  const isEstablished = stars >= 25000 || (ageDays >= 730 && stars >= 12000) || (ageDays >= 1095 && stars >= 8000);

  if (isEstablished) {
    const hasBigUpdate = daysSinceUpdate <= 3 && (hnScore > 20 || devtoReactions > 10);
    return {
      score: hasBigUpdate ? 96 : Math.min(88, 75 + Math.round(stars / 10000)),
      label: 'ESTABLISHED',
      hasBigUpdate,
      growthText: hasBigUpdate ? 'Active Major Release' : `${Math.round(stars / 1000)}k stars • Proven Standard`,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // TIER 2: VIRAL BREAKOUT — True viral phenomena ONLY
  //   Much higher bar than before: 1,500+ stars AND 50+ stars/day
  // ──────────────────────────────────────────────────────────────
  const isViralBreakout = 
    // Young repo with extreme velocity
    (ageDays <= 90 && effectiveVelocity >= 50 && stars >= 1500) ||
    // Currently trending on GitHub AND substantial size
    (trendingToday && ageDays <= 180 && stars >= 2000) ||
    // Massive HN virality on a young repo
    (hnScore >= 300 && ageDays <= 60 && stars >= 500) ||
    // Ultra-fast newborn: created in last 14 days with insane traction
    (ageDays <= 14 && stars >= 800 && effectiveVelocity >= 80);

  if (isViralBreakout) {
    const velocityText = todayStars > 0 ? `+${todayStars} stars today` : `+${Math.round(effectiveVelocity)} stars/day`;
    return {
      score: 99,
      label: 'EXPLOSIVE',
      growthText: trendingToday
        ? `${velocityText} • Viral Breakout`
        : `${velocityText} • Viral Breakout`,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // TIER 3: HOT RISING — Strong sustained upward momentum
  // ──────────────────────────────────────────────────────────────
  const isHotRising =
    (ageDays <= 365 && effectiveVelocity >= 15 && stars >= 500) ||
    (trendingToday && stars >= 800) ||
    (hnScore >= 100 && stars >= 300) ||
    (ageDays <= 180 && effectiveVelocity >= 10 && stars >= 300);

  if (isHotRising) {
    const rawScore = 92 + Math.min(4, Math.round(effectiveVelocity / 15));
    const velocityText = todayStars > 0 ? `+${todayStars} stars today` : `+${Math.round(effectiveVelocity)} stars/day`;
    return {
      score: Math.max(92, Math.min(96, rawScore + stalenessPenalty)),
      label: 'HOT RISING',
      growthText: velocityText,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // TIER 4: COMMUNITY PICK — Validated by developer discussion
  // ──────────────────────────────────────────────────────────────
  if (hnScore >= 35 || devtoReactions >= 20) {
    return {
      score: Math.max(85, Math.min(92, 88 + stalenessPenalty)),
      label: 'COMMUNITY PICK',
      growthText: hnScore >= 35
        ? `${hnScore} pts on Hacker News`
        : `${devtoReactions} reactions on Dev.to`,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // TIER 5: EARLY GEM — Promising new projects with real traction
  //   Honest labeling for repos that aren't viral yet but show promise
  // ──────────────────────────────────────────────────────────────
  const isEarlyGem =
    (stars < 1500 && effectiveVelocity >= 8 && ageDays <= 60) ||
    (ageDays <= 14 && stars >= 100) ||
    (ageDays <= 30 && stars >= 150 && effectiveVelocity >= 5) ||
    (trendingToday && stars < 800);

  if (isEarlyGem) {
    const rawScore = 85 + Math.min(6, Math.round(effectiveVelocity));
    const velocityText = todayStars > 0 ? `+${todayStars} stars today` : `+${Math.round(effectiveVelocity)} stars/day`;
    return {
      score: Math.max(85, Math.min(91, rawScore + stalenessPenalty)),
      label: 'EARLY GEM',
      growthText: `${velocityText} • Early Gem`,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // FALLBACK: ESTABLISHED for anything else with decent stars
  // ──────────────────────────────────────────────────────────────
  return {
    score: Math.max(60, Math.min(84, 65 + Math.round(stars / 5000) + stalenessPenalty)),
    label: 'ESTABLISHED',
    growthText: stars >= 1000 ? `${(stars / 1000).toFixed(1)}k stars` : `${stars} stars`,
  };
}

// ====== GITHUB SEARCH API FETCHER ======
export async function fetchGitHubSearchRepos(headers: Record<string, string>): Promise<DiscoveredRepo[]> {
  const results: DiscoveredRepo[] = [];
  const token = !!headers['Authorization'];
  const queries = getDynamicSearchQueries();
  // Limit to high-signal queries to avoid secondary rate limits
  const activeQueries = token ? queries.slice(0, 10) : queries.slice(0, 5);

  const fetchPromises = activeQueries.map(async (query) => {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=25`;
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(3000),
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        return (data.items as GitHubApiItem[]).map((item) => ({
          fullName: item.full_name,
          url: item.html_url,
          description: item.description || '',
          stars: item.stargazers_count,
          forks: item.forks_count,
          openIssues: item.open_issues_count || item.openIssues_count || 0,
          language: item.language || undefined,
          topics: item.topics || [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          source: 'github-search' as const,
        }));
      }
      return [];
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
  const seen = new Map<string, DiscoveredRepo>();
  for (const repo of results) {
    const key = repo.fullName.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, repo);
    }
  }

  return Array.from(seen.values());
}
