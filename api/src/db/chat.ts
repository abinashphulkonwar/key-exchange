import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  userId: mongoose.Schema.Types.ObjectId[];
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId[];
}
interface Module extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

const DocSchema = new Schema(
  {
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("Chat", ChatSchema);
// module.exports.chatSchema = ChatSchema;
const Key = mongoose.model<Doc, Module>("Chat", DocSchema);

DocSchema.statics.build = (attrs: Attrs) => {
  if (attrs.userId.length < 2) throw new Error("userId is required");

  return new Key(attrs);
};

export { Key };
