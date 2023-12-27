import { Request, Response, NextFunction } from "express";
import { Password } from "../../services/password";
import { User } from "../../db/user";
import { V3 } from "paseto";
import { KeyPasto } from "../../services/token";
import { ApplicationError } from "../../services/application-error";
import { Key } from "../../db/keys";

export const addUserkeys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as unknown as {
    key: string;
  };
  const key = Key.build({
    public_key: body.key,
    userId: req.user._id,
  });

  await key.save();

  res.send({
    message: "key added",
    status: "ok",
  });
};
