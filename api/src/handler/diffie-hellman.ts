import { Socket } from "socket.io";
import { Key } from "../db/keys";
import { Events } from "../db/events";
import { event_types, key_event } from "./events-type";
import { Chat } from "../db/chat";
import { User } from "../db/user";

const s_get_key_event = (socket: Socket) => {
  return async (data: { userId: string; event_id: string }) => {
    console.log("s-get-key-event: ", new Date(), socket.id);
    const chat_session = await Chat.findOne({
      userId: { $all: [socket.user._id, data.userId] },
    });
    if (!chat_session) return;
    if (chat_session.keys[socket.user._id].state == "fetch") return;
    const key = await Key.findOne({ userId: data.userId });

    if (!key) return;

    socket.emit("c-get-key-event", {
      user_id: key.userId,
      key: key?.public_key,
      _id: key._id,
      status: "ok",
      event_id: data.event_id,
    });

    await Key.findByIdAndUpdate(key._id, {
      state: "send",
      assigned_user_id: socket.user._id,
    });
    console.log("c-get-key-event: ", "send", new Date(), socket.id);
  };
};
export const diffie_hellman = (socket: Socket) => {
  socket.on("s-get-key-event", s_get_key_event(socket));
  socket.on(
    "s-ack-get-key-event",
    async (data: { userId: string; _id: string; event_id: string }) => {
      console.log("s-ack");
      const chat_session = await Chat.findOne({
        userId: { $all: [socket.user._id, data.userId] },
      });
      if (!chat_session) return;
      if (chat_session.keys[socket.user._id].state == "fetch") return;
      const key = await Key.findOneAndUpdate(
        {
          _id: data._id,
          assigned_user_id: socket.user._id,
        },
        { state: "assigned" }
      );

      if (!key) return;

      await Chat.findByIdAndUpdate(chat_session._id, {
        $set: {
          [`keys.${data.userId}.device_key_id`]: key.device_key_id,
          [`keys.${socket.user._id}. state`]: "fetch",
        },
      });
      await Events.findByIdAndDelete(data.event_id);

      const event = Events.build({
        type: "init_chat_inform_about_private_key",
        userId: data.userId,
        key: {
          device_key_id: key.device_key_id,
          other_user: socket.user._id,
        },
        state: "emiter",
        worker_process_count: 0,
        data: {},
      });
      await event.save();
      socket.emit("c-ack-get-key-event", {
        status: "ok",
      });
    }
  );

  socket.on("s-init-chat", async (data: { userId: string }) => {
    console.log("s-init-chat", data);
    if (socket.user._id === data.userId) return;
    const chat_session = await Chat.findOne({
      userId: { $all: [socket.user._id, data.userId] },
    });

    if (chat_session) return;
    const chat = Chat.build({
      userId: [socket.user._id, data.userId],
      keys: {
        [socket.user._id]: {
          state: "intial",
          device_key_id: NaN,
        },
        [data.userId]: {
          state: "intial",
          device_key_id: NaN,
        },
      },
    });
    await chat.save();
    const other_user = await User.findById(data.userId);
    const event_user_1 = Events.build({
      type: "init_chat",
      userId: socket.user._id,
      init_chat: {
        other_user_id: data.userId,
        name: other_user?.email || "",
      },
      state: "emiter",
      worker_process_count: 0,
      data: {},
    });
    await event_user_1.save();
    const event_user_2 = Events.build({
      type: "init_chat",
      userId: data.userId,
      init_chat: {
        other_user_id: socket.user._id,
        name: socket.user.name || "",
      },
      state: "emiter",
      worker_process_count: 0,
      data: {},
    });
    await event_user_2.save();
    socket.emit(event_types.c_init_chat, {
      status: "ok",
    });
  });
};
