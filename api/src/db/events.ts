import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  userId: mongoose.Schema.Types.ObjectId | string;
  type: "key" | "init_chat" | "init_chat_inform_about_private_key";
  key?: {
    device_key_id: number;
    other_user: mongoose.Schema.Types.ObjectId | string;
  };
  init_chat?: {
    other_user_id: mongoose.Schema.Types.ObjectId | string;
    name: string;
  };
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;

  userId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
  type: "key" | "init_chat" | "init_chat_inform_about_private_key";
  key: {
    device_key_id: number;
    other_user: mongoose.Schema.Types.ObjectId | string;
  };
  init_chat: {
    other_user_id: mongoose.Schema.Types.ObjectId | string;
    name: string;
  };
}
interface Module extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

const DocSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "init_chat",
        "init_chat_inform_about_private_key",
        "key",
        "assigned",
        "unassigned",
        "deleted",
        "pushed",
        "send",
      ],
    },
    key: {
      device_key_id: Number,
      other_user: mongoose.Schema.Types.ObjectId,
    },
    init_chat: {
      other_user_id: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

DocSchema.statics.build = (attrs: Attrs) => {
  return new Events(attrs);
};

const Events = mongoose.model<Doc, Module>("event", DocSchema);

export { Events };
