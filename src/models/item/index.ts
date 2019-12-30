import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  url: String
});

export default mongoose.model("Item", ItemSchema);
