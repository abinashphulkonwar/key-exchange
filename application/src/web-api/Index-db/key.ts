import { IDBPDatabase, IDBPObjectStore } from "idb";
const key = "key";
export class KeyDB {
  private static connection: IDBPDatabase<unknown> | null = null;
  private static db: IDBPObjectStore<
    unknown,
    ArrayLike<string>,
    "key",
    "versionchange"
  > | null = null;
  static check_db_connection() {
    if (!KeyDB.connection) {
      throw new Error("database not initialized");
    }

    if (!KeyDB.db) {
      throw new Error("KeyDB not initialized");
    }
  }
  static async init(connection: IDBPDatabase<unknown>) {
    if (KeyDB.connection) {
      throw new Error("KeyDB already initialized");
    }

    KeyDB.connection = connection;
    if (!connection.objectStoreNames.contains(key)) {
      console.log("creating key store");

      const keydb = connection.createObjectStore(key, {
        keyPath: "id",
        autoIncrement: true,
      });
      KeyDB.db = keydb;
    }
  }
}
