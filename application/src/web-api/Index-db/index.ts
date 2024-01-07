import { openDB, IDBPDatabase } from "idb";
import { KeyDB } from "./key";
import { messageDB } from "./messages";
import { chatSessionDB } from "./chat-session";
import { userDB } from "./user";
import { ApplicationCrypto } from "../web-crypto";
import { eventsDB } from "./event";

const database_name = "key-exchanger";
const database_version = 4;

export class ApplicationDb {
  private static connection: IDBPDatabase<unknown> | null = null;
  private static isVersionChange: boolean;
  private static async open() {
    console.log("Opening database");

    openDB(database_name, database_version, {
      async upgrade(database) {
        ApplicationDb.isVersionChange = true;
        ApplicationDb.db_init(database);
      },
    }).then((connection) => {
      console.log("Database opened");
      ApplicationDb.connection = connection;
      if (ApplicationDb.isVersionChange) return;

      ApplicationDb.isVersionChange = false;

      ApplicationDb.db_init(connection);
    });
  }

  public static db() {
    return ApplicationDb.connection;
  }
  public static async init() {
    await ApplicationDb.open();
  }
  private static async db_init(database: IDBPDatabase<unknown>) {
    await KeyDB.init(database, ApplicationDb.isVersionChange);
    await messageDB.init(database, ApplicationDb.isVersionChange);
    await chatSessionDB.init(database, ApplicationDb.isVersionChange);
    await userDB.init(database, ApplicationDb.isVersionChange);
    await eventsDB.init(database, ApplicationDb.isVersionChange);
    await ApplicationCrypto.getNewKey();
    await ApplicationCrypto.push_keys();
  }
}
