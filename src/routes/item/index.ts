import { Request, Response, Router } from "express";
import Item from "../../models/item";

const routes = Router().get("/", async (req: Request, res: Response) => {
  const items = await Item.find({});
  return res.json(items);
});

export default routes;
