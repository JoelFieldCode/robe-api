import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const generateDatabase = async () => {
  const pool = new Pool();
  await pool.query("DROP TABLE IF EXISTS items");
  await pool.query("DROP TABLE IF EXISTS categories");

  await pool.query(
    "CREATE TABLE categories (ID SERIAL PRIMARY KEY, name VARCHAR(50), image_url VARCHAR(250))"
  );
  await pool.query(
    "CREATE TABLE items (ID SERIAL PRIMARY KEY, name VARCHAR(100), url TEXT, price NUMERIC(17, 0), image_url TEXT, user_id VARCHAR(150), category_id INTEGER, FOREIGN KEY (category_id) REFERENCES categories (id))"
  );

  const categories = [
    {
      name: "Hats",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRdL_C5O5y08a7H7P6zsE0sUW5qqY-dvZVE7wQoGDbM4S_dCBx5_-4VOVjWXAquXbBMXz1NEY3G&usqp=CAc",
    },
    {
      name: "Tops",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQTFuXV0HNGQyKIAYNBay6da4PheiNvMJJoENCWLnaI80ciPG9ShmiBWrWWHr4&usqp=CAc",
    },
    {
      name: "Bottoms",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQDhIJdYDG6ZKbxuL3lqOwhiPvSPj3PM-NLxJE7_Aj_RBsNI4cmU-fEyhl_l8ky6qhC5HA6qyFx&usqp=CAc",
    },
    {
      name: "Dresses",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQqkFhEbkN7RKHPyKU0L7NpXUEvRQxjQXWVRfKbrFz6BnBfEsWpsc9zC92VmFU3GEN4RN4TBvU&usqp=CAc",
    },
    {
      name: "Shoes",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR3dlzvkmXh-72eGBGezWxU2OWWLGrMUSVnKYeKAgkFKQANKvneiBeb8BgPTPDe5iboFDKFpoiBRQ&usqp=CAc",
    },
  ];
  const categoryValues = categories
    .map((category) => `('${category.name}', '${category.image_url}')`)
    .join(", ");

  await pool.query(
    `INSERT INTO categories (name, image_url) VALUES ${categoryValues}`
  );

  const items = [
    {
      name: "Blue dress",
      price: 40,
      url: "https://www.google.com",
      category_id: 4,
      user_id: "test",
      image_url:
        "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Oct_2020/MegaNav02-500x720_1_2x.png",
    },
  ];
  const itemKeyOrder = [
    "name",
    "price",
    "image_url",
    "url",
    "category_id",
    "user_id",
  ];
  const itemValues = items.map((item) => {
    // @ts-ignore
    return `(${itemKeyOrder.map((key) => `'${item[key]}'`)})`;
  });

  await pool.query(
    `INSERT INTO items (${itemKeyOrder.join(", ")}) VALUES ${itemValues}`
  );

  return process.exit(0);
};

generateDatabase();
