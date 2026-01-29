import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config/config";

const jwtSecret = config.JWT_SECRET as string;
declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        name: string;
        email: string;
      };
    }
  }
}
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided", code: "INVALID_TOKEN" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    console.log("Decoded JWT:", decoded, decoded.id);

    req.user = {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    console.log("error: ", error.message, typeof error, error instanceof TokenExpiredError);
    let code = "INVALID_TOKEN";
    if (error instanceof TokenExpiredError) {
      code = "TOKEN_EXPIRED";
    }
    res.status(401).json({ message: "Unauthorized", error: error.message, code });
    return;
  }
};
