import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  userId: mongoose.Schema.Types.ObjectId;
  type: "key";
  key: {
    device_key_id: number;
    user_fetch_key_user_id: mongoose.Schema.Types.ObjectId;
  };
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;

  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  type: "key";
  key: {
    device_key_id: number;
    user_fetch_key_user_id: mongoose.Schema.Types.ObjectId;
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
      enum: ["key", "assigned", "unassigned", "deleted", "pushed", "send"],
    },
    key: {
      device_key_id: Number,
      user_fetch_key_user_id: mongoose.Schema.Types.ObjectId,
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
