import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import HttpException from "../exceptions/HttpException";

interface GoogleTokenResp {
  issued_to: String;
  audience: String;
  user_id: String;
  scope: String;
  expires_in: Number;
  access_type: String;
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.token) {
    return next(new HttpException(401));
  }

  try {
    const googleResp = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${req.token}`
    );
    if (googleResp.status !== 200) {
      return next(new HttpException(401));
    }
    const json: GoogleTokenResp = await googleResp.json();
    req.context.user_id = json.user_id;
  } catch (err) {
    return next(new HttpException(401));
  }

  return next();
}
