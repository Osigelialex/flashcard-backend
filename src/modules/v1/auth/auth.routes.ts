import { Router } from "express";
import AuthController from "./auth.controller";
import dtoValidationMiddleware from "@middlewares/validator.middleware";
import { LoginDTO, RegisterDTO } from "./auth.dto";
import { authMiddleware } from "@middlewares/auth.middlewares";

const router: Router = Router();

router.post(
  "/register",
  dtoValidationMiddleware(RegisterDTO),
  AuthController.register,
);

router.post("/login", dtoValidationMiddleware(LoginDTO), AuthController.login);

router.get("/me", authMiddleware, AuthController.me);

export default router;
