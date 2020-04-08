import { Request, Response, Router, NextFunction } from "express";
import Item from "../../models/item";
import HttpException from "../../exceptions/HttpException";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const categories = await Item.distinct("category");
  return res.json(categories);
});

router.get(
  "/:id/items",
  async (req: Request, res: Response, next: NextFunction) => {
    const items = await Item.find({
      user_id: req.context.user_id,
      category: req.params.id,
    });
    return res.json(items);
  }
);

export default router;
