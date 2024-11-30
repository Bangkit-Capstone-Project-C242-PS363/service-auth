import type { Request, Response } from "express";
import { AuthService } from "../../../domain/services/auth.service";
import { ValidationError } from "../../../domain/errors/validation.error";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
}
