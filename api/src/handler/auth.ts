import { parse } from "cookie";
import { V3 } from "paseto";
import { Socket } from "socket.io";
import { KeyPasto } from "../services/token";
import { UserPayload } from "../services/current-user";
import { Buffer } from "safe-buffer";

declare module "socket.io" {
  interface Socket {
    user: UserPayload;
  }
}

export const isAuthenticated = async (
  socket: Socket,
  next: (err?: any) => void
) => {
  try {
    const { session } = parse(socket.handshake.headers.cookie || "");
    const buffer = Buffer.from(session, "base64").toString("utf8");
    const session_obj = JSON.parse(buffer) as unknown as {
      id: string;
    };
    const payload = (await V3.decrypt(
      session_obj?.id || "",
      KeyPasto
    )) as UserPayload;

    socket.user = payload;

    next();
  } catch (err: any) {
    console.log(err.message);
  }
};
