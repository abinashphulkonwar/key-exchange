import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "message";

type messageDBdb = {
  id: number;
  session_id: number;
  created_at: Date;
  content: string;
  sender_id: string;
  reciver_id: string;
  is_read: boolean;
  read_time: Date;
  is_deleted: boolean;
  deleted_time: Date;
  is_sent: boolean;
  is_deliverd: boolean;
  deliverd_time: Date;
};
type messageDBAttars = {
  session_id: number;
  created_at: Date;
  content: string;
  sender_id: string;
  reciver_id: string;
  is_read: boolean;
  read_time: Date;
  is_deleted: boolean;
  deleted_time: Date;
  is_sent: boolean;
  is_deliverd: boolean;
  deliverd_time: Date;
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
              unique: true,
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
