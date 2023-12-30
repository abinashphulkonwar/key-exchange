import { Request, Response, NextFunction } from "express";
import { Password } from "../../services/password";
import { User } from "../../db/user";
import { V3 } from "paseto";
import { KeyPasto } from "../../services/token";
import { ApplicationError } from "../../services/application-error";

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
  const token = await V3.encrypt({ _id: user.id }, KeyPasto, {
    expiresIn: "1 year",
  });
  req.session = {
    id: token,
  };
  res.redirect("/");
};
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as unknown as {
    email: string;
    password: string;
  };

  const user = await User.findOne({ email });
  if (!user) throw new ApplicationError("User not found", 404);
  const isSame = await Password.compare(user?.password, password);
  if (!isSame) throw new ApplicationError("Password is incorrect", 400);

  const token = await V3.encrypt({ _id: user.id }, KeyPasto, {
    expiresIn: "1 year",
  });
  req.session = {
    id: token,
  };
  res.redirect("/");
};

export const currentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  delete req.user.exp;
  // @ts-ignore
  delete req.user.iat;

  res.send(req.user);
};
