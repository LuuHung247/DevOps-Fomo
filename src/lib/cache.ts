import fs from 'fs';
import path from 'path';
import os from 'os';
import { RepoItem } from './types';

interface CacheEntry {
  timestamp: number;
  data: RepoItem[];
}

// In-memory cache
let memoryCache: { [key: string]: CacheEntry } = {};

// Use os.tmpdir() for serverless/lambda resilience (writable everywhere)
const CACHE_DIR = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'repos_cache.json');
const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1 hour

export function getCachedRepos(key: string = 'all', ttlMs: number = DEFAULT_TTL_MS): RepoItem[] | null {
  const now = Date.now();

  // 1. Check memory cache
  if (memoryCache[key] && (now - memoryCache[key].timestamp < ttlMs)) {
    return memoryCache[key].data;
  }

  // 2. Check disk cache
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed: { [k: string]: CacheEntry } = JSON.parse(raw);
      if (parsed[key] && (now - parsed[key].timestamp < ttlMs)) {
        memoryCache[key] = parsed[key];
        return parsed[key].data;
      }
    }
  } catch (err) {
    console.error('Cache read error:', err);
  }

  return null;
}

export function setCachedRepos(key: string, data: RepoItem[]): void {
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
