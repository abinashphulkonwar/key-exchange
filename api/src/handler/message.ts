import { Socket } from "socket.io";
import { event_types } from "./events-type";
import { Events, message } from "../db/events";

export const messages_handler = (socket: Socket) => {
  try {
    socket.on(event_types.s_post_new_message, async (data: message) => {
      data.from = socket.user._id;
      const event = Events.build({
        userId: data.to,
        type: "pull_message",
        state: "emiter",
        worker_process_count: 3,
        message: data,
      });

      await event.save();

      socket.emit(event_types.c_message_delivered_recipts, {
        status: "ok",
        delivered_at: event.createdAt,
      });
    });
  } catch (err: any) {
    console.log(err.message);
  }
};
