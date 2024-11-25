import express from "express";
import type { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import type {
  User,
  UserPayload,
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
} from "./types";

dotenv.config();

const app = express();
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DATABASE,
});

// Create users table if it doesn't exist
const createUsersTable = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Users table created or already exists");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

createUsersTable();

// Middleware to verify JWT token
const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_PUBLIC_KEY || "", {
      algorithms: [
        (process.env.ACCESS_TOKEN_ALGORITHM as jwt.Algorithm) || "ES512",
      ],
    }) as UserPayload;

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Register endpoint
app.post(
  "/api/register",

  async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { username, password, email } = req.body;

      // Validate input
      if (!username || !password || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const userExists = await pool.query<User>(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email],
      );

      if (userExists.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await pool.query<User>(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, hashedPassword, email],
      );

      return res.status(201).json({
        message: "User registered successfully",
        user: result.rows[0],
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Error registering user" });
    }
  },
);

// Login endpoint
app.post(
  "/api/login",
  async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { username, password } = req.body;

      // Find user
      const result = await pool.query<User>(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );

      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_PRIVATE_KEY || "",
        {
          algorithm:
            (process.env.ACCESS_TOKEN_ALGORITHM as jwt.Algorithm) || "ES512",
          expiresIn: "24h",
        },
      );

      return res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Error logging in" });
    }
  },
);

// Protected route example
app.get(
  "/api/protected",
  authenticateToken,
  (req: Request, res: Response): Response => {
    return res.json({
      message: "Protected route accessed successfully",
      user: req.user,
    });
  },
);

// Get user profile
app.get(
  "/api/profile",
  authenticateToken,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await pool.query<User>(
        "SELECT id, username, email, created_at FROM users WHERE id = $1",
        [req.user?.id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      console.error("Profile fetch error:", error);
      return res.status(500).json({ message: "Error fetching profile" });
    }
  },
);

// Update user profile
app.put(
  "/api/profile",
  authenticateToken,
  async (
    req: Request<{}, {}, UpdateProfileRequest>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email } = req.body;

      const result = await pool.query<User>(
        "UPDATE users SET email = $1 WHERE id = $2 RETURNING id, username, email",
        [email, req.user?.id],
      );

      return res.json(result.rows[0]);
    } catch (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({ message: "Error updating profile" });
    }
  },
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
