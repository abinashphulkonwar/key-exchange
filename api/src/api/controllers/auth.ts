import { Request, Response, NextFunction } from "express";
import { Password } from "../../services/password";
import { User } from "../../db/user";
import { Key } from "../../db/keys";
import { V3 } from "paseto";
import { KeyPasto } from "../../services/token";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as unknown as {
    email: string;
    password: string;
  };
  const hashedPassword = await Password.toHash(password);
  const user = User.build({ email, password: hashedPassword });
  await user.save();
  const token = V3.encrypt({ id: user.id }, KeyPasto, {
    expiresIn: "2 hours",
  });
  req.session = {
    id: token,
  };
  res.send("signup");
};
