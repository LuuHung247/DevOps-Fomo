import { NextResponse } from 'next/server';
import { BuzzItem, BuzzApiResponse } from '@/lib/types';

// Keywords to filter relevant AI/DevOps content
const RELEVANCE_KEYWORDS = [
  'ai', 'llm', 'agent', 'gpt', 'claude', 'gemini', 'deepseek', 'qwen', 'mistral',
  'devops', 'kubernetes', 'k8s', 'docker', 'terraform', 'ansible', 'ci/cd', 'pipeline',
  'mlops', 'rag', 'vector', 'embedding', 'mcp', 'openai', 'anthropic',
  'copilot', 'cursor', 'cline', 'github', 'coding agent', 'agentic',
  'ollama', 'langchain', 'langgraph', 'open source', 'model', 'inference',
  'security', 'pentest', 'vulnerability', 'supply chain', 'devsecops',
  'strix', 'openclaw', 'prime-agent', 'bumblebee', 'mastra',
];

function isRelevant(title: string): boolean {
  const lower = title.toLowerCase();
  return RELEVANCE_KEYWORDS.some(kw => lower.includes(kw));
}

function timeAgo(unixSeconds: number): string {
  const seconds = Math.floor(Date.now() / 1000) - unixSeconds;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ── Hacker News ──────────────────────────────────────────────────────────────
async function fetchHN(): Promise<BuzzItem[]> {
  try {
    const res = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return [];

    const ids: number[] = await res.json();
    const top40 = ids.slice(0, 40);

    const stories = await Promise.allSettled(
      top40.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          next: { revalidate: 900 },
        }).then(r => r.json())
      )
    );

    const items: BuzzItem[] = [];
    for (const result of stories) {
      if (result.status !== 'fulfilled') continue;
      const s = result.value;
      if (!s || s.type !== 'story' || !s.title || !s.url) continue;
      if (!isRelevant(s.title)) continue;

      items.push({
        id: `hn-${s.id}`,
        title: s.title,
        url: s.url,
        source: 'hn',
        score: s.score || 0,
        commentCount: s.descendants || 0,
        author: s.by || 'unknown',
        createdAt: timeAgo(s.time),
        domain: s.url ? new URL(s.url).hostname.replace('www.', '') : 'news.ycombinator.com',
      });
    }

    return items.sort((a, b) => b.score - a.score).slice(0, 20);
  } catch {
    return [];
  }
}

// ── Reddit ────────────────────────────────────────────────────────────────────
const SUBREDDITS = ['LocalLLaMA', 'MachineLearning', 'devops', 'kubernetes', 'netsec'];

async function fetchReddit(): Promise<BuzzItem[]> {
  const items: BuzzItem[] = [];

  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=20`,
        {
          headers: { 'User-Agent': 'DevOps-FOMO/1.0 (trending AI/DevOps aggregator)' },
          next: { revalidate: 900 },
        }
      );
      if (!res.ok) continue;

      const data = await res.json();
      const posts = data?.data?.children || [];

      for (const { data: p } of posts) {
        if (!p?.title || p.stickied) continue;
        if (!isRelevant(p.title) && !isRelevant(p.selftext?.slice(0, 200) || '')) continue;

        const url = p.url?.startsWith('http') ? p.url : `https://reddit.com${p.permalink}`;
        items.push({
          id: `reddit-${p.id}`,
          title: p.title,
          url,
          source: 'reddit',
          subreddit: sub,
          score: p.score || 0,
          commentCount: p.num_comments || 0,
          author: p.author || 'unknown',
          createdAt: timeAgo(Math.floor(p.created_utc)),
          domain: url.startsWith('https://reddit.com') ? `r/${sub}` : new URL(url).hostname.replace('www.', ''),
        });
      }
    } catch {
      // skip this subreddit on error
    }
  }

  return items.sort((a, b) => b.score - a.score).slice(0, 20);
}

// ── Dev.to ────────────────────────────────────────────────────────────────────
const DEVTO_TAGS = ['ai', 'devops', 'llm', 'kubernetes', 'machinelearning', 'security'];

async function fetchDevTo(): Promise<BuzzItem[]> {
  const items: BuzzItem[] = [];
  const seen = new Set<string>();

  for (const tag of DEVTO_TAGS) {
    try {
      const res = await fetch(
        `https://dev.to/api/articles?tag=${tag}&top=7&per_page=10`,
        { next: { revalidate: 900 } }
      );
      if (!res.ok) continue;

      const articles = await res.json();
      for (const a of articles) {
        if (seen.has(a.id.toString())) continue;
        if (!isRelevant(a.title)) continue;
        seen.add(a.id.toString());

        items.push({
          id: `devto-${a.id}`,
          title: a.title,
          url: a.url,
          source: 'devto',
          score: (a.positive_reactions_count || 0) + (a.public_reactions_count || 0),
          commentCount: a.comments_count || 0,
          author: a.user?.name || a.user?.username || 'unknown',
          createdAt: a.published_at ? timeAgo(Math.floor(new Date(a.published_at).getTime() / 1000)) : '?',
          domain: 'dev.to',
          tags: a.tag_list || [],
        });
      }
    } catch {
      // skip tag on error
    }
  }

  return items.sort((a, b) => b.score - a.score).slice(0, 20);
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function GET() {
  const [hn, reddit, devto] = await Promise.allSettled([
    fetchHN(),
    fetchReddit(),
    fetchDevTo(),
  ]);

  const hnItems = hn.status === 'fulfilled' ? hn.value : [];
  const redditItems = reddit.status === 'fulfilled' ? reddit.value : [];
  const devtoItems = devto.status === 'fulfilled' ? devto.value : [];

  // Interleave sources: 2 HN, 2 Reddit, 1 Devto pattern
  const merged: BuzzItem[] = [];
  const maxLen = Math.max(hnItems.length, redditItems.length, devtoItems.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < hnItems.length) merged.push(hnItems[i]);
    if (i < redditItems.length) merged.push(redditItems[i]);
    if (i < devtoItems.length) merged.push(devtoItems[i]);
  }

  const response: BuzzApiResponse = {
    items: merged.slice(0, 60),
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=1800' },
  });
}
