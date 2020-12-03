import dotenv from "dotenv";
import pool from "../database/pool";

dotenv.config();

const generateDatabase = async () => {
  await pool.query("DROP TABLE IF EXISTS items");
  await pool.query("DROP TABLE IF EXISTS categories");

  await pool.query(
    "CREATE TABLE categories (ID SERIAL PRIMARY KEY, name VARCHAR(50), image_url VARCHAR(250), user_id VARCHAR(150))"
  );
  await pool.query(
    `CREATE TABLE items (
      ID SERIAL PRIMARY KEY,
      name VARCHAR(100),
      url TEXT,
      price NUMERIC(17, 0),
      image_url TEXT,
      user_id VARCHAR(150),
      category_id INTEGER REFERENCES categories ON DELETE CASCADE
    )`
  );

  return process.exit(0);
};

generateDatabase();
