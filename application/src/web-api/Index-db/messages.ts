import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "message";

type messageDBdb = {
  id: IDBValidKey;
  session_id: IDBValidKey;
  created_at: Date;
  content: string;
  sender_id: IDBValidKey;
  reciver_id: IDBValidKey;
  is_read: boolean;
  read_time: Date;
  is_deleted: boolean;
  deleted_time: Date;
  is_sent: boolean;
  is_deliverd: boolean;
  deliverd_time: Date;
};
type messageDBAttars = {
  session_id: IDBValidKey;
  created_at: Date;
  content: string;
  sender_id: IDBValidKey;
  reciver_id: IDBValidKey;
  is_read: boolean;
  read_time: Date | null;
  is_deleted: boolean;
  deleted_time: Date | null;
  is_sent: boolean;
  is_deliverd: boolean;
  deliverd_time: Date | null;
};

export class messageDB {
  private static ref: Schema<messageDBdb, messageDBAttars, any> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (messageDB.ref) {
      console.log("messageDB already initialized");
      return;
    }
    console.log("init message db");
    messageDB.ref = new Schema(
      {
        connection: connection,
        name: key,
        indexKey: "id",
        isAutoincrement: true,
        indexs: [
          {
            field: "session_id",
            options: {
              unique: false,
            },
            command: "create",
          },
        ],
      },
      isVersionChange
    );
  }
  static save(data: messageDBAttars) {
    if (!messageDB.ref) {
      throw new Error("messageDB not initialized");
    }
    return messageDB.ref.save(data);
  }
  static find() {
    if (!messageDB.ref) {
      throw new Error("messageDB not initialized");
    }
    return messageDB.ref.find();
  }
}
