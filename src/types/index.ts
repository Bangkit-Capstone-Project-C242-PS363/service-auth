// src/types/index.ts
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  created_at?: Date;
}

export interface UserPayload {
  id: number;
  username: string;
  email: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UpdateProfileRequest {
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
