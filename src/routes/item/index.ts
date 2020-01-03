import { Request, Response, Router, NextFunction } from "express";
import Item from "../../models/item";
import HttpException from "../../exceptions/HttpException";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const items = await Item.find({ user_id: req.context.user_id });
  return res.json(items);
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Item.findById(req.params.id);
    const itemUserId = item.toJSON().user_id;
    if (!item || itemUserId !== req.context.user_id) {
      return next(new HttpException(404));
    }
    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new HttpException(400));
    }
    return next(new HttpException(404));
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { name, price, url, category } = req.body;
  const { user_id } = req.context;
  const item = new Item({
    name,
    price,
    url,
    category,
    user_id
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
