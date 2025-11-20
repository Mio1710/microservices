import { Router } from "express";
import { userController } from "../controllers/User.controller";

const userRouter = Router();
userRouter.get("/", userController.getAllUsers);

export default userRouter;
