"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
exports.server = server;
app.get("/", (req, res) => {
    res.send("hiiii");
});
