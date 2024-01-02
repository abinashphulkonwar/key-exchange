import { KeyDB, keydb_status_unassigned } from "../Index-db/key";
import { KeyPair } from "./key-pair";

export class ApplicationCrypto {
  static async getNewKey() {
    const count = await KeyDB.count({
      field: "status",
      value: keydb_status_unassigned,
    });
    if (count <= 20) {
      for (let i = 0; i < 50; i++) {
        const key_pair = await KeyPair.generateKeys();
        await KeyDB.save({
          private_key: key_pair.private_key,
          public_key: key_pair.public_key,
        });
      }
    }
  }
}
