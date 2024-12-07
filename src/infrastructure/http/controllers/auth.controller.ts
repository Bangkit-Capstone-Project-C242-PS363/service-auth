import type { Request, Response } from "express";
import { AuthService } from "../../../domain/services/auth.service";
import { ValidationError } from "../../../domain/errors/validation.error";
import type { AuthResponse } from "../../../domain/dto/auth.dto";
import type { JWTService } from "../../../domain/services/jwt.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  restriction = async (req: Request, res: Response): Promise<void> => {
    res.json({
      error: false,
      message: "You are authorized",
    });
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.authService.register(req.body);
      res.status(201).json({
        error: false,
        message: "User created successfully",
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: true,
          message: error.error,
        });
        return;
      }

      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginResult: AuthResponse = await this.authService.login(req.body);
      res.status(200).json({
        error: false,
        message: "success",
        loginResult,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: true,
          message: error.error,
        });
        return;
      }

      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };

  subscribe = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(".")[1];
    if (!token) {
      res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
      return;
    }
    const json = Buffer.from(token, "base64").toString("utf-8");
    const userId = JSON.parse(json).userId;

    try {
      await this.authService.subscribe(userId);
      res.status(200).json({
        error: false,
        message: "User subscribed successfully",
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: true,
          message: error.error,
        });
        return;
      }

      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };

  unsubscribe = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(".")[1];
    if (!token) {
      res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
      return;
    }
    const json = Buffer.from(token, "base64").toString("utf-8");
    const userId = JSON.parse(json).userId;

    try {
      await this.authService.unsubscribe(userId);
      res.status(200).json({
        error: false,
        message: "User unsubscribed successfully",
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: true,
          message: error.error,
        });
        return;
      }

      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };
}
