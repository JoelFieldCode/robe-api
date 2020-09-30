import { NextFunction, Request, Response, Router } from "express";
import { login } from "../../services/auth/login";

const router = Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await login(req);
      return res.json({ auth: true, token }).status(200);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
