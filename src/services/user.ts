import { User } from "../interfaces/user.js";
import { UserRepository } from "../interfaces/repository.js";
import { CacheService } from "../interfaces/cache.js";

export class UserService {
  constructor(
    private repository: UserRepository,
    private cache: CacheService
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const cached = await this.cache.get(`user:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.repository.findById(id);
    if (user) {
      await this.cache.set(`user:${user.id}`, JSON.stringify(user));
    }
    return user;
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user = await this.repository.create(userData);
    await this.cache.set(`user:${user.id}`, JSON.stringify(user));
    return user;
  }
}
