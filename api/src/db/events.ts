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

export type event_types_interface =
  | "key"
  | "init_chat"
  | "init_chat_inform_about_private_key"
  | "pull_message"
  | "send_recipts"
  | "get_recipts";

export interface message {
  to: mongoose.Schema.Types.ObjectId | string;
  from: mongoose.Schema.Types.ObjectId | string;
  content: string;
  content_type: message_type;
  command: "add" | "delete";
  message_id: string;
  created_at: Date;
  iv: string;
}

interface Recipts {
  from: mongoose.Schema.Types.ObjectId | string;
  to: mongoose.Schema.Types.ObjectId | string;
  message_id: number;
  command: "read" | "deliverd" | "ack";
  time: Date;
  event_id: number;
}

export interface Attrs {
  userId: mongoose.Schema.Types.ObjectId | string;
  type: event_types_interface;
  key?: {
    device_key_id: number;
    other_user: mongoose.Schema.Types.ObjectId | string;
  };
  init_chat?: {
    other_user_id: mongoose.Schema.Types.ObjectId | string;
    name: string;
  };
  message?: message;
  recipts?: Recipts;
  data: message | Recipts | any;

  state: "worker" | "emiter";
  worker_process_count: number;
  device_event_id?: number;
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;

  userId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
  type: event_types_interface;
  key: {
    device_key_id: number;
    other_user: mongoose.Schema.Types.ObjectId | string;
  };
  init_chat: {
    other_user_id: mongoose.Schema.Types.ObjectId | string;
    name: string;
  };
  message: message;
  recipts: Recipts;
  data: message | Recipts;
  last_process_time: Date;
  state: "worker" | "emiter";
  worker_process_count: number;
  device_event_id?: number;
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
        "pull_message",
        "send_recipts",
        "get_recipts",
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
      iv: String,
    },
    recipts: {
      from: mongoose.Schema.Types.ObjectId,
      to: mongoose.Schema.Types.ObjectId,
      message_id: Number,
      command: {
        type: String,
        enum: ["read", "deliverd", "ack"],
      },
      time: {
        type: Date,
      },
      event_id: Number,
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
    data: {
      type: Object,
    },
    device_event_id: Number,
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
