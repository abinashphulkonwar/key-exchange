if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import mongoose from "mongoose";
import { server } from "./src/app";

mongoose
  .connect("mongodb://127.0.0.1:27017/key-exchage")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

server.listen(3001, () => {
  console.log("server running at http://localhost:3000");
});
