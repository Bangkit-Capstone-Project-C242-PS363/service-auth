import type { Request, Response } from "express";
import { AuthService } from "../../../domain/services/auth.service";
import { ValidationError } from "../../../domain/errors/validation.error";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  restriction = async (req: Request, res: Response): Promise<void> => {
    res.json({
      message: "You are authorized",
    });
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = await this.authService.register(req.body);
      res.status(201).json({
        message: "User registered successfully",
        token,
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

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = await this.authService.login(req.body);
      res.status(200).json({
        message: "User logged in successfully",
        token,
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
