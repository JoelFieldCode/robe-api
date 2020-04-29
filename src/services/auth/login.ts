import { Request } from "express";
import fetch from "node-fetch";
import HttpException from "../../exceptions/HttpException";

interface GoogleTokenResp {
  issued_to: String;
  audience: String;
  user_id: String;
  scope: String;
  expires_in: Number;
  access_type: String;
}

export async function login(req: Request) {
  try {
    if (!req.token) {
      throw new HttpException(401);
    }
    // allow this invalid token in dev
    if (req.token === "test" && process.env.NODE_ENV === "development") {
      req.session.user_id = "test";
      req.context.user_id = "test";
      return true;
    }
    const googleResp = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${req.token}`
    );
    if (googleResp.status !== 200) {
      throw new HttpException(401);
    }
    const googleTokenResp: GoogleTokenResp = await googleResp.json();
    if (googleTokenResp.issued_to !== process.env.GOOGLE_CLIENT_ID) {
      throw new HttpException(401);
    }
    req.context.user_id = googleTokenResp.user_id;
    req.session.user_id = googleTokenResp.user_id;
    return true;
  } catch (err) {
    throw new HttpException(401);
  }
}
