import { hash, compare } from "bcrypt";
import type { UserRepository } from "../repositories/user.repository";
import type {
  RegisterUserDTO,
  LoginUserDTO,
  AuthResponse,
} from "../dto/auth.dto";
import type { User } from "../entities/user.entity";
import { ValidationError } from "../errors/validation.error";
import { JWTService } from "./jwt.service";
import bcrypt from "bcrypt";

import { v4 as uuidv4 } from "uuid";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JWTService,
  ) {}

  async register(dto: RegisterUserDTO): Promise<AuthResponse> {
    await this.validateRegistration(dto);

    const hashedPassword = await hash(dto.password, 10);

    const user: User = {
      id: uuidv4(),
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.userRepository.save(user);
    const isSubscribe = await this.userRepository.isSubscribe(user.id);

    const token = this.jwtService.generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      userId: user.id,
      name: user.username,
      email: user.email,
      isSubscribe,
      token,
    };
  }

  async login(data: LoginUserDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ValidationError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new ValidationError("Invalid credentials");
    }

    const isSubscribe = await this.userRepository.isSubscribe(user.id);

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
      isSubscribe,
    });

    return {
      userId: user.id,
      name: user.username,
      email: user.email,
      isSubscribe,
      token,
    };
  }

  async subscribe(userId: string): Promise<void> {
    const isSubscribe = await this.userRepository.isSubscribe(userId);
    if (isSubscribe) {
      return;
    }
    await this.userRepository.subscribe(userId);
  }

  async unsubscribe(userId: string): Promise<void> {
    await this.userRepository.unsubscribe(userId);
  }

  private async validateRegistration(dto: RegisterUserDTO): Promise<void> {
    const error: string[] = [];
    if (!dto.username) {
      error.push("Username is required");
    }

    if (!dto.email) {
      error.push("Email is required");
    }

    if (!dto.password) {
      error.push("Password is required");
    }

    if (!dto.confirmPassword) {
      error.push("Confirm password is required");
    }

    if (dto.email && !this.isValidEmail(dto.email)) {
      error.push("Invalid email format");
    }

    if (dto.password && dto.password.length < 8) {
      error.push("Password must be at least 8 characters long");
    }

    if (dto.password !== dto.confirmPassword) {
      error.push("Passwords do not match");
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      error.push("Email already registered");
    }

    if (error.length > 0) {
      throw new ValidationError(error.join(". "));
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
