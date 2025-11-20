import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../validation";
import { createUserSchema } from "../validation/schema";

const authRouter = Router();

authRouter.post("/register", validate(createUserSchema), authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/profile", authenticate, authController.getProfile);

export default authRouter;
