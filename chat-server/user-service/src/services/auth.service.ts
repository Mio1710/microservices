import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../database";
import { ApiError } from "../utils";
import { JWTPayload, UserRegisterDto } from "./../interface/user";
const jwtSecret = config.JWT_SECRET as string;

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
    const token = jwt.sign(user, jwtSecret, {
      expiresIn: "1d",
    });
    return token;
  }

  async login(email: string, password: string) {
    try {
      const user = await User.findOne({ email }).select(["password", "name", "_id", "email"]);
      console.log("User found:", user, password, user?.password);

      if (!user || !(await bcrypt.compare(password, user.password as string))) {
        throw new ApiError(401, "Incorrect email or password");
      }
      const token = await this.createSendToken({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      return token;
    } catch (error: ApiError | any) {
      console.log("Login error:", error);

      throw new ApiError(401, error?.message ?? "Error logging in user");
    }
  }
}

export const authService = new AuthService();
