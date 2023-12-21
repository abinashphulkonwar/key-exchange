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
  const token = await V3.encrypt({ id: user.id }, KeyPasto, {
    expiresIn: "2 hours",
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

  const token = await V3.encrypt({ id: user.id }, KeyPasto, {
    expiresIn: "2 hours",
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
  const token = req.session?.id;
  console.log(req.session, token);
  if (!token) return res.status(401).send();
  const payload = await V3.decrypt(token, KeyPasto);
  const user = await User.findById(payload.id);
  if (!user) return res.status(401).send();
  delete payload.iat;
  delete payload.exp;
  res.send(payload);
};
