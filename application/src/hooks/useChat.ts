import { chatSessionDB } from "../web-api/Index-db/chat-session";
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
  const init = async () => {
    try {
      const user = userDB.findOne({
        _id: _id,
      });
      if (!user) {
        await userDB.save({
          _id: _id,
          name: name,
          profile: "",
        });
      }
      const chatdb = await chatSessionDB.findOne({
        name: `chat:${_id}`,
      });
      if (!chatdb) {
        await chatSessionDB.save({
          name: `chat:${_id}`,
          reciver_id: 0,
        });
      }
    } catch (error) {}
  };

  return {
    init,
  };
};
