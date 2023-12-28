import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "key";

type keydb = {
  id: number;
  public_key: string;
  created_at: Date;
};
type keydbAttars = {
  public_key: string;
  created_at: Date;
};

export class KeyDB {
  private static ref: Schema<keydb, keydbAttars> | null = null;

  static async init(connection: IDBPDatabase<unknown>) {
    if (KeyDB.ref) {
      throw new Error("KeyDB already initialized");
    }
    KeyDB.ref = new Schema({
      connection: connection,
      name: key,
      indexKey: "id",
      isAutoincrement: true,
    });
  }
  static save(data: keydbAttars) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.save(data);
  }
}
