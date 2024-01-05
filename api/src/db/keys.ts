import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  public_key: string;
  userId: mongoose.Schema.Types.ObjectId | string;
  device_key_id: number;
  state: "unassigned" | "pushed";
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  public_key: JsonWebKey;
  userId: mongoose.Schema.Types.ObjectId;
  assigned_user_id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  device_key_id: number;
  state: "assigned" | "unassigned" | "deleted" | "pushed" | "send";
}
interface Module extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

const DocSchema = new Schema(
  {
    public_key: {
      type: Object,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assigned_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    device_key_id: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: ["assigned", "unassigned", "deleted", "pushed", "send"],
    },
  },
  {
    timestamps: true,
  }
);

DocSchema.statics.build = (attrs: Attrs) => {
  if (!attrs.public_key) throw new Error("public_key is required");
  if (!attrs.userId) throw new Error("userId is required");

  return new Key(attrs);
};
// module.exports = mongoose.model("Chat", ChatSchema);
// module.exports.chatSchema = ChatSchema;
const Key = mongoose.model<Doc, Module>("Key", DocSchema);

export { Key };
