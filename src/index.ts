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
import Session from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";

supertokens.init({
  framework: "express",
  supertokens: {
    // these ended up in source control... can we change the api key?
    connectionURI: process.env.SUPERTOKENS_URL,
    apiKey: process.env.SUPERTOKENS_API_KEY
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "Robe",
    apiDomain: process.env.ROBE_API_URL,
    origin: (input) => {
      if (input.request !== undefined) {
        const origin = input.request.getHeaderValue("origin");
        if (origin === undefined) {
          // this means the client is in an iframe, it's a mobile app, or
          // there is a privacy setting on the frontend which doesn't send
          // the origin
        } else {
          if (origin === process.env.ROBE_UI) {
            // query from the configured site
            return process.env.ROBE_UI;
          } else if (origin === "http://localhost:3000") {
            // query from local development
            return "http://localhost:3000";
          }
        }
      }
      // in case the origin is unknown or not set, we return a default
      // value which will be used for this request.
      return process.env.ROBE_UI;
    },
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Session.init(), // initializes session features
    Dashboard.init(),
    ThirdParty.init({
      signInAndUpFeature: {
          providers: [
              {
                  config: {
                      thirdPartyId: "google",
                      clients: [{
                          clientId: process.env.GOOGLE_CLIENT_ID,
                          clientSecret: process.env.GOOGLE_CLIENT_SECRET
                      }]
                  }
              }
          ]
      }
  }), // initializes signin / sign up features
  ]
});

dotenv.config();

const app = express();
app.use(json());
app.use(cors({
  origin: [process.env.ROBE_UI, "http://localhost:3000"],
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
