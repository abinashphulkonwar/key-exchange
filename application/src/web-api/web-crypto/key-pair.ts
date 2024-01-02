export class KeyPair {
  static async generateKeys() {
    const key_air = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );
    const private_key = await window.crypto.subtle.exportKey(
      "jwk",
      key_air.privateKey
    );

    const public_key = await window.crypto.subtle.exportKey(
      "jwk",
      key_air.publicKey
    );
    return {
      private_key,
      public_key,
    };
  }
  static async deriveKey(
    private_key_jwk: JsonWebKey,
    public_key_jwk: JsonWebKey
  ) {
    const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      public_key_jwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      private_key_jwk,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );
    return await window.crypto.subtle.deriveKey(
      { name: "ECDH", public: publicKey },
      privateKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }
}
