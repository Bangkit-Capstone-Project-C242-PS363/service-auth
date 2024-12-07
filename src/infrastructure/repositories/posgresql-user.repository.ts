import { Pool } from "pg";
import type { User } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/repositories/user.repository";
import { config } from "../../config/config";

export class PostgresUserRepository implements UserRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: config.DB_USER,
      host: config.DB_HOST,
      database: config.DB_NAME,
      password: config.DB_PASSWORD,
      port: config.DB_PORT,
    });

    // Create table if it doesn't exist
    this.initializeTable();
  }

  private async initializeTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.pool.query(query);
    } catch (error) {
      console.error("Error initializing users table:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";

    try {
      const result = await this.pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE username = $1";

    try {
      const result = await this.pool.query(query, [username]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, username, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      user.id,
      user.username,
      user.email,
      user.password,
      user.createdAt || new Date(),
      user.updatedAt || new Date(),
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  async isSubscribe(id: string): Promise<boolean> {
    const query = "SELECT id FROM subscribe WHERE userid = $1";

    try {
      const result = await this.pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }
}
