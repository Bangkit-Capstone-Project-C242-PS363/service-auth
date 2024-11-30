import type { User } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/repositories/user.repository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) || null;
  }

  async save(user: User): Promise<User> {
    const existingUserIndex = this.users.findIndex((u) => u.id === user.id);

    if (existingUserIndex >= 0) {
      this.users[existingUserIndex] = {
        ...user,
        updatedAt: new Date(),
      };
      return this.users[existingUserIndex];
    }

    this.users.push(user);
    return user;
  }
}
