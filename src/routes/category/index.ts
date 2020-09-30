import { NextFunction, Request, Response, Router } from "express";

import { Pool } from "pg";
import sharedPool from "../../database/pool";
import HttpException from "../../exceptions/HttpException";
import authMiddleware from "../../middleware/auth";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next)
);

router.get("/", async (req: Request, res: Response) => {
  const categories = await sharedPool.query("SELECT * from categories");
  return res.json(categories.rows);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const pool = new Pool();
  const categories = await pool.query(
    "SELECT * from categories WHERE id = $1",
    [req.params.id]
  );
  if (!categories.rowCount) {
    return next(new HttpException(404, "Category not found"));
  } else {
    return res.json(categories.rows[0]);
  }
});

/*
  SELECT items.price, items.name, items.url, categories.name as category_name FROM items JOIN categories ON items.category_id = categories.id AND categories.id = 1;
*/

router.get(
  "/:id/items",
  async (req: Request, res: Response, next: NextFunction) => {
    const pool = new Pool();
    const categories = await pool.query(
      "SELECT * FROM items WHERE category_id = $1 AND user_id = $2",
      [req.params.id, req.context.user_id]
    );
    return res.json(categories.rows);
  }
);

export default router;
