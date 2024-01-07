import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "events";

type event_types =
  | "key"
  | "init_chat"
  | "init_chat_inform_about_private_key"
  | "send_message"
  | "new_message";

type docdb = {
  id: IDBValidKey;
  _id: string;
  type: event_types;
  data: any;
};

type docdbQuery = {
  _id?: string;
  id?: IDBValidKey;
  type?: event_types;
};
type Attars = {
  type: event_types;
  _id: string;
  data: any;
};

export class eventsDB {
  private static ref: Schema<docdb, Attars, docdbQuery> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
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
        ],
      },
      isVersionChange
    );
  }
  static async save(data: Attars) {
    if (!eventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return eventsDB.ref.save(data);
  }
  static find() {
    if (!eventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return eventsDB.ref.find();
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
  static async insert_event(query: docdb) {
    eventsDB.init_error();
    const id = await eventsDB.save(query);
    const doc = (await eventsDB.findOne({ id: id })) as docdb;
    return doc;
  }
  static async pull_events() {
    eventsDB.init_error();
    const doc = await eventsDB.find();
    return doc;
  }

  static async remove_event_by_id(id: IDBValidKey) {
    eventsDB.init_error();
    return await eventsDB.ref?.remove({
      id: id,
    });
  }
}
