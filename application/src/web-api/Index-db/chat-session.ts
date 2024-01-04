import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "chat-session";

type docdb = {
  id: IDBValidKey;
  name: string;
  reciver_id: IDBValidKey;
  shared_key: CryptoKey;
};

type docdbQuery = {
  id?: number;
  name?: string;
  reciver_id?: IDBValidKey;
};
type Attars = {
  name: string;
  reciver_id: IDBValidKey;
};

export class chatSessionDB {
  private static ref: Schema<docdb, Attars, docdbQuery> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (chatSessionDB.ref) {
      console.log("chatSessionDB already initialized");
      return;
    }
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
  static findOne(query: docdbQuery) {
    if (!chatSessionDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return chatSessionDB.ref.findOne(query);
  }
}
