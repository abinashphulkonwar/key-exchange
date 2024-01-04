import { Request, Response, NextFunction } from "express";
import { V3 } from "paseto";
import { User } from "../db/user";
import { KeyPasto } from "./token";
import { ApplicationError } from "./application-error";

export interface UserPayload {
  _id: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.session?.id;
  if (!token) return next();
  const payload = (await V3.decrypt(token, KeyPasto)) as UserPayload;
  req.user = payload;
  next();
};

export const requiredAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) throw new ApplicationError("Not authorized", 403);

  next();
};
