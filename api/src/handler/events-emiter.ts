import { Socket } from "socket.io";
import { Events } from "../db/events";
import { event_types, key_event } from "./events-type";
import { ConnectionsTree } from "./connections";

const sleep = (duration: number = 20000) => {
  // console.log("sleep: ", duration / 1000, "seconds");

  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
};

const emite_event = async (socket: Socket) => {
  try {
    const event = await Events.findOne({
      userId: socket.user._id,
      state: "emiter",
    });
    if (!event) return;
    console.log("event emited: ", event?._id, socket.id);

    socket.emit(key_event.client, {
      type: event.type,
      key: event.key,
      _id: event._id,
      event_id: event._id,
      init_chat: event.init_chat,
      data: event.message,
    });
  } catch (err: any) {
    console.log(err.message);
  }
};

export const events_emiter = async (socket: Socket) => {
  socket.on(event_types.server, async (data: { _id: string }) => {
    console.log("delet events : ", data._id);
    await Events.findOneAndDelete({ _id: data._id, userId: socket.user._id });
    //await sleep();
    await emite_event(socket);
  });

  await emite_event(socket);
};

export const events_emiter_worker = async () => {
  try {
    while (true) {
      let last_process_time = new Date();
      const event = await Events.findOne({
        last_process_time: {
          $lt: last_process_time,
        },
        state: "worker",
        worker_process_count: {
          $lt: 3,
        },
      });
      console.log("event: ", event, last_process_time);
      last_process_time = new Date();
      last_process_time.setSeconds(last_process_time.getSeconds() + 25);
      if (!event) {
        await sleep(10000);
        continue;
      }
      console.log("event process: ", event._id);
      const query: {
        last_process_time?: Date;
        state?: string;
        $inc?: {
          worker_process_count: number;
        };
      } = {
        last_process_time: last_process_time,
      };
      if (event.worker_process_count === 2) {
        query["state"] = "emiter";
      } else {
        query["$inc"] = {
          worker_process_count: 1,
        };
      }
      const socket = ConnectionsTree.get(event.userId.toString());
      socket.forEach((val) => {
        console.log("emit: ", event_types.c_post_new_message);
        val.emit(event_types.c_post_new_message, {
          type: event.type,
          key: event.key,
          _id: event._id,
          event_id: event._id,
          init_chat: event.init_chat,
          data: event.message,
        });
      });
      await Events.findByIdAndUpdate(event._id, query);

      await sleep(1000);
    }
  } catch (err: any) {
    console.log(err.message);
  }
};
