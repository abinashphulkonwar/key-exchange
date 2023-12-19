import { Request, Response, NextFunction } from "express";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send("signup");
};
