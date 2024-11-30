import { hash, compare } from "bcrypt";
import type { UserRepository } from "../repositories/user.repository";
import type { RegisterUserDTO, LoginUserDTO } from "../dto/auth.dto";
import type { User } from "../entities/user.entity";
import { ValidationError } from "../errors/validation.error";
import { JWTService } from "./jwt.service";
import bcrypt from "bcrypt";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JWTService,
  ) {}

  async register(dto: RegisterUserDTO): Promise<string> {
    await this.validateRegistration(dto);

    const hashedPassword = await hash(dto.password, 10);

    const user: User = {
      id: Date.now().toString(), // Use UUID in production
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.userRepository.save(user);

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return token;
  }

  async login(data: LoginUserDTO): Promise<string> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ValidationError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new ValidationError("Invalid credentials");
    }

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return token;
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
