const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

const generateDatabase = async () => {
  const pool = new Pool();
  await pool.query("DROP TABLE IF EXISTS items");
  await pool.query("DROP TABLE IF EXISTS categories");

  await pool.query(
    "CREATE TABLE categories (ID SERIAL PRIMARY KEY, name VARCHAR(50))"
  );
  await pool.query(
    "CREATE TABLE items (ID SERIAL PRIMARY KEY, name VARCHAR(100), url VARCHAR(250), price NUMERIC(2), user_id VARCHAR(150), category_id INTEGER, FOREIGN KEY (category_id) REFERENCES categories (id))"
  );

  const categories = ["Hats", "Tops", "Bottoms", "Dresses", "Shoes"];
  const categoryValues = categories
    .map((category) => `('${category}')`)
    .join(", ");

  await pool.query(`INSERT INTO categories (name) VALUES ${categoryValues}`);

  const items = [
    {
      name: "Blue dress",
      price: 40,
      url: "https://www.google.com",
      category_id: 4,
      user_id: "test",
    },
  ];
  const itemKeyOrder = ["name", "price", "url", "category_id", "user_id"];
  const itemValues = items.map((item) => {
    return `(${itemKeyOrder.map((key) => `'${item[key]}'`)})`;
  });

  await pool.query(
    `INSERT INTO items (${itemKeyOrder.join(", ")}) VALUES ${itemValues}`
  );

  return process.exit(0);
};

generateDatabase();
