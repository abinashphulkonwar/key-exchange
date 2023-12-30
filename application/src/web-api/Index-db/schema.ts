import { IDBPDatabase, IDBPObjectStore } from "idb";
interface db {
  connection: IDBPDatabase<unknown>;
  name: string;
  indexKey: string;
  isAutoincrement: boolean;
  indexs?: {
    field: string;
    options?: IDBIndexParameters;
    command: "create" | "delete" | "recreate";
  }[];
}
export class Schema<TSchema, TAttrs> {
  protected connection: IDBPDatabase<unknown>;
  protected name: string;
  constructor(db: db, isVersionChange: boolean) {
    this.verifyDB(db);
    this.connection = db.connection;

    this.name = db.name;
    if (!isVersionChange) return;
    let store_ref: IDBPObjectStore<
      unknown,
      ArrayLike<string>,
      string,
      "versionchange"
    > | null = null;
    if (!this.connection.objectStoreNames.contains(db.name)) {
      console.log("creating key store");

      store_ref = this.connection.createObjectStore(db.name, {
        keyPath: db.indexKey,
        autoIncrement: db.isAutoincrement,
      });
    }
    if (!store_ref)
      store_ref = this.connection.transaction(db.name, "versionchange").store;
    if (db.indexs && db.indexs.length) {
      db.indexs.forEach((index) => {
        if (store_ref?.indexNames.contains(index.field)) {
          if (index.command === "delete") {
            store_ref?.deleteIndex(index.field);
            return;
          }
          if (index.command === "recreate") {
            store_ref.deleteIndex(index.field);
          }
        }
        if (index.command === "delete") return;
        if (store_ref) {
          store_ref.createIndex(index.field, index.field, {
            unique: index.options?.unique || false,
            multiEntry: index.options?.multiEntry || false,
          });
        }
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

  async findOne(query: TSchema): Promise<TSchema | null> {
    for (const key in query) {
      const keyValue = query[key] as IDBValidKey;
      const isQueryParam = this.checkQueryParams(keyValue);
      if (!isQueryParam) continue;
      if (key === "id") return await this.findById(keyValue);
      return await this.findOneByIndex(key, keyValue);
    }

    return null;
  }

  protected async findOneByIndex(
    index: string,
    value: IDBValidKey
  ): Promise<TSchema | null> {
    const data = (await this.connection.getFromIndex(
      this.name,
      index,
      value
    )) as TSchema;

    return data;
  }

  protected async findById(id: IDBValidKey): Promise<TSchema | null> {
    const data = (await this.connection.get(this.name, id)) as TSchema;
    return data;
  }
  protected checkQueryParams(value: any) {
    if (!value) return false;
    if (
      typeof value !== "number" &&
      typeof value !== "string" &&
      !(value instanceof Date)
    ) {
      return false;
    }
    return true;
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
