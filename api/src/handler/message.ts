import { Socket } from "socket.io";
import { event_types } from "./events-type";
import { Attrs, Events, message } from "../db/events";

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
        data: data,
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
          if (!data.to) return;
          if (data.to == socket.user._id) return;

          const recipt_to_currect_user: Attrs["recipts"] = {
            from: socket.user._id,
            to: data.to,
            message_id: data.message_id,
            command: "ack",
            time: data.time,
            event_id: data.event_id,
          };
          const eventToUser = Events.build({
            type: "get_recipts",
            userId: socket.user._id,
            state: "worker",
            worker_process_count: 0,
            recipts: recipt_to_currect_user,
            data: recipt_to_currect_user,
          });
          await eventToUser.save();
          const recipts_to_other_user: Attrs["recipts"] = {
            from: socket.user._id,
            to: data.to,
            message_id: data.message_id,
            command: data.command,
            time: data.time,
            event_id: data.event_id,
          };
          const eventToOther = Events.build({
            type: "get_recipts",
            userId: data.to,
            state: "worker",
            worker_process_count: 0,
            recipts: recipts_to_other_user,
            data: recipts_to_other_user,
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
