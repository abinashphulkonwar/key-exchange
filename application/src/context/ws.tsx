import { ReactElement, createContext, useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";

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
