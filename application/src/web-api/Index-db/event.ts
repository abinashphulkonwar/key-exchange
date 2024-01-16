import { IDBPDatabase, IDBPTransaction } from "idb";
import { Schema } from "./schema";
import { message_type } from "./messages";
const key = "events";

export interface message_event {
  to: string;
  from: string;
  content: string;
  content_type: message_type;
  command: "add" | "delete";
  message_id: IDBValidKey;
  created_at: Date;
  iv: string;
}

export interface message_recipts_event {
  to: string;
  message_id: string;
  command: "read" | "deliverd" | "ack";
  time: Date;
  event_id: number;
}

type event_types =
  | "key"
  | "init_chat"
  | "init_chat_inform_about_private_key"
  | "send_message"
  | "new_message"
  | "pull_message"
  | "send_recipts"
  | "get_recipts"
  | "send_recipts_ack"
  | "get_recipts_ack";

type push_event_id = `not-processed:${string}`;

export const pushedEventId = (id: IDBValidKey): push_event_id =>
  `not-processed:${id}`;

type event_state = "pending" | "done" | "error";
export interface interfaceEventsDB {
  id: IDBValidKey;
  _id: string;
  type: event_types;
  data: message_event | message_recipts_event | any;
  state: event_state;
  last_process_time: Date;
}

type docdbQuery = {
  _id?: string;
  id?: IDBValidKey;
  type?: event_types;
  state?: event_state;
};
type Attars = {
  type: event_types;
  _id: string;
  data: message_event | message_recipts_event | any;
  state?: event_state;
  last_process_time?: Date;
};

export class eventsDB {
  private static ref: Schema<interfaceEventsDB, Attars, docdbQuery> | null =
    null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
  ) {
    if (eventsDB.ref) {
      console.log("eventsDB already initialized");
      return;
    }
    console.log("init events db");
    eventsDB.ref = new Schema(
      {
        connection: connection,
        name: key,
        indexKey: "id",
        isAutoincrement: true,
        indexs: [
          {
            field: "_id",
            options: {
              unique: true,
            },
            command: "create",
          },
          {
            field: "state",
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
  static async save(data: Attars) {
    if (!eventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    if (!data.state) data.state = "pending";
    return eventsDB.ref.save(data);
  }
  static find(query: docdbQuery) {
    if (!eventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return eventsDB.ref.find(query);
  }

  static findOne(query: docdbQuery) {
    if (!eventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return eventsDB.ref.findOne(query);
  }
  private static init_error() {
    if (!eventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
  }
  static async insert_event(query: interfaceEventsDB) {
    eventsDB.init_error();
    const id = await eventsDB.save(query);
    const doc = (await eventsDB.findOne({ id: id })) as interfaceEventsDB;
    return doc;
  }
  static async pull_events() {
    eventsDB.init_error();
    const doc = await eventsDB.find({
      state: "pending",
    });

    return doc?.filter((val) => {
      if (!val.last_process_time) return true;
      const last_process_time = new Date(val.last_process_time);
      const now = new Date();
      const diff = now.getTime() - last_process_time.getTime();
      if (diff >= 1000 * 60) return true;
      return false;
    });
  }

  static async remove_event_by_id(id: IDBValidKey) {
    eventsDB.init_error();
    return await eventsDB.ref?.remove({
      id: id,
    });
  }

  static async findAndUpdate(query: docdbQuery[], update: docdbQuery[]) {
    eventsDB.init_error();
    return await eventsDB.ref?.findAndUpdate(query, update);
  }
  static async findByIdAndUpdate(key: IDBValidKey, data: interfaceEventsDB) {
    eventsDB.init_error();
    data.last_process_time = new Date();
    return await eventsDB.ref?.findByIdAndUpdate(key, data);
  }
}
