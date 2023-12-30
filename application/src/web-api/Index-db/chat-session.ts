import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "chat-session";

type docdb = {
  id: number;
  name: string;
  reciver_id: number;
};
type Attars = {
  name: string;
  reciver_id: number;
};

export class chatSessionDB {
  private static ref: Schema<docdb, Attars> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (chatSessionDB.ref) {
      console.log("chatSessionDB already initialized");
      return;
    }
    console.log("init chat session db");
    chatSessionDB.ref = new Schema(
      {
        connection: connection,
        name: key,
        indexKey: "id",
        isAutoincrement: true,
        indexs: [
          {
            field: "name",
            options: {
              unique: true,
            },
            command: "create",
          },
          {
            field: "reciver_id",
            options: {
              unique: true,
            },
            command: "create",
          },
        ],
      },
      isVersionChange
    );
  }
  static save(data: Attars) {
    if (!chatSessionDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return chatSessionDB.ref.save(data);
  }
  static find() {
    if (!chatSessionDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return chatSessionDB.ref.find();
  }
}
