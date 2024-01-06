import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  userId: mongoose.Schema.Types.ObjectId[] | string[];
  keys: {
    [key: string]: {
      device_key_id: number;
      state: "fetch" | "intial";
    };
  };
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId[];
  keys: {
    [key: string]: {
      device_key_id: number;
      state: "fetch" | "intial";
    };
  };
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
    keys: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

DocSchema.statics.build = (attrs: Attrs) => {
  if (attrs.userId.length < 2) throw new Error("userId is required");

  return new Chat(attrs);
};
// module.exports = mongoose.model("Chat", ChatSchema);
// module.exports.chatSchema = ChatSchema;
const Chat = mongoose.model<Doc, Module>("Chat", DocSchema);

export { Chat };
