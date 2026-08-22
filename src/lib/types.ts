export type CategoryId = 
  | 'trending'
  | 'agentic-ai'
  | 'devops-infra'
  | 'mlops'
  | 'architecture'
  | 'hall-of-fame'
  | 'favorites';

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
  velocityLabel?: 'EXPLOSIVE' | 'HOT RISING' | 'BATTLE-TESTED' | 'TOP RATED';
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
  language: string;
  sortBy: 'stars' | 'velocity' | 'updated';
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
