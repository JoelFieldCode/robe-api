import { Request, Response, Router } from "express";
import Item from "../../models/item";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const items = await Item.find({});
  return res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const { name, price, url, category } = req.body;
  const item = new Item({
    name,
    price,
    url,
    category
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
