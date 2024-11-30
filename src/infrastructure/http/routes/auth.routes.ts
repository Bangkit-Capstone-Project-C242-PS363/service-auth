import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRegisterInput } from "../middleware/validation.middleware";

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.post("/register", validateRegisterInput, authController.register);

  return router;
};
