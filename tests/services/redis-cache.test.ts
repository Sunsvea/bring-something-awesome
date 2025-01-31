// tests/services/redis-cache.test.ts
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import { RedisCacheService } from "../../src/services/redis-cache.js";

describe("RedisCacheService", () => {
  let cacheService: RedisCacheService;

  beforeAll(() => {
    // Use database 1 for tests to avoid conflicts
    cacheService = new RedisCacheService("redis://localhost:6379/1");
  });

  beforeEach(async () => {
    // Clean the test database before each test
    await cacheService.clear();
  });

  afterAll(async () => {
    // Clean shutdown after all tests
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
  }, 2000); // Increased timeout for this specific test

  it("should return null for non-existent key", async () => {
    const value = await cacheService.get("non-existent");
    expect(value).toBeNull();
  });
});
