import mongoose from "mongoose";
const Schema = mongoose.Schema;

type message_type =
  | "text"
  | "image"
  | "file"
  | "audio"
  | "video"
  | "location"
  | "contact"
  | "sticker"
  | "document"
  | "poll"
  | "url";

type event_types =
  | "key"
  | "init_chat"
  | "init_chat_inform_about_private_key"
  | "pull_message";

interface message {
  to: mongoose.Schema.Types.ObjectId | string;
  from: mongoose.Schema.Types.ObjectId | string;
  content: string;
  content_type: message_type;
  command: "add" | "delete";
  message_id: string;
  created_at: Date;
}

interface Attrs {
  userId: mongoose.Schema.Types.ObjectId | string;
  type: event_types;
  key?: {
    device_key_id: number;
    other_user: mongoose.Schema.Types.ObjectId | string;
  };
  init_chat?: {
    other_user_id: mongoose.Schema.Types.ObjectId | string;
    name: string;
  };
  message?: message;
  state: "worker" | "emiter";
  worker_process_count: number;
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;

  userId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
  type: event_types;
  key: {
    device_key_id: number;
    other_user: mongoose.Schema.Types.ObjectId | string;
  };
  init_chat: {
    other_user_id: mongoose.Schema.Types.ObjectId | string;
    name: string;
  };
  message: message;
  last_process_time: Date;
  state: "worker" | "emiter";
  worker_process_count: number;
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
    message: {
      to: mongoose.Schema.Types.ObjectId,
      from: mongoose.Schema.Types.ObjectId,
      content: String,
      content_type: {
        type: String,
        enum: [
          "text",
          "image",
          "file",
          "audio",
          "video",
          "location",
          "contact",
          "sticker",
          "document",
          "poll",
          "url",
        ],
      },
      command: {
        type: String,
        enum: ["add", "delete"],
      },
      message_id: String,
      created_at: Date,
    },
    last_process_time: {
      type: Date,
      default: new Date(),
    },
    worker_process_count: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      enum: ["worker", "emiter"],
      default: "worker",
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
