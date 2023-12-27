import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  public_key: string;
  userId: mongoose.Schema.Types.ObjectId | string;
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  public_key: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
interface Module extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

const DocSchema = new Schema(
  {
    public_key: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("Chat", ChatSchema);
// module.exports.chatSchema = ChatSchema;
const Key = mongoose.model<Doc, Module>("Key", DocSchema);

DocSchema.statics.build = (attrs: Attrs) => {
  if (!attrs.public_key) throw new Error("public_key is required");
  if (!attrs.userId) throw new Error("userId is required");

  return new Key(attrs);
};

export { Key };
