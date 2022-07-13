import cors from "cors";
import dotenv from "dotenv";
import express, { json, NextFunction, Request, Response, Express } from "express";
import bearerToken from "express-bearer-token";
import HttpException from "./exceptions/HttpException";
import { errorHandler } from "./middleware/errorHandler";
import AuthRouter from "./routes/auth";
import CategoryRouter from "./routes/category";
import ItemsRouter from "./routes/item";
import { graphqlHTTP } from 'express-graphql'
import { schema, resolver } from './schema'
import expressPlayground from 'graphql-playground-middleware-express'
import authMiddleware from "./middleware/auth";
import isDev from "./utils/isDev";

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
app.use((req, _res, next) => {
  req.context = {};
  next();
});
app.use(authMiddleware)

const PORT = process.env.PORT || 8080;

app.use("/item", ItemsRouter);
app.use("/category", CategoryRouter);
app.use("/auth", AuthRouter);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
}));

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello ");
});
if (isDev()) {
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
}

app.use(errorHandler)

// start the Express server
const server = app.listen(PORT);

export { server };
export default app;
