"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const auth_1 = require("./api/routes/auth");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("a user connected");
});
app.use("/api/auth", auth_1.authRouter);
app.all("*", (req, res) => {
    res.status(404).send("not found");
});
