import { IDBPDatabase, IDBPTransaction } from "idb";
import { Schema } from "./schema";
const key = "user";

type docdb = {
  id: IDBValidKey;
  _id: string;
  name: string;
  profile: string;
};
type docdbQuery = {
  id?: number;
  _id?: string;
  name?: string;
  profile?: string;
};

type Attars = {
  name: string;
  _id: string;

  profile: string;
};

export class userDB {
  private static ref: Schema<docdb, Attars, docdbQuery> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
  ) {
    if (userDB.ref) {
      console.log("usersDB already initialized");
      return;
    }
    userDB.ref = new Schema(
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
      isVersionChange,
      transaction
    );
  }
  static save(data: Attars) {
    if (!userDB.ref) {
      throw new Error("userDB not initialized");
    }
    return userDB.ref.save(data);
  }
  static find() {
    if (!userDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return userDB.ref.find();
  }
  static findOne(query: docdbQuery) {
    if (!userDB.ref) {
      throw new Error("chatSessionDB not initialized");
    }
    return userDB.ref.findOne(query);
  }
}
