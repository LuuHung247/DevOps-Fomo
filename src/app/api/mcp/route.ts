import { NextResponse } from 'next/server';

const BASE_URL = 'https://dev-ops-fomo.vercel.app';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool, arguments: args } = body;

    if (tool === 'get_trending_repos') {
      const params = new URLSearchParams();
      if (args?.category) params.set('category', args.category);
      if (args?.sortBy) params.set('sortBy', args.sortBy);
      if (args?.search) params.set('search', args.search);
      if (args?.minStars) params.set('minStars', String(args.minStars));

      const res = await fetch(`${BASE_URL}/api/repos?${params.toString()}`);
      const data = await res.json();

      // Limit results if specified
      const limit = args?.limit || 20;
      data.repos = data.repos.slice(0, limit);

      return NextResponse.json({
        result: data,
        tool: 'get_trending_repos',
      });
    }

    if (tool === 'get_community_buzz') {
      const res = await fetch(`${BASE_URL}/api/buzz`);
      const data = await res.json();

      // Filter by source if specified
      if (args?.source && args.source !== 'all') {
        data.items = data.items.filter((item: { source: string }) => item.source === args.source);
      }

      return NextResponse.json({
        result: data,
        tool: 'get_community_buzz',
      });
    }

    return NextResponse.json(
      { error: `Unknown tool: ${tool}. Available tools: get_trending_repos, get_community_buzz` },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON with { tool: string, arguments: object }' },
      { status: 400 }
    );
  }
}

// GET returns the tool manifest for discovery
export async function GET() {
  return NextResponse.json({
    name: 'devops-fomo',
    description: 'Real-time intelligence on trending GitHub repos with multi-signal velocity scoring.',
    version: '1.0.0',
    tools: [
      {
        name: 'get_trending_repos',
        description: 'Get trending GitHub repositories sorted by multi-signal velocity score.',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: ['trending', 'agentic-ai', 'devops-infra', 'mlops', 'architecture'], default: 'trending' },
            sortBy: { type: 'string', enum: ['velocity', 'stars', 'updated'], default: 'velocity' },
            search: { type: 'string' },
            minStars: { type: 'integer', default: 0 },
            limit: { type: 'integer', default: 20, maximum: 100 },
          },
        },
      },
      {
        name: 'get_community_buzz',
        description: 'Get aggregated tech news from Hacker News, Reddit, and Dev.to.',
        inputSchema: {
          type: 'object',
          properties: {
            source: { type: 'string', enum: ['all', 'hn', 'reddit', 'devto'], default: 'all' },
          },
        },
      },
    ],
  });
}
