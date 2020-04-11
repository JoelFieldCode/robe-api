const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

const generateDatabase = async () => {
  let pool = new Pool();
  await pool.query("DROP TABLE IF EXISTS items");
  await pool.query("DROP TABLE IF EXISTS categories");

  await pool.query(
    "CREATE TABLE categories (ID SERIAL PRIMARY KEY, name VARCHAR(50))"
  );
  await pool.query(
    "CREATE TABLE items (ID SERIAL PRIMARY KEY, name VARCHAR(100), url VARCHAR(250), price NUMERIC(2), user_id VARCHAR(150), category_id INTEGER, FOREIGN KEY (category_id) REFERENCES categories (id))"
  );

  await pool.query(
    "INSERT INTO categories (name) VALUES ('Hats'), ('Tops'), ('Bottoms'), ('Dresses'), ('Shoes')"
  );

  await pool.query(
    "INSERT INTO items (name, price, url, category_id, user_id) VALUES ('blue dress', 40, 'https://www.google.com', 4, 'test')"
  );

  return process.exit(0);
};

generateDatabase();
