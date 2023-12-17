"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const curve = "prime256v1";
// Alice's Identity Key
const aliceIdentityKey = (0, crypto_1.createECDH)(curve);
aliceIdentityKey.generateKeys();
console.log("Alice's Identity Key:", aliceIdentityKey.getPublicKey("hex"));
const bobIdentityKey = (0, crypto_1.createECDH)(curve);
bobIdentityKey.generateKeys();
console.log("Bob's Identity Key:", bobIdentityKey.getPublicKey("hex"));
const sharedSecretAlice = aliceIdentityKey.computeSecret(bobIdentityKey.getPublicKey());
console.log("Shared Secret:", sharedSecretAlice.toString("hex"));
const sharedSecretBob = bobIdentityKey.computeSecret(aliceIdentityKey.getPublicKey());
console.log("Shared Secret:", sharedSecretBob.toString("hex"));
console.log("is shared secret same: ", sharedSecretAlice.toString("hex") === sharedSecretBob.toString("hex"));
