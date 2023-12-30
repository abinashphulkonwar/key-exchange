import { IDBPDatabase } from "idb";
import { Schema } from "./schema";
const key = "user";

type docdb = {
  id: number;
  _id: string;
  name: string;
  profile: string;
};
type Attars = {
  name: string;
  _id: string;

  profile: string;
};

export class userDB {
  private static ref: Schema<docdb, Attars> | null = null;

  static async init(
    connection: IDBPDatabase<unknown>,
    isVersionChange: boolean
  ) {
    if (userDB.ref) {
      console.log("usersDB already initialized");
      return;
    }
    console.log("init user db");
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
      isVersionChange
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
}
