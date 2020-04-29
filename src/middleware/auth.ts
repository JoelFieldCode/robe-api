import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /*
    TODO use database sessions:
    https://www.npmjs.com/package/connect-pg-simple
  */
  if (req.session.user_id) {
    req.context.user_id = req.session.user_id;
    return next();
  }
  return next(new HttpException(401));
}
