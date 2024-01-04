import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "events";

type docdb = {
  id: IDBValidKey;
  type: "push_message" | "pull_keys";
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

export class ventsDB {
  private static ref: Schema<docdb, Attars, docdbQuery> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (ventsDB.ref) {
      console.log("ventsDB already initialized");
      return;
    }
    console.log("init vents db");
    ventsDB.ref = new Schema(
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
    if (!ventsDB.ref) {
      throw new Error("ventsDB not initialized");
    }
    return ventsDB.ref.save(data);
  }
  static find() {
    if (!ventsDB.ref) {
      throw new Error("ventsDB not initialized");
    }
    return ventsDB.ref.find();
  }
  static findOne(query: docdbQuery) {
    if (!ventsDB.ref) {
      throw new Error("ventsDB not initialized");
    }
    return ventsDB.ref.findOne(query);
  }
}
