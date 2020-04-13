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
  console.log(req.session);
  if (req.session.user_id) {
    req.context.user_id = req.session.user_id;
    return next();
  }
  // if no session, must have a token
  if (!req.token) {
    return next(new HttpException(401));
  }

  // allow this invalid token in dev
  if (req.token === "test") {
    req.session.user_id = "test";
    req.context.user_id = "test";
    return next();
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
    req.session.user_id = json.user_id;
  } catch (err) {
    return next(new HttpException(401));
  }

  return next();
}
