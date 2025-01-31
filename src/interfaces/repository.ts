import { User } from "../interfaces/user.js";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt">): Promise<User>;
}
