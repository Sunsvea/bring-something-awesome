import { User } from "../interfaces/user.js";
import { UserRepository } from "../interfaces/repository.js";

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const id = Math.random().toString(36).substring(7);
    const user: User = {
      id,
      ...userData,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }
}
