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
import { middleware } from "supertokens-node/framework/express";
import { errorHandler } from "supertokens-node/framework/express";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";

supertokens.init({
  framework: "express",
  supertokens: {
    // these ended up in source control... can we change the api key?
    connectionURI: process.env.SUPERTOKENS_URL,
    apiKey: process.env.SUPERTOKENS_API_KEY
  },
  // TODO from ENV
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "Robe",
    apiDomain: process.env.ROBE_API_URL,
    websiteDomain: process.env.ROBE_UI,
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
  origin: [process.env.ROBE_UI],
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
}));
app.use(middleware());
app.use(errorHandler());

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
