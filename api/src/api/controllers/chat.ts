import { Request, Response, NextFunction } from "express";
import { Password } from "../../services/password";
import { User } from "../../db/user";
import { V3 } from "paseto";
import { KeyPasto } from "../../services/token";
import { ApplicationError } from "../../services/application-error";

export const userListController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({}).select({
    email: 1,
    _id: 1,
  });
  res.status(200).send(users);
};
