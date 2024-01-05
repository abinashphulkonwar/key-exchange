import { Socket } from "socket.io";
import { Key } from "../db/keys";
import { Events } from "../db/events";
import { key_event } from "./events-type";
export const diffie_hellman = (socket: Socket) => {
  socket.on("s-get-key-event", async (data: { userId: string }) => {
    console.log("s-get-key-event: ", new Date(), socket.id);
    const key = await Key.findOne({ userId: data.userId });
    if (!key) return;

    socket.emit("c-get-key-event", {
      user_id: key.userId,
      key: key?.public_key,
      _id: key._id,
      status: "ok",
    });
    socket.to(socket.user._id).emit("c-get-key-event", {
      user_id: key.userId,
      key: key?.public_key,
      _id: key._id,
      status: "ok",
    });
    await Key.findByIdAndUpdate(key._id, {
      state: "send",
      assigned_user_id: socket.user._id,
    });

    console.log("c-get-key-event: ", "send", new Date(), socket.id);
  });
  socket.on(
    "s-ack-get-key-event",
    async (data: { userId: string; _id: string }) => {
      const key = await Key.findOneAndUpdate(
        {
          _id: data._id,
          assigned_user_id: socket.user._id,
        },
        { state: "assigned" }
      );
      if (!key) return;
      const event = Events.build({
        userId: key.userId,
        type: "key",
        key: {
          device_key_id: key.device_key_id,
          user_fetch_key_user_id: key?.assigned_user_id,
        },
      });
      await event.save();
      socket.to(key.userId.toString()).emit(key_event.client, {
        type: event.type,
        key: event.key,
        event_id: event._id,
      });
      socket.emit("c-ack-get-key-event", {
        status: "ok",
      });
    }
  );
};
