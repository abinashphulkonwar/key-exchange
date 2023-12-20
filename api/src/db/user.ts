import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface Attrs {
  email: string;
  password: string;
}

interface Doc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}
interface Module extends mongoose.Model<Doc> {
  build(attrs: Attrs): Doc;
}

const DocSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
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
  if (!attrs.email) throw new Error("email is required");
  if (!attrs.password) throw new Error("password  is required");

  return new User(attrs);
};

export { User };
