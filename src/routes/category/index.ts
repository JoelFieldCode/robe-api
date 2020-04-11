import { Request, Response, Router, NextFunction } from "express";
import HttpException from "../../exceptions/HttpException";

import { Pool, Client } from "pg";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const pool = new Pool();
  const categories = await pool.query("SELECT * from categories");
  return res.json(categories.rows);
});

router.get("/:id", async (req: Request, res: Response) => {
  const pool = new Pool();
  const categories = await pool.query(
    "SELECT * from categories WHERE id = $1",
    [req.params.id]
  );
  return res.json(categories.rows);
});

/*
  SELECT items.price, items.name, items.url, categories.name as category_name FROM items JOIN categories ON items.category_id = categories.id AND categories.id = 1;
*/

router.get(
  "/:id/items",
  async (req: Request, res: Response, next: NextFunction) => {
    const pool = new Pool();
    const categories = await pool.query(
      "SELECT * FROM items WHERE category_id = $1",
      [req.params.id]
    );
    return res.json(categories.rows);
  }
);

export default router;
