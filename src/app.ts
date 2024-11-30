import express from "express";
import { InMemoryUserRepository } from "./infrastructure/repositories/in-memory-user.repository";
import { AuthService } from "./domain/services/auth.service";
import { AuthController } from "./infrastructure/http/controllers/auth.controller";
import { createAuthRouter } from "./infrastructure/http/routes/auth.routes";
import { JWTService } from "./domain/services/jwt.service";
import { setupSwagger } from "./config/swagger";
import { PostgresUserRepository } from "./infrastructure/repositories/posgresql-user.repository";

const app = express();
app.use(express.json());

// const userRepository = new InMemoryUserRepository();
const userRepository = new PostgresUserRepository();
const jwtService = new JWTService();
const authService = new AuthService(userRepository, jwtService);
const authController = new AuthController(authService);

app.use("/auth", createAuthRouter(authController));
setupSwagger(app);

export { app };
