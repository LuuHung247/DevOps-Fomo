export type CategoryId = 
  | 'trending'
  | 'agentic-ai'
  | 'devops-infra'
  | 'mlops'
  | 'architecture'
  | 'hall-of-fame';

export interface SocialSignals {
  hnMentions?: number;
  hnTopScore?: number;
  devtoMentions?: number;
  devtoTopReactions?: number;
  awesomeLists?: string[];
  githubTrending?: 'daily' | 'weekly' | null;
  trendingStarsToday?: number;
}

export interface RepoItem {
  id: string;
  fullName: string;
  name: string;
  owner: string;
  ownerAvatar: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  topics: string[];
  updatedAt: string;
  createdAt: string;
  category: CategoryId;
  categories: CategoryId[];
  isVerified?: boolean;
  velocityScore?: number;
  velocityLabel?: 'EXPLOSIVE' | 'HOT RISING' | 'COMMUNITY PICK' | 'CLASSIC' | 'BIG UPDATE' | 'TOP RATED';
  socialSignals?: SocialSignals;
  isMajorUpdate?: boolean;
  growthDeltaText?: string;
  daysSinceUpdate?: number;
}

export interface DiscoveredRepo {
  fullName: string;
  url: string;
  description?: string;
  stars?: number;
  language?: string;
  source: 'github-trending' | 'github-search' | 'hackernews' | 'devto' | 'awesome-list' | 'seed';
  socialScore?: number;
  trendingPeriod?: 'daily' | 'weekly';
  trendingStarsToday?: number;
  hnPoints?: number;
  hnComments?: number;
  devtoReactions?: number;
  awesomeListName?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  description: string;
  badgeCount?: number;
}

export interface FilterOptions {
  search: string;
  category: CategoryId;
  minStars: number;
  timeRange?: 'today' | 'week' | 'month' | 'all';
  sortBy: 'velocity' | 'stars' | 'updated';
}

export interface ReposApiResponse {
  repos: RepoItem[];
  total: number;
  cached: boolean;
  cacheTime: string;
  stats: {
    totalRepos: number;
    totalStars: number;
    trendingCount: number;
    categoryCounts: Record<CategoryId, number>;
  };
}
