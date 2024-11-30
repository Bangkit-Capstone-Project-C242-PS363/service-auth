import { hash, compare } from "bcrypt";
import type { UserRepository } from "../repositories/user.repository";
import type { RegisterUserDTO, LoginUserDTO } from "../dto/auth.dto";
import type { User } from "../entities/user.entity";
import { ValidationError } from "../errors/validation.error";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: RegisterUserDTO): Promise<User> {
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

    return this.userRepository.save(user);
  }

  async login(dto: LoginUserDTO): Promise<string> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ValidationError(["Invalid email or password"]);
    }

    const passwordMatch = await compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new ValidationError(["Invalid email or password"]);
    }

    return "JWT_TOKEN"; // Implement JWT token generation
  }

  private async validateRegistration(dto: RegisterUserDTO): Promise<void> {
    const errors: string[] = [];
    if (!dto.username) {
      errors.push("Username is required");
    }

    if (!dto.email) {
      errors.push("Email is required");
    }

    if (!dto.password) {
      errors.push("Password is required");
    }

    if (!dto.confirmPassword) {
      errors.push("Confirm password is required");
    }

    if (dto.email && !this.isValidEmail(dto.email)) {
      errors.push("Invalid email format");
    }

    if (dto.password && dto.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (dto.password !== dto.confirmPassword) {
      errors.push("Passwords do not match");
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      errors.push("Email already registered");
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
