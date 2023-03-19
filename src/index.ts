import cors from "cors";
import 'graphql-import-node'
import dotenv from "dotenv";
import express, { json } from "express";
import bearerToken from "express-bearer-token";
import { errorHandler } from "./middleware/errorHandler";
import AuthRouter from "./routes/auth";
import CategoryRouter from "./routes/category";
import ItemsRouter from "./routes/item";
import { resolver } from './schema/resolver'
import expressPlayground from 'graphql-playground-middleware-express'
import authMiddleware from "./middleware/auth";
import isDev from "./utils/isDev";
import * as typeDefs from './schema/schema.graphql'
import { createSchema, createYoga } from "graphql-yoga";
import { Context } from './types/context'

dotenv.config();

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
  req.context = { user_id: 'null' };
  next();
});
app.use(authMiddleware)

const PORT = process.env.PORT || 8080;

app.use("/item", ItemsRouter);
app.use("/category", CategoryRouter);
app.use("/auth", AuthRouter);

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: resolver,
  })
})

app.use('/graphql', yoga)

// define a route handler for the default home page
app.get("/", (_req, res) => {
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
