import { openDB, IDBPDatabase } from "idb";

const database_name = "key-exchanger";
const database_version = 1;
export class ApplicationDb {
  private static connection: IDBPDatabase<unknown> | null = null;

  private static async open() {
    console.log("Opening database");
    const connection = await openDB(database_name, database_version);
    ApplicationDb.connection = connection;
  }
  public static db() {
    return ApplicationDb.connection;
  }
  public static async init() {
    await ApplicationDb.open();
  }
}
