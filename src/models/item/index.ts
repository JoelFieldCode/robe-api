import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  url: String,
  user_id: String
});

export default mongoose.model("Item", ItemSchema);
