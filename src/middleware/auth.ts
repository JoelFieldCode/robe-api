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
  /*
    TODO use database sessions:
    https://www.npmjs.com/package/connect-pg-simple
  */
  if (req.session.user_id) {
    req.context.user_id = req.session.user_id;
    return next();
  }
  // if no session, must have a token
  if (!req.token) {
    return next(new HttpException(401));
  }

  // allow this invalid token in dev
  if (req.token === "test" && process.env.NODE_ENV === "development") {
    req.session.user_id = "test";
    req.context.user_id = "test";
    return next();
  }

  /*
    Current auth check here isn’t secure enough - need to make sure the token is signed for my API 
    and not just the user's access token for any google service..
  */
  try {
    const googleResp = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${req.token}`
    );
    if (googleResp.status !== 200) {
      return next(new HttpException(401));
    }
    const googleTokenResp: GoogleTokenResp = await googleResp.json();
    if (googleTokenResp.issued_to !== process.env.GOOGLE_CLIENT_ID) {
      return next(new HttpException(401));
    }
    req.context.user_id = googleTokenResp.user_id;
    req.session.user_id = googleTokenResp.user_id;
  } catch (err) {
    return next(new HttpException(401));
  }

  return next();
}
