import { openDB, IDBPDatabase, IDBPTransaction } from "idb";
import { KeyDB } from "./key";
import { messageDB } from "./messages";
import { chatSessionDB } from "./chat-session";
import { userDB } from "./user";
import { ApplicationCrypto } from "../web-crypto";
import { eventsDB } from "./event";
import { processedEventsDB } from "./processed-events";

const database_name = "key-exchanger";
const database_version = 24;

export class ApplicationDb {
  private static connection: IDBPDatabase<unknown> | null = null;
  private static isVersionChange: boolean;
  private static async open() {
    openDB(database_name, database_version, {
      async upgrade(database, _, __, transaction) {
        ApplicationDb.isVersionChange = true;
        ApplicationDb.db_init(database, transaction);
      },
    }).then((connection) => {
      ApplicationDb.connection = connection;
      if (ApplicationDb.isVersionChange) return;

      ApplicationDb.isVersionChange = false;

      ApplicationDb.db_init(connection, null);
    });
  }

  public static db() {
    return ApplicationDb.connection;
  }
  public static async init() {
    await ApplicationDb.open();
  }
  private static async db_init(
    database: IDBPDatabase<unknown>,
    transaction: IDBPTransaction<unknown, string[], "versionchange"> | null
  ) {
    await KeyDB.init(database, ApplicationDb.isVersionChange, transaction);

    await messageDB.init(database, ApplicationDb.isVersionChange, transaction);
    await userDB.init(database, ApplicationDb.isVersionChange, transaction);

    await chatSessionDB.init(
      database,
      ApplicationDb.isVersionChange,
      transaction
    );
    await eventsDB.init(database, ApplicationDb.isVersionChange, transaction);
    await processedEventsDB.init(
      database,
      ApplicationDb.isVersionChange,
      transaction
    );
    await ApplicationCrypto.getNewKey();
    await ApplicationCrypto.push_keys();
  }
}
