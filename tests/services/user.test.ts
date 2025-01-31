import { describe, it, expect, beforeEach } from "@jest/globals";
import { UserService } from "../../src/services/user.js";
import { User } from "../../src/interfaces/user.js";

describe("UserService", () => {
  const mockRepository = {
    findById: jest.fn(),
    create: jest.fn(),
  };
  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
  };
  const userService = new UserService(mockRepository, mockCache);

  // Create a fixed date for testing
  const fixedDate = "2025-01-31T10:12:14.337Z";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should return cached user if available", async () => {
      const mockUser: User = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        createdAt: fixedDate, // Changed from new Date()
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
        createdAt: fixedDate, // Changed from new Date()
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
        createdAt: fixedDate, // Changed from new Date()
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
