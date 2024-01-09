import { useContext, useEffect, useRef } from "react";
import { WSContext } from "../context/ws";
import { chatSessionDB } from "../web-api/Index-db/chat-session";
import { key_event } from "../context/events-type";
import { userDB } from "../web-api/Index-db/user";
import { messageDBdb } from "../web-api/Index-db/messages";

export const UseSendMessage = ({
  _id,
}: {
  id: number;
  _id: string;
  name: string;
  profile: string;
}) => {
  const ref = useRef<{ shared_key: CryptoKey | null }>({
    shared_key: null,
  });
  const { socket } = useContext(WSContext);

  console.log(socket, ref);
  const init = async () => {
    try {
      if (!socket || !_id) return;
      const user = await userDB.findOne({ _id });
      const chatSession = await chatSessionDB.findOne({
        reciver_id: user?.id,
      });
      if (chatSession?.shared_key) {
        ref.current.shared_key = chatSession?.shared_key;
        return;
      }
      console.log("s-get-key-event: ", _id);

      socket?.emit(key_event.s_init_chat, { userId: _id });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const sendMessage = async (message: messageDBdb) => {
    try {
      console.log(key_event.s_post_new_message, socket, ref.current.shared_key);
      if (!socket || !ref.current.shared_key) return;

      console.log("s-send-message: ", _id);
      const encodedText = new TextEncoder().encode(message.content);
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: new TextEncoder().encode(message.iv),
        },
        ref.current.shared_key,
        encodedText
      );

      const uintArray = new Uint8Array(encryptedData) as unknown as number[];
      const string = String.fromCharCode.apply(null, uintArray);

      const base64Data = btoa(string);
      message.content = base64Data;
      console.log(message);
      socket.emit(key_event.s_post_new_message, message);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const decriptMessage = async () => {
    try {
      if (!socket || !ref.current.shared_key) return;

      const initializationVector = new TextEncoder().encode(
        "Initialization Vector"
      );

      const string = atob("CNd8QeP+kIZZqVpJ+vhHFWLIR6Y=");
      const uintArray = new Uint8Array(
        [...string].map((char) => char.charCodeAt(0))
      );
      const algorithm = {
        name: "AES-GCM",
        iv: initializationVector,
      };
      const decryptedData = await window.crypto.subtle.decrypt(
        algorithm,
        ref.current.shared_key,
        uintArray
      );

      const text = new TextDecoder().decode(decryptedData);
      console.log(text);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    try {
      init();
    } catch (err: any) {
      console.log(err.message);
    }
  }, [_id]);
  return {
    sendMessage,
    decriptMessage,
  };
};
