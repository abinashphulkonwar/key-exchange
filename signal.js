const { createHash, createECDH } = require("crypto");
const curve = "prime256v1";

// Alice's Identity Key
const aliceIdentityKey = createECDH(curve);
aliceIdentityKey.generateKeys();

// Alice's Pre-keys
const alicePreKeys = [];
for (let i = 0; i < 10; i++) {
  const alicePreKey = createECDH(curve);
  alicePreKey.generateKeys();
  alicePreKeys.push(alicePreKey);
}

// Bob's Identity Key
const bobIdentityKey = createECDH(curve);
bobIdentityKey.generateKeys();

// Bob's Pre-keys
const bobPreKeys = [];
for (let i = 0; i < 10; i++) {
  const bobPreKey = createECDH(curve);
  bobPreKey.generateKeys();
  bobPreKeys.push(bobPreKey);
}

// Alice sends her Identity Key and Pre-keys to Bob
const aliceIdentityKeyBytes = aliceIdentityKey.getPublicKey();
const alicePreKeyBundle = { identityKey: aliceIdentityKeyBytes, preKeys: [] };
for (const preKey of alicePreKeys) {
  alicePreKeyBundle.preKeys.push(preKey.getPublicKey());
}

// Bob selects a Pre-key from Alice's Pre-keys and uses it to compute a shared secret
const selectedAlicePreKey = alicePreKeys[0];
const bobSharedSecret = bobIdentityKey.computeSecret(
  selectedAlicePreKey.getPublicKey()
);

// Bob encrypts the shared secret with Alice's Identity Key
const aliceIdentityKeyBuffer = Buffer.from(aliceIdentityKeyBytes, "base64");
const hash = createHash("sha256").update(bobSharedSecret).digest();
const encryptedSharedSecret = aliceIdentityKeyBuffer
  .slice(0, 32)
  .map((byte, i) => byte ^ hash[i]);

// Alice decrypts the shared secret using her Identity Key
const decryptedSharedSecret = encryptedSharedSecret.map(
  (byte, i) => byte ^ hash[i]
);

console.log(decryptedSharedSecret.toString(), encryptedSharedSecret.toString());
