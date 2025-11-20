import { Request, Response } from "express";
import { authService } from "../services/auth.service";
class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = await authService.register(req.body);
      res.status(201).json({
        status: 201,
        message: "User registered successfully!",
        data: data,
      });
    } catch (error: any) {
      console.log("Registration error:", error);

      res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body.email, req.body.password);
      res.status(200).json({
        status: 200,
        message: "User logged in successfully!",
        token: data,
      });
    } catch (error: any) {
      console.log("Login error:", error);

      res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      console.log("Fetching profile for user ID:", userId, req.user);

      const data = await authService.getProfile(userId);
      res.status(200).json({
        status: 200,
        message: "User profile retrieved successfully!",
        data: data,
      });
    } catch (error: any) {
      res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
  }
}

export const authController = new AuthController();
