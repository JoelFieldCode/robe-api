import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import fs from "fs";
import expressPlayground from "graphql-playground-middleware-express";
import { createSchema, createYoga } from "graphql-yoga";
import path from "path";
import { resolver } from "./schema/resolver";
import isDev from "./utils/isDev";

import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { middleware } from "supertokens-node/framework/express";
import { errorHandler } from "supertokens-node/framework/express";
import Dashboard from "supertokens-node/recipe/dashboard";

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "http://localhost:3567",
    apiKey: "someKey" // OR can be undefined
  },
  // TODO from ENV
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "Robe",
    apiDomain: "http://localhost:8080",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init(), // initializes signin / sign up features
    Session.init(), // initializes session features
    Dashboard.init(),
  ]
});

dotenv.config();

const app = express();
app.use(json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3000/playground"],
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
}));
app.use(middleware());
app.use(errorHandler())

const PORT = process.env.PORT || 8080;

const yogaServer = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync(
      path.join(__dirname, "./schema.graphql"),
      "utf8"
    ),
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
