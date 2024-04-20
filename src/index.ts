import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import bearerToken from "express-bearer-token";
import "graphql-import-node";
import expressPlayground from "graphql-playground-middleware-express";
import { createSchema, createYoga } from "graphql-yoga";
import authMiddleware from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { resolver } from "./schema/resolver";
import * as typeDefs from "./schema/schema.graphql";
import isDev from "./utils/isDev";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(bearerToken());
app.use(authMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const yogaServer = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers: resolver,
  })
});

app.use("/graphql", yogaServer);

// define a route handler for the default home page
app.get("/", (_req, res) => {
  res.send("Hello ");
});
if (isDev()) {
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
}

// start the Express server
const server = app.listen(PORT);

export { server };
export default app;
