import { IDBPDatabase, IDBPTransaction } from "idb";
import { Schema } from "./schema";
const key = "processed-events";

type processed_event_state = "success" | "error";

export interface interfaceProcessedEventsDB {
  id: IDBValidKey;
  _id: string;
  created_at: Date;
  state: processed_event_state;
  event_id: IDBValidKey;
}

type docdbQuery = {
  _id?: string;
  id?: IDBValidKey;
  event_id?: IDBValidKey;
};
type Attars = {
  _id: string;
  created_at: Date;
  state: processed_event_state;
  event_id?: IDBValidKey;
};

export class processedEventsDB {
  private static ref: Schema<
    interfaceProcessedEventsDB,
    Attars,
    docdbQuery
  > | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
  ) {
    if (processedEventsDB.ref) {
      console.log("processedEventsDB already initialized");
      return;
    }
    console.log("init processedEventsDB db");
    processedEventsDB.ref = new Schema(
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
          {
            field: "event_id",
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
  static async save(data: Attars) {
    if (!processedEventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return processedEventsDB.ref.save(data);
  }
  static find(query: docdbQuery) {
    if (!processedEventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return processedEventsDB.ref.find(query);
  }
  static findOne(query: docdbQuery) {
    if (!processedEventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
    return processedEventsDB.ref.findOne(query);
  }
  private static init_error() {
    if (!processedEventsDB.ref) {
      throw new Error("eventsDB not initialized");
    }
  }
  static async insert_event(query: interfaceProcessedEventsDB) {
    processedEventsDB.init_error();
    const id = await processedEventsDB.save(query);
    const doc = (await processedEventsDB.findOne({
      id: id,
    })) as interfaceProcessedEventsDB;
    return doc;
  }
  static async pull_events() {
    processedEventsDB.init_error();
    const doc = await processedEventsDB.find({});
    return doc;
  }

  static async remove_event_by_id(id: IDBValidKey) {
    processedEventsDB.init_error();
    return await processedEventsDB.ref?.remove({
      id: id,
    });
  }
}
