import dotenv from "dotenv";
import express, { Request, Response, NextFunction, json } from "express";
import bearerToken from "express-bearer-token";
import cors from "cors";
import ItemsRouter from "./routes/item";
import CategoryRouter from "./routes/category";
import authMiddleware from "./middleware/auth";
import errorMiddleware from "./middleware/errorMiddleware";
import HttpException from "./exceptions/HttpException";
import session from "express-session";

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
// todo use a proper secret
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "development" ? false : true },
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  req.context = {};
  next();
});
app.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next)
);
const port = process.env.SERVER_PORT; // default port to listen

app.use("/item", ItemsRouter, authMiddleware);
app.use("/category", CategoryRouter, authMiddleware);
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) =>
  errorMiddleware(err, req, res, next)
);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello ");
});

// start the Express server
app.listen(port, () => {});
