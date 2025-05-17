import type { AxiosRequestConfig } from './types.ts';
import type { CacheConfig, CacheEntry } from './types.ts';

export class CacheManager {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.config = config;
  }

  public get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.config.ttl) {
      return entry;
    }
    this.cache.delete(key);
    return undefined;
  }

  public set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  public generateCacheKey(config: AxiosRequestConfig): string {
    const { url, method, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }
} 