import { RepoItem, CategoryId, DiscoveredRepo, SocialSignals } from './types';
import { SEED_REPOSITORIES } from './seeds';
import { fetchGitHubTrending } from './sources/github-trending';
import { fetchHackerNewsRepos } from './sources/hackernews';
import { fetchDevToRepos } from './sources/devto';
import { fetchAwesomeListRepos } from './sources/awesome-lists';
import { fetchGitHubSearchRepos, determineCategories, calculateVelocity } from './github';

interface GitHubRepoMeta {
  full_name: string;
  name: string;
  owner: { login: string; avatar_url: string };
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

// Fetch metadata for a discovered repo from GitHub API
async function enrichRepoMetadata(fullName: string, headers: Record<string, string>): Promise<GitHubRepoMeta | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function buildSocialSignals(
  discoveredSources: Map<string, DiscoveredRepo[]>
): Map<string, SocialSignals> {
  const signals = new Map<string, SocialSignals>();

  for (const entry of Array.from(discoveredSources.entries())) {
    const key = entry[0];
    const sources = entry[1];
    const signal: SocialSignals = {};

    for (const src of sources) {
      switch (src.source) {
        case 'github-trending':
          signal.githubTrending = src.trendingPeriod || 'weekly';
          signal.trendingStarsToday = src.trendingStarsToday;
          break;
        case 'hackernews':
          signal.hnMentions = (signal.hnMentions || 0) + 1;
          signal.hnTopScore = Math.max(signal.hnTopScore || 0, src.hnPoints || 0);
          break;
        case 'devto':
          signal.devtoMentions = (signal.devtoMentions || 0) + 1;
          signal.devtoTopReactions = Math.max(signal.devtoTopReactions || 0, src.devtoReactions || 0);
          break;
        case 'awesome-list':
          if (!signal.awesomeLists) signal.awesomeLists = [];
          if (src.awesomeListName) {
            const lists = src.awesomeListName.split(', ');
            for (const l of lists) {
              if (!signal.awesomeLists.includes(l)) signal.awesomeLists.push(l);
            }
          }
          break;
      }
    }

    signals.set(key, signal);
  }

  return signals;
}

function calculateCommunityScore(
  stars: number,
  velocityScore: number,
  signals: SocialSignals
): number {
  let score = 0;

  // Stars weight (0-30)
  if (stars >= 100000) score += 30;
  else if (stars >= 50000) score += 25;
  else if (stars >= 10000) score += 20;
  else if (stars >= 5000) score += 15;
  else if (stars >= 1000) score += 10;
  else score += 5;

  // Velocity weight (0-30)
  score += Math.min(30, Math.round(velocityScore * 0.3));

  // Social signal weight (0-25)
  if (signals.githubTrending === 'daily') score += 15;
  else if (signals.githubTrending === 'weekly') score += 10;
  if (signals.hnTopScore && signals.hnTopScore > 100) score += 10;
  else if (signals.hnTopScore && signals.hnTopScore > 50) score += 5;
  if (signals.devtoMentions && signals.devtoMentions > 2) score += 5;
  else if (signals.devtoMentions && signals.devtoMentions > 0) score += 3;

  // Awesome list presence (0-15)
  if (signals.awesomeLists && signals.awesomeLists.length >= 3) score += 15;
  else if (signals.awesomeLists && signals.awesomeLists.length >= 2) score += 10;
  else if (signals.awesomeLists && signals.awesomeLists.length >= 1) score += 5;

  return Math.min(99, score);
}

function enhanceVelocityLabel(
  baseLabel: RepoItem['velocityLabel'],
  signals: SocialSignals,
  stars: number,
  communityScore: number
): RepoItem['velocityLabel'] {
  // If trending on GitHub daily → EXPLOSIVE
  if (signals.githubTrending === 'daily') return 'EXPLOSIVE';

  // If highly mentioned on HN + Dev.to but lower stars → COMMUNITY PICK
  const socialMentions = (signals.hnMentions || 0) + (signals.devtoMentions || 0);
  if (socialMentions >= 2 && stars < 10000 && communityScore > 50) return 'COMMUNITY PICK';
  if ((signals.hnTopScore || 0) > 150 && stars < 15000) return 'COMMUNITY PICK';

  return baseLabel;
}

export async function fetchAllSources(): Promise<RepoItem[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevOps-FOMO-Aggregator',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  // ====== Phase 1: Collect from all sources in parallel ======
  console.log('[Discovery] Starting multi-source collection...');

  const [trendingResult, hnResult, devtoResult, awesomeResult, searchResult] = await Promise.allSettled([
    fetchGitHubTrending(),
    fetchHackerNewsRepos(),
    fetchDevToRepos(),
    fetchAwesomeListRepos(),
    fetchGitHubSearchRepos(headers),
  ]);

  const trending = trendingResult.status === 'fulfilled' ? trendingResult.value : [];
  const hn = hnResult.status === 'fulfilled' ? hnResult.value : [];
  const devto = devtoResult.status === 'fulfilled' ? devtoResult.value : [];
  const awesome = awesomeResult.status === 'fulfilled' ? awesomeResult.value : [];
  const search = searchResult.status === 'fulfilled' ? searchResult.value : [];

  console.log(`[Discovery] Collected: Trending=${trending.length}, HN=${hn.length}, DevTo=${devto.length}, Awesome=${awesome.length}, Search=${search.length}`);

  // ====== Phase 2: Merge all discovered repos ======
  // Group all discoveries by repo key
  const discoveredSources = new Map<string, DiscoveredRepo[]>();
  const allDiscovered = [...trending, ...hn, ...devto, ...awesome, ...search];

  for (const disc of allDiscovered) {
    const key = disc.fullName.toLowerCase();
    const existing = discoveredSources.get(key) || [];
    existing.push(disc);
    discoveredSources.set(key, existing);
  }

  // ====== Phase 3: Build social signals map ======
  const socialSignalsMap = buildSocialSignals(discoveredSources);

  // ====== Phase 4: Enrich with GitHub metadata and build final RepoItem list ======
  const finalMap = new Map<string, RepoItem>();

  // Start with seed repos
  for (const seed of SEED_REPOSITORIES) {
    const key = seed.fullName.toLowerCase();
    const signals = socialSignalsMap.get(key) || {};
    finalMap.set(key, { ...seed, socialSignals: signals });
  }

  // Add search results (already have full metadata)
  for (const disc of search) {
    const key = disc.fullName.toLowerCase();
    if (finalMap.has(key)) {
      // Update social signals on existing
      const existing = finalMap.get(key)!;
      existing.socialSignals = {
        ...existing.socialSignals,
        ...socialSignalsMap.get(key),
      };
      continue;
    }
    // search results from github.ts already return RepoItem-compatible data
    // They need to be enriched via API — handled below
  }

  // Enrich repos discovered from non-GitHub-API sources
  // Batch enrich: collect unique repos that need metadata
  const needsEnrichment: string[] = [];
  for (const key of Array.from(discoveredSources.keys())) {
    if (!finalMap.has(key)) {
      needsEnrichment.push(key);
    }
  }

  // Limit enrichment calls to avoid API rate limits
  const maxEnrich = token ? 60 : 15;
  const toEnrich = needsEnrichment.slice(0, maxEnrich);

  // Enrich in batches of 5 to be gentle on API
  for (let i = 0; i < toEnrich.length; i += 5) {
    const batch = toEnrich.slice(i, i + 5);
    const enrichPromises = batch.map(key => {
      const sources = discoveredSources.get(key) || [];
      const firstSource = sources[0];
      return enrichRepoMetadata(firstSource.fullName, headers)
        .then(meta => ({ key, meta, sources }));
    });

    const enrichResults = await Promise.allSettled(enrichPromises);

    for (const result of enrichResults) {
      if (result.status !== 'fulfilled' || !result.value.meta) continue;

      const { key, meta, sources } = result.value;
      const signals = socialSignalsMap.get(key) || {};

      const categories = determineCategories(meta.topics || [], meta.description || '', meta.stargazers_count);
      const velocity = calculateVelocity(meta.stargazers_count, meta.created_at, meta.updated_at);

      if (velocity.label === 'EXPLOSIVE' || velocity.label === 'HOT RISING') {
        if (!categories.includes('trending')) categories.push('trending');
      }

      const communityScore = calculateCommunityScore(meta.stargazers_count, velocity.score, signals);
      const finalLabel = enhanceVelocityLabel(velocity.label, signals, meta.stargazers_count, communityScore);

      // Check if verified (in awesome list or high stars)
      const isVerified = !!(signals.awesomeLists && signals.awesomeLists.length > 0) || meta.stargazers_count > 5000;

      const repoItem: RepoItem = {
        id: meta.full_name,
        fullName: meta.full_name,
        name: meta.name,
        owner: meta.owner.login,
        ownerAvatar: meta.owner.avatar_url,
        description: meta.description || 'No description provided.',
        url: meta.html_url,
        stars: meta.stargazers_count,
        forks: meta.forks_count,
        openIssues: meta.open_issues_count,
        language: meta.language || 'Unknown',
        topics: (meta.topics || []).slice(0, 7),
        updatedAt: meta.updated_at,
        createdAt: meta.created_at,
        category: categories[0] || 'devops-infra',
        categories,
        isVerified,
        velocityScore: Math.max(velocity.score, communityScore),
        velocityLabel: finalLabel,
        socialSignals: signals,
      };

      finalMap.set(key, repoItem);
    }
  }

  // ====== Phase 5: Post-process existing repos with social signals ======
  for (const entry of Array.from(finalMap.entries())) {
    const key = entry[0];
    const repo = entry[1];
    const signals = socialSignalsMap.get(key);
    if (signals) {
      repo.socialSignals = { ...repo.socialSignals, ...signals };

      // Re-evaluate velocity label based on social signals
      const communityScore = calculateCommunityScore(repo.stars, repo.velocityScore || 0, signals);
      const enhanced = enhanceVelocityLabel(repo.velocityLabel, signals, repo.stars, communityScore);
      if (enhanced !== repo.velocityLabel) {
        repo.velocityLabel = enhanced;
        repo.velocityScore = Math.max(repo.velocityScore || 0, communityScore);
      }

      // Mark as verified if in awesome lists
      if (signals.awesomeLists && signals.awesomeLists.length > 0) {
        repo.isVerified = true;
      }

      // Add trending category if on GitHub Trending
      if (signals.githubTrending && !repo.categories.includes('trending')) {
        repo.categories.push('trending');
      }
    }
  }

  // ====== Phase 6: Sort by composite score and return ======
  const allRepos = Array.from(finalMap.values());
  
  // Filter: only keep repos with >= 500 stars (quality threshold)
  const qualityRepos = allRepos.filter(r => r.stars >= 500);

  console.log(`[Discovery] Final output: ${qualityRepos.length} quality repos from ${allRepos.length} total discovered`);

  return qualityRepos.sort((a, b) => b.stars - a.stars);
}
