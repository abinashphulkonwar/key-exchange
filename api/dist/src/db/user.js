"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const DocSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", DocSchema);
exports.User = User;
DocSchema.statics.build = (attrs) => {
    if (!attrs.username)
        throw new Error("username is required");
    return new User(attrs);
};
