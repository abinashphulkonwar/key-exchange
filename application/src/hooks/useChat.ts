import { useEffect, useRef, useState } from "react";
import { chatSessionDB } from "../web-api/Index-db/chat-session";
import { messageDB, messageDBdb } from "../web-api/Index-db/messages";
import { userDB } from "../web-api/Index-db/user";

export const useChats = ({
  _id,
  name,
}: {
  id: number;
  _id: string;
  name: string;
  profile: string;
}) => {
  const [messages, setMessages] = useState<messageDBdb[]>([]);
  const ref = useRef<{
    session_id: IDBValidKey;
    sender_id: IDBValidKey;
    reciver_id: IDBValidKey;
  }>({
    session_id: 0,
    sender_id: 0,
    reciver_id: 0,
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
      let session_key: IDBValidKey = 0;
      const chatdb = await chatSessionDB.findOne({
        name: `chat:${_id}`,
      });
      session_key = chatdb?.id || 0;
      if (!chatdb) {
        session_key = await chatSessionDB.save({
          name: `chat:${_id}`,
          reciver_id: key,
        });
      }
      ref.current.reciver_id = key;
      ref.current.session_id = session_key;
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

  const setupCurrentUser = async ({ _id }: { _id: string }) => {
    try {
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
      ref.current.sender_id = user?.id || 0;
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

    const key = await messageDB.save({
      content: message,
      session_id: ref.current.session_id,
      created_at: time,
      sender_id: ref.current.session_id,
      reciver_id: ref.current.reciver_id,
      is_read: false,
      read_time: time,
      is_deleted: false,
      deleted_time: time,
      is_sent: false,
      is_deliverd: false,
      deliverd_time: null,
    });
    const record = await messageDB.findOne({ id: key });
    if (record) {
      setMessages((prev) => [...prev, record]);
    }
  };

  return {
    save,
    setupCurrentUser,
    messages,
  };
};
