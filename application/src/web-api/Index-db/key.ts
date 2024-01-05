import { IDBPDatabase } from "idb";
import { Schema, TCount } from "./schema";
const key = "key";
export const keydb_status_assigned = "assigned";
export const keydb_status_unassigned = "unassigned";

export const keydb_status_deleted = "deleted";
export const keydb_status_pushed = "pushed";
export type keydb_status = "assigned" | "unassigned" | "deleted" | "pushed";
type keydb = {
  id: number;
  public_key: JsonWebKey;
  private_key: JsonWebKey;
  created_at: Date;
  assigned_user__id: string;
  assigned_user_id: IDBValidKey;
  status: keydb_status;
};
type docQuery = {
  id?: number;
  public_key?: JsonWebKey;
  private_key?: JsonWebKey;
  assigned_user__id?: string;
  assigned_user_id?: IDBValidKey;
  status?: keydb_status;
};
type keydbAttars = {
  public_key: JsonWebKey;
  private_key: JsonWebKey;
  created_at?: Date;
  status?: keydb_status;
};

interface TCountKey extends TCount {
  field:
    | "id"
    | "assigned_user_id"
    | "public_key"
    | "assigned_user__id"
    | "status"
    | "created_at"
    | "private_key";
}

export class KeyDB {
  private static ref: Schema<keydb, keydbAttars, any> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (KeyDB.ref) {
      console.log("KeyDB already initialized");
      return;
    }
    KeyDB.ref = new Schema(
      {
        connection: connection,
        name: key,
        indexKey: "id",
        isAutoincrement: true,
        indexs: [
          {
            field: "assigned_user__id",
            options: {
              unique: false,
            },
            command: "create",
          },
          {
            field: "assigned_user_id",
            options: {
              unique: false,
            },
            command: "create",
          },
          {
            field: "public_key",
            options: {
              unique: false,
            },
            command: "create",
          },
          {
            field: "status",
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
  static save(data: keydbAttars) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    (data.created_at = new Date()), (data.status = "unassigned");
    return KeyDB.ref.save(data);
  }
  static find(query?: docQuery) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.find(query);
  }

  static count(query: TCountKey) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.count(query);
  }

  static findAndUpdate(query: docQuery[], data: docQuery[]) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.findAndUpdate(query, data);
  }
  static findOne(query: docQuery) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.findOne(query);
  }
}
