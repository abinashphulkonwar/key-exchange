import { chatSessionDB } from "../web-api/Index-db/chat-session";

export const useChats = () => {
  const init = () => {
    try {
      const chatdb = chatSessionDB.find();
      console.log(chatdb);
    } catch (error) {}
  };

  return {
    init,
  };
};
