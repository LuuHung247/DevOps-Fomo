import { RepoItem, CategoryId, DiscoveredRepo, SocialSignals } from './types';
import { SEED_REPOSITORIES } from './seeds';
import { fetchGitHubTrending } from './sources/github-trending';
import { fetchHackerNewsRepos } from './sources/hackernews';
import { fetchDevToRepos } from './sources/devto';
import { fetchAwesomeListRepos } from './sources/awesome-lists';
import { fetchGitHubSearchRepos, determineCategories, calculateVelocity } from './github';

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

  // ====== Phase 4: Build final RepoItem list ======
  const finalMap = new Map<string, RepoItem>();

  // 1. Add all seed repos first
  for (const seed of SEED_REPOSITORIES) {
    const key = seed.fullName.toLowerCase();
    const signals = socialSignalsMap.get(key) || {};
    finalMap.set(key, { ...seed, socialSignals: signals });
  }

  // 2. Direct mapping for all search repos with REAL created_at and updated_at
  for (const disc of search) {
    const key = disc.fullName.toLowerCase();
    const signals = socialSignalsMap.get(key) || {};
    const parts = disc.fullName.split('/');
    const owner = parts[0] || 'github';
    const name = parts[1] || disc.fullName;
    const stars = disc.stars || 1000;
    const createdAt = disc.createdAt || '2023-01-01T00:00:00Z';
    const updatedAt = disc.updatedAt || new Date().toISOString();
    
    const categories = determineCategories(disc.topics || [], disc.description || '', stars);
    const velocity = calculateVelocity(stars, createdAt, updatedAt, {
      isTrendingToday: signals.githubTrending === 'daily',
      isTrendingWeekly: signals.githubTrending === 'weekly',
      hnTopScore: signals.hnTopScore,
      devtoReactions: signals.devtoTopReactions,
    });

    if (velocity.label === 'EXPLOSIVE' || velocity.label === 'HOT RISING' || velocity.label === 'BIG UPDATE') {
      if (!categories.includes('trending')) categories.push('trending');
    }

    if (!finalMap.has(key)) {
      finalMap.set(key, {
        id: disc.fullName,
        fullName: disc.fullName,
        name,
        owner,
        ownerAvatar: `https://avatars.githubusercontent.com/${owner}`,
        description: disc.description || 'Verified open-source repository.',
        url: disc.url,
        stars,
        forks: disc.forks || Math.round(stars * 0.12),
        openIssues: disc.openIssues || Math.round(stars * 0.01),
        language: disc.language || 'Code',
        topics: (disc.topics && disc.topics.length > 0) ? disc.topics.slice(0, 7) : categories,
        updatedAt,
        createdAt,
        category: categories[0] || 'devops-infra',
        categories,
        isVerified: stars > 5000,
        velocityScore: velocity.score,
        velocityLabel: velocity.label,
        growthDeltaText: velocity.growthText,
        socialSignals: signals,
      });
    } else {
      const existing = finalMap.get(key)!;
      existing.socialSignals = { ...existing.socialSignals, ...signals };
    }
  }

  // 3. Direct mapping for Trending repos
  for (const disc of trending) {
    const key = disc.fullName.toLowerCase();
    const signals = socialSignalsMap.get(key) || {};
    const parts = disc.fullName.split('/');
    const owner = parts[0] || 'github';
    const name = parts[1] || disc.fullName;
    const stars = disc.stars || 3500;

    const categories = determineCategories([], disc.description || name, stars);
    if (!categories.includes('trending')) categories.push('trending');

    if (!finalMap.has(key)) {
      finalMap.set(key, {
        id: disc.fullName,
        fullName: disc.fullName,
        name,
        owner,
        ownerAvatar: `https://avatars.githubusercontent.com/${owner}`,
        description: disc.description || `Trending project on GitHub (${disc.trendingPeriod || 'daily'}).`,
        url: disc.url,
        stars,
        forks: Math.round(stars * 0.1),
        openIssues: 12,
        language: disc.language || 'Code',
        topics: categories,
        updatedAt: new Date().toISOString(),
        createdAt: '2024-10-01T00:00:00Z',
        category: categories[0] || 'agentic-ai',
        categories,
        isVerified: true,
        velocityScore: 99,
        velocityLabel: 'EXPLOSIVE',
        growthDeltaText: disc.trendingPeriod === 'daily' ? 'Trending #1 Today' : 'Weekly Trending',
        socialSignals: { ...signals, githubTrending: disc.trendingPeriod || 'daily' },
      });
    }
  }

  // 4. Direct mapping for HackerNews / Dev.to / AwesomeList repos
  for (const disc of [...hn, ...devto, ...awesome]) {
    const key = disc.fullName.toLowerCase();
    const signals = socialSignalsMap.get(key) || {};
    const parts = disc.fullName.split('/');
    if (parts.length !== 2) continue;
    const owner = parts[0];
    const name = parts[1];

    if (!finalMap.has(key)) {
      const stars = disc.stars || (disc.hnPoints ? disc.hnPoints * 35 : 2500);
      const categories = determineCategories([], disc.description || name, stars);

      finalMap.set(key, {
        id: disc.fullName,
        fullName: disc.fullName,
        name,
        owner,
        ownerAvatar: `https://avatars.githubusercontent.com/${owner}`,
        description: disc.description || `Recommended tool mentioned in tech community.`,
        url: disc.url,
        stars,
        forks: Math.round(stars * 0.1),
        openIssues: 8,
        language: disc.language || 'Code',
        topics: categories,
        updatedAt: new Date().toISOString(),
        createdAt: '2024-06-01T00:00:00Z',
        category: categories[0] || 'devops-infra',
        categories,
        isVerified: true,
        velocityScore: 92,
        velocityLabel: 'COMMUNITY PICK',
        growthDeltaText: disc.hnPoints ? `${disc.hnPoints} pts on Hacker News` : 'Tech Community Pick',
        socialSignals: signals,
      });
    }
  }

  // ====== Phase 5: Recalculate and normalize all items ======
  for (const entry of Array.from(finalMap.entries())) {
    const key = entry[0];
    const repo = entry[1];
    const signals = socialSignalsMap.get(key);
    if (signals) {
      repo.socialSignals = { ...repo.socialSignals, ...signals };

      // Re-run calculateVelocity with all signals
      const velocity = calculateVelocity(repo.stars, repo.createdAt, repo.updatedAt, {
        isTrendingToday: signals.githubTrending === 'daily',
        isTrendingWeekly: signals.githubTrending === 'weekly',
        hnTopScore: signals.hnTopScore,
        devtoReactions: signals.devtoTopReactions,
      });

      repo.velocityScore = velocity.score;
      repo.velocityLabel = velocity.label;
      if (velocity.growthText && !repo.growthDeltaText) {
        repo.growthDeltaText = velocity.growthText;
      }

      if (signals.awesomeLists && signals.awesomeLists.length > 0) {
        repo.isVerified = true;
      }

      if ((signals.githubTrending || velocity.label === 'EXPLOSIVE' || velocity.label === 'HOT RISING' || velocity.label === 'BIG UPDATE') && !repo.categories.includes('trending')) {
        repo.categories.push('trending');
      }
    }
  }

  const allRepos = Array.from(finalMap.values());
  console.log(`[Discovery] Final output: ${allRepos.length} total repos correctly classified`);

  return allRepos.sort((a, b) => (b.velocityScore || 0) - (a.velocityScore || 0));
}
