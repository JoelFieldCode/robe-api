import Joi from "@hapi/joi";
import { NextFunction, Request, Response, Router } from "express";
import { getUserCategories } from "../../services/category";

import pool from "../../database/pool";
import HttpException from "../../exceptions/HttpException";
import authMiddleware from "../../middleware/auth";
import Item from "../../models/Item";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next)
);

router.get("/", async (req: Request, res: Response) => {
  const categories = await getUserCategories(req.context.user_id);
  return res.json(categories);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    image_url: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(new HttpException(422, error as any));
  }

  const { name, image_url } = value;
  try {
    const categories = await pool.query(
      "INSERT INTO categories (name, user_id, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, req.context.user_id, image_url]
    );
    return res.status(201).json(categories.rows[0]);
  } catch (err) {
    return next(new HttpException(422, "Error creating category"));
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const userCategories = await getUserCategories(req.context.user_id);
  const foundCategory = userCategories.find(
    (category) => category.id === parseInt(req.params.id)
  );
  if (!foundCategory) {
    return next(new HttpException(403, "Unauthorized"));
  } else {
    return res.json(foundCategory);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rows = await pool.query(
        "DELETE from categories WHERE id = $1 AND user_id = $2",
        [req.params.id, req.context.user_id]
      );
      if (rows.rowCount) {
        return res.status(200).json("Success");
      } else {
        return next(new HttpException(403, "Unauthorized"));
      }
    } catch (err) {
      return next(new HttpException(404, "Error deleting category"));
    }
  }
);

router.get(
  "/:id/items",
  async (req: Request, res: Response, next: NextFunction) => {
    const items = await pool.query<Item>(
      "SELECT * FROM items WHERE category_id = $1 AND user_id = $2",
      [req.params.id, req.context.user_id]
    );
    if (items.rowCount) {
      return res.json(items.rows);
    } else {
      return next(new HttpException(403, "Unauthorized"));
    }
  }
);

export default router;
