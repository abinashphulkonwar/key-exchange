import { ReactElement, createContext, useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";
import { key_event } from "./events-type";
import { KeyDB } from "../web-api/Index-db/key";
import { userDB } from "../web-api/Index-db/user";
import { chatSessionDB } from "../web-api/Index-db/chat-session";
import { KeyPair } from "../web-api/web-crypto/key-pair";
import { setUpChat, setupCurrentUserHandler } from "../hooks/useChat";

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
          event_id: string;
        }) => {
          console.log("c-get-key-event: ", data);
          const other_user = await userDB.findOne({ _id: data.user_id });
          let chat = await chatSessionDB.findOne({
            reciver_id: other_user?.id,
          });

          if (!chat) {
            chat = await setUpChat({
              _id: other_user?._id || "",
              name: other_user?.name || "",
            });
          }

          await chatSessionDB.findAndUpdate(
            [{ reciver_id: other_user?.id }],
            [
              {
                ...chat,
                reciver_public_key: data.key,
              },
            ]
          );

          socket.emit("s-ack-get-key-event", {
            userId: data?.user_id,
            _id: data._id,
            event_id: data.event_id,
          });
        }
      );
      socket.on(
        key_event.client,
        async (event: {
          type: "key" | "init_chat" | "init_chat_inform_about_private_key";
          key: {
            device_key_id: number;
            other_user: string;
          };
          event_id: string;
          init_chat: {
            other_user_id: string;
            name: string;
          };
        }) => {
          console.log(event.type);
          // if (event.type == "key") {
          //   socket.emit(key_event.client_fetch, {
          //     userId: event.key.user_fetch_key_user_id,
          //   });
          //   const user = await userDB.findOne({
          //     _id: event.key.user_fetch_key_user_id,
          //   });
          //   await KeyDB.findAndUpdate(
          //     [{ id: event.key.device_key_id }],
          //     [
          //       {
          //         assigned_user__id: event.key.user_fetch_key_user_id,
          //         assigned_user_id: user?._id,
          //         status: "assigned",
          //       },
          //     ]
          //   );
          //   socket.emit(key_event.server_ack, { _id: event.event_id });
          //
          if (event.type == "init_chat") {
            await setupCurrentUserHandler(user?._id || "");
            await setUpChat({
              _id: event.init_chat.other_user_id,
              name: event.init_chat.name,
            });
            socket.emit("s-get-key-event", {
              userId: event.init_chat.other_user_id,
              event_id: event.event_id,
            });
          }

          if (event.type == "init_chat_inform_about_private_key") {
            const other_user = await userDB.findOne({
              _id: event.key.other_user,
            });
            console.log(other_user, event.key);
            const key = await KeyDB.findOne({
              id: event.key.device_key_id,
            });
            if (!key) return;
            const chat_session = await chatSessionDB.findOne({
              reciver_id: other_user?.id,
            });
            console.log(chat_session);
            if (!chat_session) return;
            const shared_key = await KeyPair.deriveKey(
              key.private_key,
              chat_session.reciver_public_key
            );
            await chatSessionDB.findAndUpdate(
              [{ reciver_id: event.key.other_user }],
              [
                {
                  ...chat_session,
                  shared_key: shared_key,
                },
              ]
            );
            await KeyDB.findAndUpdate(
              [
                {
                  id: event.key.device_key_id,
                },
              ],
              [
                {
                  ...key,
                  assigned_user__id: event.key.other_user,
                  status: "assigned",
                },
              ]
            );
            socket.emit(key_event.server_ack, {
              _id: event.event_id,
              userId: user?._id,
            });
          }
        }
      );
    } catch (error) {}
  }, [user]);
  const setUpUser = (user: user) => {
    try {
      setupCurrentUserHandler(user._id);
      setUser({ isLogin: user.isLogin, _id: user._id });
    } catch (error) {}
  };
  return (
    <WSContext.Provider value={{ socket: socket, setUpUser: setUpUser }}>
      {children}
    </WSContext.Provider>
  );
};
