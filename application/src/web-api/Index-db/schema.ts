import { IDBPDatabase, IDBPObjectStore, IDBPTransaction } from "idb";
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
export interface TCount {
  field: string;
  value: string;
}
export class Schema<TSchema, TAttrs, TQuery> {
  protected connection: IDBPDatabase<unknown>;
  protected name: string;
  constructor(
    db: db,
    isVersionChange: boolean,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
  ) {
    this.verifyDB(db);
    this.connection = db.connection;

    this.name = db.name;
    if (!isVersionChange) return;
    let store_ref:
      | IDBPObjectStore<unknown, ArrayLike<string>, string, "versionchange">
      | undefined = undefined;
    if (!this.connection.objectStoreNames.contains(db.name)) {
      store_ref = this.connection.createObjectStore(db.name, {
        keyPath: db.indexKey,
        autoIncrement: db.isAutoincrement,
      });
    } else {
      store_ref = transaction?.objectStore(this.name);
    }

    if (!store_ref) return;
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
          if (index.command == "create") return;
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
    return this.connection.add(this.name, data);
  }

  async find(query?: TQuery): Promise<TSchema[]> {
    if (!query) {
      const data = (await this.connection.getAll(this.name)) as TSchema[];
      return data;
    }
    for (const key in query) {
      const keyValue = query[key] as IDBValidKey;
      const isQueryParam = this.checkQueryParams(keyValue);
      if (!isQueryParam) continue;
      if (key === "id") {
        const data = (await this.findById(keyValue)) as TSchema;
        if (!data) return [];
        return [data];
      }
      return (await this.connection.getAllFromIndex(
        this.name,
        key,
        keyValue
      )) as TSchema[];
    }
    return [];
  }

  async count(query: TCount) {
    const data = await this.find();
    if (!data) return 0;
    if (!query) return data.length;
    if (!query.field || !query.value) return data.length;
    // @ts-ignore
    return data.filter((val) => val[query?.field] === query?.value).length;
  }

  async findOne(query: TQuery): Promise<TSchema | null> {
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

  async findAndUpdate(query: TQuery[], data: TQuery[]) {
    if (!query || !data) {
      return false;
    }

    const transaction = this.connection.transaction(this.name, "readwrite");
    const transaction_events = [];
    for (let i = 0; i < query.length; i++) {
      const q = query[i];
      const d = data[i];

      if (!q || !d) break;
      for (const key in q) {
        const keyValue = q[key] as IDBValidKey;
        const isQueryParam = this.checkQueryParams(keyValue);
        if (!isQueryParam) continue;

        transaction_events.push(transaction.store.put(d));
        break;
      }
    }
    transaction_events.push(transaction.done);
    await Promise.all(transaction_events);

    return true;
  }
  async findOneAndUpdate(query: TQuery, data: TQuery) {
    if (!query || !data) {
      return false;
    }

    for (const key in query) {
      const keyValue = query[key] as IDBValidKey;
      const isQueryParam = this.checkQueryParams(keyValue);
      if (!isQueryParam) continue;
      const record_id = await this.connection.getKeyFromIndex(
        this.name,
        key,
        keyValue
      );
      if (record_id) {
        return await this.findByIdAndUpdate(record_id, data);
      }
    }
    return null;
  }
  async findByIdAndUpdate(id: IDBValidKey, data: TQuery) {
    const val = await this.findById(id);
    console.log("val: ", val, id);
    if (!val) return false;
    console.log({
      ...val,
      ...data,
    });
    return await this.connection.put(this.name, {
      ...val,
      ...data,
      // @ts-ignore
      id: val.id,
    });
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

  async remove(query: TQuery) {
    for (const key in query) {
      const keyValue = query[key] as IDBValidKey;
      const isQueryParam = this.checkQueryParams(keyValue);
      if (!isQueryParam) continue;
      let id: IDBValidKey | undefined = keyValue;
      if (key !== "id") {
        id = await this.connection.getKeyFromIndex(this.name, key, keyValue);
      }
      if (!id) continue;
      this.connection.delete(this.name, id);
      this.connection.get;
      return true;
    }

    return false;
  }
}
