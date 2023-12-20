import {
  createSecretKey,
  createCipheriv,
  createDecipheriv,
  scryptSync,
  randomBytes,
} from "crypto";

const secret = Buffer.from(process.env.JWT_KEY!).toString("hex");
const api = Buffer.from(process.env.JWT_API!).toString("hex");
const url = Buffer.from(process.env.JWT_KEY!).toString("hex");

export const ApiKey = createSecretKey(Buffer.from(api, "hex"));
export const KeyPasto = createSecretKey(Buffer.from(secret, "hex"));
export const UrlKey = createSecretKey(Buffer.from(url, "hex"));

const key = scryptSync(
  process.env.JWT_KEY || "Key",
  "sdjhbjhdsbjhdsbfjhbd",
  32
);
const iv = scryptSync(process.env.JWT_KEY || "Key", "sdjhbjhdsbjhdsbfjhbd", 32);

export const encrypted = (arg: string | object) => {
  if (arg === null) return null;
  if (typeof arg === "object") arg = JSON.stringify(arg);
  if (typeof arg === "boolean") arg = `${arg}`;
  if (typeof arg === "number") arg = `${arg}`;

  const chipher = createCipheriv("aes-256-gcm", key, iv);
  const data = chipher.update(arg, "utf8", "hex");
  return data;
};

export const dencrypted = (arg: string | object) => {
  if (arg === null) return null;

  if (typeof arg === "object") arg = JSON.stringify(arg);
  if (typeof arg === "boolean") arg = `${arg}`;
  if (typeof arg === "number") arg = `${arg}`;

  const dchipher = createDecipheriv("aes-256-gcm", key, iv);

  const data = dchipher.update(arg, "hex", "utf8");

  return data;
};

const data = encrypted("hiiiiiii");
const res = dencrypted(data || "");

console.log(data, res);
