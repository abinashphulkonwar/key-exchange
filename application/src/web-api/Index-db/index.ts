import { openDB, IDBPDatabase } from "idb";
import { KeyDB } from "./key";

const database_name = "key-exchanger";
const database_version = 1;
export class ApplicationDb {
  private static connection: IDBPDatabase<unknown> | null = null;

  private static async open() {
    console.log("Opening database");
    openDB(database_name, database_version, {
      async upgrade(database) {
        await KeyDB.init(database);
      },
    }).then((connection) => {
      console.log("Database opened");
      ApplicationDb.connection = connection;
    });
  }

  public static db() {
    return ApplicationDb.connection;
  }
  public static async init() {
    await ApplicationDb.open();
  }
}
