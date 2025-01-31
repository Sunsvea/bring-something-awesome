import IORedis from "ioredis";
import { CacheService } from "../interfaces/cache.js";

export class RedisCacheService implements CacheService {
  private client: IORedis;

  constructor(redisUrl?: string) {
    //  config
    this.client = new IORedis(
      redisUrl || process.env.REDIS_URL || "redis://localhost:6379"
    );

    //  error handling
    this.client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    //  successful connections (debug)
    this.client.on("connect", () => {
      console.log("Successfully connected to Redis");
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    // Use EX option for TTL in seconds
    await this.client.set(key, value, "EX", ttlSeconds);
  }

  async clear(): Promise<void> {
    await this.client.flushall();
  }

  // graceful shutdown
  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
