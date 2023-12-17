import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  username: string;
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
interface Module extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

const DocSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<Doc, Module>("User", DocSchema);

DocSchema.statics.build = (attrs: Attrs) => {
  if (!attrs.username) throw new Error("username is required");

  return new User(attrs);
};

export { User };
