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
  try {
    const body = req.body as unknown as {
      device_key_id: number;
      public_key: JsonWebKey;
    }[];

    const keys = await Key.insertMany(
      body.map((val) => {
        return {
          public_key: val.public_key,
          userId: req.user._id,
          device_key_id: val.device_key_id,
          state: "pushed",
        };
      })
    );

    res.send({
      message: "key added",
      status: "ok",
      keys: keys,
    });
  } catch (err: any) {
    console.log(err.message);
    return next(new ApplicationError(err.message, 500));
  }
};
export const getUserKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as unknown as {
      userId: string;
    };
    const key = await Key.findOne({
      userId: body.userId,
      state: "pushed",
    });
    if (!key) throw new ApplicationError("keys are not generated", 422);

    res.send({
      public_key: key?.public_key,
    });
    await Key.findByIdAndUpdate(key._id, { state: "assigned" });
  } catch (err: any) {
    console.log(err.message);
    return next(new ApplicationError(err.message, 500));
  }
};
