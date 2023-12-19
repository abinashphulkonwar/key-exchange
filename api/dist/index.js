"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./src/app");
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/key-exchage")
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => console.log(err));
app_1.server.listen(3001, () => {
    console.log("server running at http://localhost:3000");
});
