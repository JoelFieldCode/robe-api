import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import { AccessTokenPayload } from "../services/auth/login";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  verify(
    req.token,
    process.env.SECRET,
    null,
    (err: JsonWebTokenError, decoded: AccessTokenPayload) => {
      if (!err) {
        req.context.user_id = decoded.userId;
        next();
      } else {
        next(new HttpException(401));
      }
    }
  );
}
