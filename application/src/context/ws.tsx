import { ReactElement, createContext, useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";
import { key_event } from "./events-type";
import { KeyDB } from "../web-api/Index-db/key";
import { userDB } from "../web-api/Index-db/user";
import { chatSessionDB } from "../web-api/Index-db/chat-session";
import { KeyPair } from "../web-api/web-crypto/key-pair";

interface user {
  isLogin: boolean;
  _id: string;
}

export const WSContext = createContext<{
  socket: Socket | null;
  setUpUser: (user: user) => void;
}>({
  socket: null,
  setUpUser: (_: user) => {},
});

export const WSContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<user | null>({
    isLogin: false,
    _id: "",
  });
  useEffect(() => {
    try {
      if (user?._id || user?.isLogin) return;
      const socket = io("http://localhost:3001/", {
        transports: ["websocket"],
        reconnection: true,
        auth: {
          _id: user?._id,
        },
      });
      setSocket(socket);

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on(
        "c-get-key-event",
        async (data: {
          key: JsonWebKey;
          _id: string;
          status: "ok" | "error";
          user_id: string;
        }) => {
          console.log("c-get-key-event: ", data);
          if (data.status === "ok") {
            const user = await userDB.findOne({ _id: data.user_id });
            let user_key = await KeyDB.findOne({
              assigned_user__id: user?._id,
              assigned_user_id: user?.id,
            });

            if (!user_key) {
              user_key = await KeyDB.findOne({ status: "pushed" });
            }

            const shared_key = await KeyPair.deriveKey(
              user_key!.private_key,
              data.key
            );
            const chat =
              (await chatSessionDB.findOne({
                reciver_id: user?.id,
              })) || {};
            await chatSessionDB.findAndUpdate(
              [{ reciver_id: user?.id }],
              [
                {
                  ...chat,
                  shared_key: shared_key,
                },
              ]
            );

            socket.emit("s-ack-get-key-event", {
              userId: user?._id,
              _id: data._id,
            });
            await KeyDB.findAndUpdate(
              [
                {
                  id: user_key!.id,
                },
              ],
              [{ status: "assigned" }]
            );
          } else {
            console.log("error");
          }
        }
      );
      socket.on(
        key_event.client,
        async (event: {
          type: "key";
          key: {
            device_key_id: number;
            user_fetch_key_user_id: string;
          };
        }) => {
          if (event.type == "key") {
            socket.emit(key_event.client_fetch, {
              userId: event.key.user_fetch_key_user_id,
            });
            const user = await userDB.findOne({
              _id: event.key.user_fetch_key_user_id,
            });
            KeyDB.findAndUpdate(
              [{ id: event.key.device_key_id }],
              [
                {
                  assigned_user__id: event.key.user_fetch_key_user_id,
                  assigned_user_id: user?._id,
                  status: "assigned",
                },
              ]
            );
          }
        }
      );
    } catch (error) {}
  }, [user]);
  const setUpUser = (user: user) => {
    try {
      setUser({ isLogin: user.isLogin, _id: user._id });
    } catch (error) {}
  };
  return (
    <WSContext.Provider value={{ socket: socket, setUpUser: setUpUser }}>
      {children}
    </WSContext.Provider>
  );
};
