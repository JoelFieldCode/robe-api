import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import { JsonWebTokenError } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { AccessTokenPayload } from "../services/auth/login";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.token) {
    return next(new HttpException(401));
  }

  let auth = false;
  verify(
    req.token,
    process.env.SECRET,
    null,
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
