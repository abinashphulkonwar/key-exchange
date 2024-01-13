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
        state: "worker",
        worker_process_count: 0,
        message: data,
      });
      await event.save();
      socket.emit(event_types.c_message_delivered_recipts, {
        status: "ok",
        delivered_at: event.createdAt,
      });
    });

    socket.on(
      event_types.s_post_message_recipts,
      async (data: {
        to: string;
        message_id: number;
        command: "read" | "deliverd";
        time: Date;
        event_id: number;
      }) => {
        try {
          const eventToUser = Events.build({
            type: "get_recipts",
            userId: socket.user._id,
            state: "worker",
            worker_process_count: 0,
            recipts: {
              from: socket.user._id,
              to: data.to,
              message_id: data.message_id,
              command: "ack",
              time: data.time,
              event_id: data.event_id,
            },
          });
          await eventToUser.save();
          const eventToOther = Events.build({
            type: "get_recipts",
            userId: data.to,
            state: "worker",
            worker_process_count: 0,
            recipts: {
              from: socket.user._id,
              to: data.to,
              message_id: data.message_id,
              command: data.command,
              time: data.time,
              event_id: data.event_id,
            },
          });
          await eventToOther.save();
        } catch (err: any) {
          console.log(err.message);
        }
      }
    );
  } catch (err: any) {
    console.log(err.message);
  }
};
