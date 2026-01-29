import { Request, Response } from "express";
import config from "../config/config";
import { authService } from "../services/auth.service";
import { resUtils } from "../utils/response.utils";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = await authService.register(req.body);
      resUtils.success(res, {
        status: 201,
        message: "User registered successfully!",
        data: data,
      });
    } catch (error: any) {
      resUtils.error(res, {
        status: error.statusCode,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { access_token, refresh_token } = await authService.login(req.body.email, req.body.password);
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/user/api/auth/refresh-token",
        maxAge: Number(config.MAX_AGE_REFRESH_TOKEN),
      });

      res.json({
        message: "User logged in successfully!",
        data: { access_token },
      });
    } catch (error: any) {
      resUtils.error(res, {
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

      resUtils.success(res, {
        message: "User profile retrieved successfully!",
        data: data,
      });
    } catch (error: any) {
      resUtils.error(res, {
        status: error.statusCode,
        message: error.message,
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken;
      const { access_token, refresh_token } = await authService.refreshToken(refreshToken);
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/user/api/auth/refresh-token",
        maxAge: Number(config.MAX_AGE_REFRESH_TOKEN),
      });
      res.json({
        message: "Refresh token successful!",
        data: {
          access_token,
        },
      });
    } catch (error: any) {
      resUtils.error(res, {
        status: error.statusCode,
        message: error.message,
      });
    }
  }
}

export const authController = new AuthController();
