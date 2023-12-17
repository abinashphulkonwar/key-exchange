"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ChatSchema = new Schema({
    public_key: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
exports.ChatSchema = ChatSchema;
ChatSchema.index({ createdAt: 1 });
// module.exports = mongoose.model("Chat", ChatSchema);
// module.exports.chatSchema = ChatSchema;
const Chat = mongoose_1.default.model("Chat", ChatSchema);
exports.Chat = Chat;
ChatSchema.statics.build = (attrs) => {
    if (!attrs.public_key)
        throw new Error("public_key is required");
    if (!attrs.userId)
        throw new Error("userId is required");
    return new Chat(attrs);
};
