import type { User } from "../entities/user.entity";
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  isSubscribe(id: string): Promise<boolean>;
  save(user: User): Promise<User>;
}
