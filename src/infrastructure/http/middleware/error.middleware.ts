// middleware/error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../domain/errors/validation.error";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: error.error,
    });
  }

  console.error(error);
  return res.status(500).json({
    error: "Internal server error",
  });
};
