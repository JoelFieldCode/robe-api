import Joi from "@hapi/joi";
import { NextFunction, Request, Response, Router } from "express";
import pool from "../../database/pool";
import HttpException from "../../exceptions/HttpException";
import authMiddleware from "../../middleware/auth";
import { getUserCategories } from "../../services/category";
const router = Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next)
);

router.get("/", async (req: Request, res: Response) => {
  const categories = await pool.query(
    "SELECT * from items WHERE user_id = $1",
    [req.context.user_id]
  );
  return res.json(categories.rows);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const categories = await pool.query(
    "SELECT * from items WHERE id = $1 AND user_id = $2",
    [req.params.id, req.context.user_id]
  );
  return res.json(categories.rows);
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    await pool.query("DELETE from items WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.context.user_id,
    ]);
    return res.status(200).json("Success");
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    category_id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    url: Joi.string().required(),
    image_url: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(new HttpException(422, error as any));
  }
  const { name, price, url, category_id, image_url } = value;
  const userCategories = await getUserCategories(req.context.user_id);
  if (!userCategories.find((category) => category.id === category_id)) {
    return next(new HttpException(403, "Unauthorized"));
  }
  try {
    const categories = await pool.query(
      "INSERT INTO items (name, price, url, category_id, user_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, price, url, category_id, req.context.user_id, image_url]
    );

    return res.status(201).json(categories.rows[0]);
  } catch (err) {
    return next(new HttpException(422, "Error creating item"));
  }
});

export default router;
