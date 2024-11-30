import type { Request, Response, NextFunction } from "express";
import type { RegisterUserDTO } from "../../../domain/dto/auth.dto";

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      errors: ["All fields are required"],
    });
  }

  req.body = {
    email,
    password,
    confirmPassword,
  } as RegisterUserDTO;

  next();
};
