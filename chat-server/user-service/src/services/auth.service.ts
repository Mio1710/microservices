import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../database";
import { ILoginResponse } from "../types/IAuthResponse";
import { ApiError } from "../utils";
import { JWTPayload, UserRegisterDto } from "./../interface/user";

class AuthService {
  async getProfile(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not authenticated");
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error: any) {}
  }

  async register(userData: UserRegisterDto) {
    try {
      const userExists = await User.findOne({ email: userData.email });
      if (userExists) {
        throw new ApiError(400, "User already exists!");
      }
      const encryptedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: encryptedPassword,
      });

      return user;
    } catch (error: any) {
      throw new ApiError(error.statusCode ?? 500, error.message ?? "Error registering user");
    }
  }

  async createSendToken(user: JWTPayload) {
    const token = jwt.sign(user, config.JWT_SECRET, {
      expiresIn: config.MAX_AGE_TOKEN,
    });
    return token;
  }

  async createRefreshToken(user: JWTPayload) {
    const refreshToken = jwt.sign(user, config.REFRESH_TOKEN_SECRET, {
      expiresIn: config.MAX_AGE_REFRESH_TOKEN,
    });
    return refreshToken;
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    try {
      const user = await User.findOne({ email }).select(["password", "name", "_id", "email"]);
      console.log("User found:", user, password, user?.password);

      if (!user || !(await bcrypt.compare(password, user.password as string))) {
        throw new ApiError(401, "Incorrect email or password");
      }

      const tokenPayload: JWTPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      const access_token = await this.createSendToken(tokenPayload);
      const refresh_token = await this.createRefreshToken(tokenPayload);

      // Store refresh token in database
      user.refreshToken = refresh_token;
      await user.save();

      return { access_token, refresh_token };
    } catch (error: ApiError | any) {
      throw new ApiError(401, error?.message ?? "Error logging in user");
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET) as JWTPayload;
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
      }
      const tokenPayload: JWTPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      const newToken = await this.createSendToken(tokenPayload);
      const newRefreshToken = await this.createRefreshToken(tokenPayload);

      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      await user.save();

      return { access_token: newToken, refresh_token: newRefreshToken };
    } catch (error: any) {
      throw new ApiError(401, "Invalid refresh token");
    }
  }
}

export const authService = new AuthService();
