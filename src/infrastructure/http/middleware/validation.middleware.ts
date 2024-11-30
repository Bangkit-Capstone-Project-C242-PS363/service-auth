import type { Request, Response, NextFunction } from "express";
import type { RegisterUserDTO } from "../../../domain/dto/auth.dto";
import { registerSchema } from "../validators/auth.validator";
import Joi from "joi";

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
      return res.status(400).json({
        errors: error.details.map((detail) => detail.message),
      });
    }

    return res.status(500).json({
      errors: ["Internal server error"],
    });
  }
};
