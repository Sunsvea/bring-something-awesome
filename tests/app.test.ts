import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { createApp } from "../src/app.js";
import { UserService } from "../src/services/user.js";

describe("App", () => {
  const mockUserService = {
    getUserById: jest.fn(),
    createUser: jest.fn(),
  };
  const app = createApp(mockUserService as unknown as UserService);

  // Create a fixed date for testing
  const fixedDate = "2025-01-31T10:12:14.337Z";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users/:id", () => {
    it("should return user when found", async () => {
      const mockUser = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        createdAt: fixedDate,
      };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const response = await request(app).get("/users/123");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 404 when user not found", async () => {
      mockUserService.getUserById.mockResolvedValue(null);
      const response = await request(app).get("/users/123");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });
  });

  describe("POST /users", () => {
    it("should create user with valid data", async () => {
      const mockUser = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        createdAt: fixedDate,
      };
      mockUserService.createUser.mockResolvedValue(mockUser);

      const response = await request(app).post("/users").send({
        name: "Test User",
        email: "test@example.com",
      });
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 400 with invalid data", async () => {
      const response = await request(app).post("/users").send({
        name: "",
        email: "invalid-email",
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation Error");
    });
  });
});
