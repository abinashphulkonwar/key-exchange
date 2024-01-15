import { IDBPDatabase, IDBPTransaction } from "idb";
import { Schema } from "./schema";
const key = "message";

export type message_type =
  | "text"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "location"
  | "contact"
  | "sticker"
  | "document"
  | "poll"
  | "url";
export type messageDBdb = {
  id: IDBValidKey;
  session_id: IDBValidKey;
  is_read: boolean;
  is_read_event_created: boolean;
  read_time: Date;
  is_deleted: boolean;
  deleted_time: Date;
  is_deliverd: boolean;
  deliverd_time: Date;
  to: string;
  from: string;
  content: string;
  content_type: message_type;
  command: "add" | "delete";
  message_id: string;
  created_at: Date;
  iv: string;
};

type docdbQuery = {
  id?: IDBValidKey;
  session_id?: IDBValidKey;
  created_at?: Date;
  content?: string;
  sender_id?: IDBValidKey;
  reciver_id?: IDBValidKey;
  is_read_event_created?: boolean;
  is_read?: boolean;
  read_time?: Date;
  is_deleted?: boolean;
  deleted_time?: Date;
  is_sent?: boolean;
  is_deliverd?: boolean;
  deliverd_time?: Date;
};
export type messageDBAttars = {
  session_id: IDBValidKey;
  is_deliverd: boolean;
  deliverd_time: Date | null;
  to: string;
  from: string;
  content: string;
  content_type: message_type;
  command: "add" | "delete";
  message_id?: string;
  created_at: Date;
  iv?: string;
  is_read_event_created?: boolean;
};

export class messageDB {
  private static ref: Schema<messageDBdb, messageDBAttars, any> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
  ) {
    if (messageDB.ref) {
      console.log("messageDB already initialized");
      return;
    }
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
          {
            field: "message_id",
            options: {
              unique: false,
            },
            command: "create",
          },
        ],
      },
      isVersionChange,
      transaction
    );
  }
  static async save(data: messageDBAttars, is_pull_event = false) {
    if (!messageDB.ref) {
      throw new Error("messageDB not initialized");
    }
    if (!is_pull_event) {
      data.is_deliverd = false;
      data.deliverd_time = null;
      data.created_at = new Date();
      data.message_id = crypto.randomUUID();
      data.iv = crypto.randomUUID();
    } else {
      data.iv = "";
    }
    const id = await messageDB.ref.save(data);
    return await messageDB.findOne({
      id: id,
    });
  }
  static find(query: docdbQuery) {
    if (!messageDB.ref) {
      throw new Error("messageDB not initialized");
    }
    return messageDB.ref.find(query);
  }
  static findOne(query: docdbQuery) {
    if (!messageDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return messageDB.ref.findOne(query);
  }

  static findOneUpdate(id: IDBValidKey, data: docdbQuery) {
    if (!messageDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return messageDB.ref.findByIdAndUpdate(id, data);
  }
  static findAndUpdate(query: docdbQuery[], data: docdbQuery[]) {
    if (!messageDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return messageDB.ref.findAndUpdate(query, data);
  }
  static findByIdAndUpdate(query: messageDBdb["id"], data: docdbQuery) {
    if (!messageDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return messageDB.ref.findByIdAndUpdate(query, data);
  }
}
