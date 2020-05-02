import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../services/auth/login";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.token) {
    return next(new HttpException(401));
  }
  let auth = false;
  jwt.verify(
    req.token,
    process.env.SECRET,
    (err: JsonWebTokenError, decoded: AccessTokenPayload) => {
      if (!err) {
        req.context.user_id = decoded.userId;
        auth = true;
      }
    }
  );

  if (auth) {
    return next();
  } else {
    return next(new HttpException(401));
  }
}
