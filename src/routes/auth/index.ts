import { Request, Response, NextFunction, Router } from "express";
import { login } from "../../services/auth/login";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    await login(req);
    return res.json("Success").status(200);
  } catch (e) {
    throw e;
  }
});

export default router;
