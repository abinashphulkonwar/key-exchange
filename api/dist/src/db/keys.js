"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const DocSchema = new Schema({
    public_key: {
        type: Object,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    device_key_id: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
        enum: ["assigned", "unassigned", "deleted", "pushed"],
    },
}, {
    timestamps: true,
});
// module.exports = mongoose.model("Chat", ChatSchema);
// module.exports.chatSchema = ChatSchema;
const Key = mongoose_1.default.model("Key", DocSchema);
exports.Key = Key;
DocSchema.statics.build = (attrs) => {
    if (!attrs.public_key)
        throw new Error("public_key is required");
    if (!attrs.userId)
        throw new Error("userId is required");
    return new Key(attrs);
};
