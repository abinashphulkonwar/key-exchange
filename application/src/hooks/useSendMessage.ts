import { useContext, useEffect } from "react";
import { WSContext } from "../context/ws";

export const UseSendMessage = ({
  _id,
}: {
  id: number;
  _id: string;
  name: string;
  profile: string;
}) => {
  const { socket } = useContext(WSContext);
  const init = async () => {
    try {
      if (!socket || !_id) return;
      console.log("s-get-key-event: ", _id);

      socket?.emit("s-get-key-event", { userId: _id });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    try {
      init();
    } catch (err: any) {
      console.log(err.message);
    }
  }, [_id]);
};
