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

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (KeyDB.ref) {
      throw new Error("KeyDB already initialized");
    }
    console.log("init key db");
    KeyDB.ref = new Schema(
      {
        connection: connection,
        name: key,
        indexKey: "id",
        isAutoincrement: true,
      },
      isVersionChange
    );
  }
  static save(data: keydbAttars) {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.save(data);
  }
  static find() {
    if (!KeyDB.ref) {
      throw new Error("KeyDB not initialized");
    }
    return KeyDB.ref.find();
  }
}
