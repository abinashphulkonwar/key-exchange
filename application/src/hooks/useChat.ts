import { useEffect, useRef, useState } from "react";
import { chatSessionDB, docdb } from "../web-api/Index-db/chat-session";
import { messageDB, messageDBdb } from "../web-api/Index-db/messages";
import { docdbUser, userDB } from "../web-api/Index-db/user";
import { listen_event, remove_listener } from "../context/message-event";
export const setupCurrentUserHandler = async (_id: string) => {
  if (!_id) return;
  const user = await userDB.findOne({
    _id: _id,
  });

  if (!user || user == null) {
    await userDB.save({
      _id: _id,
      name: "device user",
      profile: "",
    });
  }
  return user;
};
export const setUpChat = async ({
  _id,
  name,
}: {
  _id: string;
  name: string;
}) => {
  try {
    let key: IDBValidKey = 0;

    const user = await userDB.findOne({
      _id: _id,
    });

    if (!user) {
      key = await userDB.save({
        _id: _id,
        name: name,
        profile: "",
      });
    } else key = user.id;
    let chatdb = (await chatSessionDB.findOne({
      name: `chat:${_id}`,
    })) as docdb;
    if (!chatdb) {
      const session_id = await chatSessionDB.save({
        name: `chat:${_id}`,
        reciver_id: key,
      });
      chatdb = (await chatSessionDB.findOne({
        id: session_id,
      })) as docdb;
    }
    return chatdb;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
export type useChats = ({
  _id,
  name,
}: {
  id: number;
  _id: string;
  name: string;
  profile: string;
}) => {
  save: (message: string) => Promise<messageDBdb>;
  setupCurrentUser: ({ _id }: { _id: string }) => Promise<void>;
  messages: messageDBdb[];
  reciver: docdbUser;
};
export const useChats: useChats = ({
  _id,
  name,
}: {
  id: number;
  _id: string;
  name: string;
  profile: string;
}) => {
  const [messages, setMessages] = useState<messageDBdb[]>([]);
  const [reciver, setReciver] = useState<docdbUser>({
    name: "",
    id: 0,
    _id: "",
    profile: "",
  });
  const ref = useRef<{
    session_id: IDBValidKey;
    sender_id: IDBValidKey;
    reciver_id: IDBValidKey;
    sender__id: string;
    reciver__id: string;
  }>({
    session_id: 0,
    sender_id: 0,
    reciver_id: 0,
    sender__id: "",
    reciver__id: "",
  });

  const getMessages = async () => {
    try {
      const messages_list = await messageDB.find({
        session_id: ref.current.session_id,
      });
      console.log("messages: ", messages_list);
      setMessages(messages_list);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const init = async () => {
    try {
      const chatdb = await setUpChat({
        _id: _id,
        name: name,
      });
      ref.current.reciver_id = chatdb.reciver_id;
      ref.current.session_id = chatdb.id;
      const reciver_user = (await userDB.findOne({
        id: chatdb.reciver_id,
      })) as docdbUser;
      ref.current.reciver__id = reciver_user?._id || "";
      setReciver(reciver_user);
      await getMessages();
    } catch (error) {}
  };

  useEffect(() => {
    try {
      init();
      return () => {
        setMessages([]);
      };
    } catch (err: any) {
      console.log(err.message);
    }
  }, [_id]);
  useEffect(() => {
    try {
      const handler = (e: CustomEvent<messageDBdb>) => {
        setMessages((prev) => [...prev, e.detail]);
      };
      listen_event(handler);
      return () => {
        remove_listener(handler);
      };
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);

  const setupCurrentUser = async ({ _id }: { _id: string }) => {
    try {
      const user = await setupCurrentUserHandler(_id);
      ref.current.sender_id = user?.id || 0;
      ref.current.sender__id = user?._id || "";
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const save = async (message: string) => {
    const time = new Date();
    console.log(
      time.toUTCString(),
      ref.current.sender_id,
      "to",
      ref.current.reciver_id,
      "message: ",
      message
    );

    const record = await messageDB.save({
      content: message,
      session_id: ref.current.session_id,
      created_at: time,
      from: ref.current.sender__id,
      to: ref.current.reciver__id,

      is_deliverd: false,
      deliverd_time: null,
      content_type: "text",
      command: "add",
    });

    if (record) {
      setMessages((prev) => [...prev, record]);
      return record;
    }
    throw new Error("unable to save messages");
  };

  return {
    save,
    setupCurrentUser,
    messages,
    reciver,
  };
};
