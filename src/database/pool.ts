import { ClientConfig, Pool } from "pg";
import isDev from "../utils/isDev";
import dotenv from "dotenv";

dotenv.config();

let connectionString: ClientConfig;
if (isDev()) {
  connectionString = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    // @ts-ignore
    port: process.env.PGPORT,
  };
} else {
  connectionString = {
    connectionString: process.env.DATABASE_URL,
  };
}

export default new Pool(connectionString);
