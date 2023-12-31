import { IDBPDatabase, IDBPTransaction } from "idb";
import { Schema } from "./schema";
const key = "chat-session";

export type docdb = {
  id: IDBValidKey;
  name: string;

  reciver_id: IDBValidKey;
  reciver_public_key: JsonWebKey;
  shared_key: CryptoKey;
};

type docdbQuery = {
  id?: IDBValidKey;
  name?: string;
  reciver_id?: IDBValidKey;
  reciver_public_key?: JsonWebKey;
  shared_key?: CryptoKey;
};
type Attars = {
  name: string;
  reciver_id: IDBValidKey;
  reciver_public_key?: JsonWebKey;
};

export class chatSessionDB {
  private static ref: Schema<docdb, Attars, docdbQuery> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
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
      isVersionChange,
      transaction
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
  static findAndUpdate(query: docdbQuery[], data: docdbQuery[]) {
    if (!chatSessionDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return chatSessionDB.ref.findAndUpdate(query, data);
  }
}
