import Joi from "@hapi/joi";
import { NextFunction, Request, Response, Router } from "express";
import { Client, Pool } from "pg";
import HttpException from "../../exceptions/HttpException";
import authMiddleware from "../../middleware/auth";
const router = Router();

router.use((req: Request, res: Response, next: NextFunction) =>
  authMiddleware(req, res, next)
);

router.get("/", async (req: Request, res: Response) => {
  const pool = new Pool();
  const categories = await pool.query(
    "SELECT * from items WHERE user_id = $1",
    [req.context.user_id]
  );
  return res.json(categories.rows);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const pool = new Pool();
  const categories = await pool.query(
    "SELECT * from items WHERE id = $1 AND user_id = $2",
    [req.params.id, req.context.user_id]
  );
  return res.json(categories.rows);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    category_id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    url: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(new HttpException(400, error as any));
  }
  const { name, price, url, category_id } = value;
  const pool = new Pool();
  const categories = await pool.query(
    "INSERT INTO items (name, price, url, category_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, price, url, category_id, req.context.user_id]
  );

  return res.status(201).json(categories.rows[0]);
});

export default router;
