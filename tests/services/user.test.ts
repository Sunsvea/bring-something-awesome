import { describe, it, expect, vi } from "vitest";
import { UserService } from "../../src/services/user.js";
import { User } from "../../src/types/user.js";

describe("UserService", () => {
  const mockRepository = {
    findById: vi.fn(),
    create: vi.fn(),
  };

  const mockCache = {
    get: vi.fn(),
    set: vi.fn(),
  };

  const userService = new UserService(mockRepository, mockCache);

  describe("getUserById", () => {
    it("should return cached user if available", async () => {
      const mockUser: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      mockCache.get.mockResolvedValue(JSON.stringify(mockUser));

      const result = await userService.getUserById("123");

      expect(result).toEqual(mockUser);
      expect(mockCache.get).toHaveBeenCalledWith("user:123");
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it("should fetch from repository and cache if not in cache", async () => {
      const mockUser: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      mockCache.get.mockResolvedValue(null);
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById("123");

      expect(result).toEqual(mockUser);
      expect(mockCache.get).toHaveBeenCalledWith("user:123");
      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(mockCache.set).toHaveBeenCalledWith(
        "user:123",
        JSON.stringify(mockUser)
      );
    });
  });

  describe("createUser", () => {
    it("should create user and cache it", async () => {
      const mockUser: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date(),
      };

      const userData = {
        name: "Test User",
        email: "test@example.com",
      };

      mockRepository.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockCache.set).toHaveBeenCalledWith(
        "user:123",
        JSON.stringify(mockUser)
      );
    });
  });
});
