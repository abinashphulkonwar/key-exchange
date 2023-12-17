import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.send("hiiii");
});

export { server };
