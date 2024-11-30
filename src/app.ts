import express from "express";
import { InMemoryUserRepository } from "./infrastructure/repositories/in-memory-user.repository";
import { AuthService } from "./domain/services/auth.service";
import { AuthController } from "./infrastructure/http/controllers/auth.controller";
import { createAuthRouter } from "./infrastructure/http/routes/auth.routes";

const app = express();
app.use(express.json());

const userRepository = new InMemoryUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

app.use("/auth", createAuthRouter(authController));

export { app };
