import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { RedisCacheService } from "../../src/services/redis-cache.js";

describe("RedisCacheService", () => {
  let cacheService: RedisCacheService;

  beforeAll(() => {
    // Use database 1 for tests to avoid conflicts with dev data
    cacheService = new RedisCacheService("redis://localhost:6379/1");
  });

  beforeEach(async () => {
    // Clean the test DB before each test
    await cacheService.clear();
  });

  afterAll(async () => {
    await cacheService.disconnect();
  });

  it("should set and get a value", async () => {
    await cacheService.set("test-key", "test-value");
    const value = await cacheService.get("test-key");
    expect(value).toBe("test-value");
  });

  it("should respect TTL", async () => {
    await cacheService.set("test-key", "test-value", 1); // 1 second TTL
    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const value = await cacheService.get("test-key");
    expect(value).toBeNull();
  });

  it("should return null for non-existent key", async () => {
    const value = await cacheService.get("non-existent");
    expect(value).toBeNull();
  });
});
