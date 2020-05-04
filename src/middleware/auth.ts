import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { AccessTokenPayload, ALLOWED_DEV_TOKEN } from "../services/auth/login";
import isDev from "../utils/isDev";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.token) {
    return next(new HttpException(401));
  }

  if (req.token === ALLOWED_DEV_TOKEN && isDev()) {
    req.context.user_id = ALLOWED_DEV_TOKEN;
    return next();
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
