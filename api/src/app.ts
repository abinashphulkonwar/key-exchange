import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { authRouter } from "./api/routes/auth";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.use("/api/auth", authRouter);
app.all("*", (req, res) => {
  res.status(404).send("not found");
});

export { server };
