"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const auth_1 = require("./api/routes/auth");
const cookie_session_1 = __importDefault(require("cookie-session"));
const application_error_1 = require("./services/application-error");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("a user connected");
});
app.use((0, morgan_1.default)("tiny"));
app.set("trust proxy", true);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
}));
app.use("/api/auth", auth_1.authRouter);
app.all("*", (req, res) => {
    res.status(404).send("not found");
});
app.use((err, req, res, next) => {
    try {
        if (err instanceof application_error_1.ApplicationError) {
            res.status(err.statusCode).send(err.serializeErrors());
        }
        else {
            res.status(500).send("something went wrong");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});
