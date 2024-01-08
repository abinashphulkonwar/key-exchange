import { Socket } from "socket.io";
import { event_types } from "./events-type";
import { message } from "../db/events";

export const messages_handler = (socket: Socket) => {
  try {
    socket.on(event_types.s_post_new_message, async (data: message) => {
      data.from = socket.user._id;
    });
  } catch (err: any) {
    console.log(err.message);
  }
};
