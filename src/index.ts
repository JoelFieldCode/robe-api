import dotenv from "dotenv";
import express, { Request, Response, NextFunction, json } from "express";
import bearerToken from "express-bearer-token";
import cors from "cors";
import ItemsRouter from "./routes/item";
import CategoryRouter from "./routes/category";
import AuthRouter from "./routes/auth";
import errorMiddleware from "./middleware/errorMiddleware";
import HttpException from "./exceptions/HttpException";

dotenv.config();

interface Context {
  user_id?: String;
}

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}

const app = express();
app.use(json());
app.use(cors());
app.use(bearerToken());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.context = {};
  next();
});

const port = process.env.SERVER_PORT; // default port to listen

app.use("/item", ItemsRouter);
app.use("/category", CategoryRouter);
app.use("/auth", AuthRouter);
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) =>
  errorMiddleware(err, req, res, next)
);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello ");
});

// start the Express server
app.listen(port, () => {});
