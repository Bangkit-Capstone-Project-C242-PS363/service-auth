import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  validateToken,
  validateLoginInput,
  validateRegisterInput,
} from "../middleware/validation.middleware";

export const createAuthRouter = (authController: AuthController): Router => {
  const router = Router();

  router.post("/register", validateRegisterInput, authController.register);
  router.post("/login", validateLoginInput, authController.login);
  router.get("/restriction", validateToken, authController.restriction);

  return router;
};
