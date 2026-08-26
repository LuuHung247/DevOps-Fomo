import fs from 'fs';
import path from 'path';
import os from 'os';
import { RepoItem } from './types';
import { SEED_REPOSITORIES } from './seeds';

interface CacheEntry {
  timestamp: number;
  data: RepoItem[];
}

// In-memory cache initialized with 0 timestamp so it immediately triggers full multi-source discovery on first visit
let memoryCache: { [key: string]: CacheEntry } = {
  all: {
    timestamp: 0,
    data: SEED_REPOSITORIES,
  },
};

// Use os.tmpdir() for serverless/lambda resilience (writable everywhere)
const CACHE_DIR = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'repos_cache.json');
const DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes freshness

export function isCacheStale(key: string = 'all', ttlMs: number = DEFAULT_TTL_MS): boolean {
  const now = Date.now();
  if (memoryCache[key]) {
    // If the cache only contains the baseline seeds (<= 40), treat it as stale so it immediately discovers more
    if (memoryCache[key].data.length <= SEED_REPOSITORIES.length) {
      return true;
    }
    return (now - memoryCache[key].timestamp) >= ttlMs;
  }
  return true;
}

export function getCachedRepos(
  key: string = 'all',
  ttlMs: number = DEFAULT_TTL_MS,
  allowStale: boolean = true
): RepoItem[] {
  const now = Date.now();

  // 1. Check memory cache (if fresh or if allowStale is true)
  if (memoryCache[key] && memoryCache[key].data.length > 0) {
    const isFresh = (now - memoryCache[key].timestamp) < ttlMs;
    if (isFresh || allowStale) {
      return memoryCache[key].data;
    }
  }

  // 2. Check disk cache
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed: { [k: string]: CacheEntry } = JSON.parse(raw);
      if (parsed[key] && parsed[key].data && parsed[key].data.length > 0) {
        memoryCache[key] = parsed[key];
        const isFresh = (now - parsed[key].timestamp) < ttlMs;
        if (isFresh || allowStale) {
          return parsed[key].data;
        }
      }
    }
  } catch (err) {
    console.error('Cache read error:', err);
  }

  // 3. Fallback: Always return SEED_REPOSITORIES so UI never experiences empty state
  if (!memoryCache[key] || memoryCache[key].data.length === 0) {
    memoryCache[key] = {
      timestamp: 0,
      data: SEED_REPOSITORIES,
    };
  }

  return memoryCache[key].data;
}

export function setCachedRepos(key: string, data: RepoItem[]): void {
  if (!data || data.length === 0) return;

  const entry: CacheEntry = {
    timestamp: Date.now(),
    data,
  };

  memoryCache[key] = entry;

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    let existing: { [k: string]: CacheEntry } = {};
    if (fs.existsSync(CACHE_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch {
        existing = {};
      }
    }

    existing[key] = entry;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(existing, null, 2), 'utf-8');
  } catch (err) {
    console.error('Cache write error:', err);
  }
}
