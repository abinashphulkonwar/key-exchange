import { Socket } from "socket.io";
import { Events } from "../db/events";
import { event_types, key_event } from "./events-type";

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 20000);
  });
};

const emite_event = async (socket: Socket) => {
  try {
    const event = await Events.findOne({ userId: socket.user._id });
    console.log("event emited: ", event?._id, socket.id);
    if (!event) return;

    socket.emit(key_event.client, {
      type: event.type,
      key: event.key,
      _id: event._id,
    });
  } catch (err: any) {
    console.log(err.message);
  }
};

export const events_emiter = async (socket: Socket) => {
  socket.on(event_types.server, async (data: { _id: string }) => {
    await Events.findOneAndDelete({ _id: data._id, userId: socket.user._id });
    await sleep();
    await emite_event(socket);
  });

  await emite_event(socket);
};
