import { Socket } from "socket.io-client";
import { chatSessionDB } from "../web-api/Index-db/chat-session";
import {
  eventsDB,
  interfaceEventsDB,
  message_event,
  message_recipts_event,
} from "../web-api/Index-db/event";
import { messageDB } from "../web-api/Index-db/messages";
import { userDB } from "../web-api/Index-db/user";
import { ApplicationCrypto } from "../web-api/web-crypto";
import { key_event } from "./events-type";
import { dispatch_event } from "./message-event";
import { processedEventsDB } from "../web-api/Index-db/processed-events";

export const UseEvent = ({ socket }: { socket: Socket | null }) => {
  const pull_message_handler = async (event: interfaceEventsDB) => {
    const message = event.data as message_event;
    const chating_user = await userDB.findOne({
      _id: message.from,
    });
    const chat_session = await chatSessionDB.findOne({
      reciver_id: chating_user?.id,
    });
    if (!chat_session) return false;
    const content = await ApplicationCrypto.decripted({
      iv: message.iv,
      content: message.content,
      shared_key: chat_session.shared_key,
    });
    const new_message = await messageDB.save(
      {
        session_id: chat_session.id,
        is_deliverd: true,
        deliverd_time: message.created_at,
        to: message.to,
        from: message.from,
        content: content,
        content_type: message.content_type,
        command: "add",
        created_at: message.created_at,
        iv: message.iv,
      },
      true
    );
    if (new_message) {
      console.log(new_message);
      dispatch_event(new_message);
    }
    socket?.emit(key_event.server_ack, {
      _id: event._id,
    });
    await eventsDB.remove_event_by_id(event.id);
    return true;
  };

  const send_recipts_handler = async (event: interfaceEventsDB) => {
    const data = event.data as message_recipts_event;
    socket?.emit(key_event.s_post_message_recipts, {
      to: data.to,
      message_id: data.message_id,
      command: data.command,
      time: data.time,
      event_id: event.id,
    });
    return true;
  };
  const get_recipts_handler = async (event: interfaceEventsDB) => {
    const data = event.data as message_recipts_event;

    if (data.command == "ack") {
      console.log(data.command);
      await eventsDB.remove_event_by_id(data.event_id);
    }

    if (data.command == "deliverd") {
      await messageDB.findOneUpdate(data.message_id, {
        deliverd_time: data.time,
        is_deliverd: true,
      });
    }

    if (data.command == "read") {
      await messageDB.findOneUpdate(data.message_id, {
        read_time: data.time,
        is_read: true,
      });
    }

    socket?.emit(key_event.server_ack, { _id: event._id });
    await eventsDB.remove_event_by_id(event.id);
    await processedEventsDB.save({
      _id: event._id,
      created_at: new Date(),
      state: "success",
      event_id: event.id,
    });
    return true;
  };

  const handler = async (event: interfaceEventsDB): Promise<boolean> => {
    if (event.type == "pull_message") return await pull_message_handler(event);
    if (event.type == "send_recipts") return await send_recipts_handler(event);
    if (event.type == "get_recipts") return await get_recipts_handler(event);
    return false;
  };

  return {
    handler,
  };
};
