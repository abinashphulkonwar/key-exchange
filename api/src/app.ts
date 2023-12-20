import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { authRouter } from "./api/routes/auth";
import cookieSession from "cookie-session";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.set("trust proxy", 1); // trust first proxy

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
  })
);
app.use("/api/auth", authRouter);
app.all("*", (req, res) => {
  res.status(404).send("not found");
});

export { server };
