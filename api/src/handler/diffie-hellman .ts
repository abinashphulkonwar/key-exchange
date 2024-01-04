import { Socket } from "socket.io";
import { Key } from "../db/keys";

export const diffie_hellman = (socket: Socket) => {
  socket.on("s-get-key-event", async (data: { userId: string }) => {
    const key = await Key.findOne({ userId: data.userId, state: "pushed" });
    if (!key) return;

    socket.emit("c-get-key-event", {
      key: key?.public_key,
      _id: key._id,
      status: "ok",
    });
    console.log("c-get-key-event: ", "send");
    await Key.findByIdAndUpdate(key._id, {
      state: "send",
      assigned_user_id: socket.user._id,
    });
  });
  socket.on(
    "s-ack-get-key-event",
    async (data: { userId: string; _id: string }) => {
      await Key.findOneAndUpdate(
        {
          _id: data._id,
          assigned_user_id: socket.user._id,
        },
        { state: "assigned" }
      );
      socket.emit("c-ack-get-key-event", {
        status: "ok",
      });
    }
  );
};
