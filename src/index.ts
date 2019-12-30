import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ItemsRouter from "./routes/item";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.SERVER_PORT; // default port to listen

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to database"));

app.use("/item", ItemsRouter);

// define a route handler for the default home page
// app.get("/", (req, res) => {
//   res.send("Hello ");
// });

// start the Express server
app.listen(port, () => {
  // console.log(`server started at http://localhost:${port}`);
});
