import type { Request, Response, NextFunction } from "express";
import type {
  LoginUserDTO,
  RegisterUserDTO,
} from "../../../domain/dto/auth.dto";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import Joi from "joi";
import { JWTService } from "../../../domain/services/jwt.service";

const jwt = new JWTService();

export const validateRegisterInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = await registerSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    req.body = validatedData as RegisterUserDTO;
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(". ")
        .replaceAll('"', "'");
      return res.status(400).json({
        error: true,
        message: errorMessage,
      });
    }

    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

export const validateLoginInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    req.body = validatedData as LoginUserDTO;
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(". ")
        .replaceAll('"', "'");
      return res.status(400).json({
        error: true,
        message: errorMessage,
      });
    }
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Access denied. No token provided",
      });
    }

    const decoded = jwt.verifyToken(token);
    req.user = decoded; // TypeScript note: You might need to extend Request type to include user
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Invalid token",
    });
  }
};
