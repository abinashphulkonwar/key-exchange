import {
  KeyDB,
  keydb_status_pushed,
  keydb_status_unassigned,
} from "../Index-db/key";
import { KeyPair } from "./key-pair";

export class ApplicationCrypto {
  static async getNewKey() {
    const count_unassigned = await KeyDB.count({
      field: "status",
      value: keydb_status_unassigned,
    });
    const count_pushed = await KeyDB.count({
      field: "status",
      value: keydb_status_pushed,
    });
    if (Math.max(count_unassigned, count_pushed) <= 20) {
      for (let i = 0; i < 50; i++) {
        const key_pair = await KeyPair.generateKeys();
        await KeyDB.save({
          private_key: key_pair.private_key,
          public_key: key_pair.public_key,
        });
      }
    }
  }
  static async push_keys() {
    const keys = await KeyDB.find({
      status: keydb_status_unassigned,
    });

    const request = await fetch("/api/key/add", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(
        keys.map((val) => {
          return {
            device_key_id: val.id,
            public_key: val.public_key,
          };
        })
      ),
    });

    if (!request.ok) {
      const res = await request.json();
      console.log(res);
      return;
    }
    const keys_updated_query = keys.map((val) => {
      return {
        id: val.id,
      };
    });
    await KeyDB.findAndUpdate(
      keys_updated_query,
      keys.map((val) => {
        return {
          ...val,
          status: keydb_status_pushed,
        };
      })
    );
    console.log("keys are pushed: ", keys.length);
  }
  static async decripted({
    content,
    iv,
    shared_key,
  }: {
    content: string;
    iv: string;
    shared_key: CryptoKey;
  }) {
    const initializationVector = new TextEncoder().encode(iv);

    const string = atob(content);
    const uintArray = new Uint8Array(
      [...string].map((char) => char.charCodeAt(0))
    );
    const algorithm = {
      name: "AES-GCM",
      iv: initializationVector,
    };
    const decryptedData = await window.crypto.subtle.decrypt(
      algorithm,
      shared_key,
      uintArray
    );

    const text = new TextDecoder().decode(decryptedData);
    return text;
  }
}
