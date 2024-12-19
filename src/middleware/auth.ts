import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Role } from "../models/home.model";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        username: string;
        role: Role;
      };
    }
  }
}

export async function Verification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Invalid token format");
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECRET_KEY is not defined");
    }

    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("User not found");
    }
    req.user = {
      _id: user._id.toString(),
      username: user.username,
      role: user.role as Role,
    };
    next();
  } catch (error) {
    res.status(401).send({
      status: "failed",
      message: error,
      data: {},
    });
  }
}

export const checkUserRole = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || req.user.role !== requiredRole) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  };
};
