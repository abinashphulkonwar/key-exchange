import express, { Request, Response, NextFunction } from "express";
require("express-async-errors");
import { createServer } from "node:http";
import { Server } from "socket.io";
import { authRouter } from "./api/routes/auth";
import cookieSession from "cookie-session";
import { ApplicationError } from "./services/application-error";
import morgan from "morgan";
import { chatRouter } from "./api/routes/chat";
import { currentUser, requiredAuth } from "./services/current-user";
import { keyRouter } from "./api/routes/key";
import { isAuthenticated } from "./handler/auth";
import { diffie_hellman } from "./handler/diffie-hellman";

const app = express();

const server = createServer(app);
const io = new Server(server);
io.use(isAuthenticated);
io.on("connection", (socket) => {
  console.log("a user connected", socket.id, new Date());
  socket.join(socket.id);
  diffie_hellman(socket);
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id, new Date());
    socket.leave(socket.id);
  });
});

app.use(morgan("tiny"));

app.set("trust proxy", true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
  })
);
app.use("/api/auth", authRouter);
app.use("/api/chat", currentUser, requiredAuth, chatRouter);
app.use("/api/key", currentUser, requiredAuth, keyRouter);
app.all("*", (req, res) => {
  res.status(404).send("not found");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ApplicationError) {
      res.status(err.statusCode).send(err.serializeErrors());
    } else {
      res.status(500).send("something went wrong");
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

export { server };
