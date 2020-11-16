import cors from "cors";
import dotenv from "dotenv";
import express, { json, NextFunction, Request, Response } from "express";
import bearerToken from "express-bearer-token";
import HttpException from "./exceptions/HttpException";
import errorMiddleware from "./middleware/errorMiddleware";
import AuthRouter from "./routes/auth";
import CategoryRouter from "./routes/category";
import ItemsRouter from "./routes/item";

dotenv.config();

interface Context {
  user_id?: string;
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

const PORT = process.env.PORT || 8080;

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
app.listen(PORT);

export default app;
