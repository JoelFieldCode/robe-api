import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import { AccessTokenPayload } from "../services/auth/login";

export default function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.path.includes("/auth") || req.body.query.includes("login") || req.path === "/playground") {
    return next();
  }
  verify(
    req.token,
    process.env.SECRET,
    null,
    (err: JsonWebTokenError, decoded: AccessTokenPayload) => {
      if (!err) {
        req.context = {
          user_id: decoded.userId
        };
        next();
      } else {
        next(new HttpException(401, "Unauthenticated"));
      }
    }
  );
}
