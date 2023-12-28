import { IDBPDatabase } from "idb";
interface db {
  connection: IDBPDatabase<unknown>;
  name: string;
  indexKey: string;
  isAutoincrement: boolean;
}
export class Schema<TSchema, TAttrs> {
  protected connection: IDBPDatabase<unknown>;
  protected name: string;
  constructor(db: db) {
    this.verifyDB(db);
    this.connection = db.connection;
    console.log("db init: ", db.name);
    this.name = db.name;
    if (!this.connection.objectStoreNames.contains(db.name)) {
      console.log("creating key store");

      this.connection.createObjectStore(db.name, {
        keyPath: db.indexKey,
        autoIncrement: db.isAutoincrement,
      });
    }
  }

  save(data: TAttrs) {
    this.connection.add(this.name, data);
    return true;
  }

  async find(): Promise<TSchema[]> {
    const data = (await this.connection.getAll(this.name)) as TSchema[];
    return data;
  }

  protected verifyDB(db: db) {
    if (!db.connection) {
      throw new Error("No database connection");
    }
    if (!db.name) {
      throw new Error("No database name");
    }
    if (!db.indexKey) {
      throw new Error("No index key");
    }
    if (!db.isAutoincrement) {
      throw new Error("No autoincrement");
    }
    return true;
  }
}
