import { Request } from "express";
import { sign } from "jsonwebtoken";
import fetch from "node-fetch";
import HttpException from "../../exceptions/HttpException";
import isDev from "../../utils/isDev";

export const ALLOWED_DEV_TOKEN = "test";

interface GoogleTokenResp {
  issued_to: string;
  audience: string;
  user_id: string;
  scope: string;
  expires_in: number;
  access_type: string;
}

export interface AccessTokenPayload {
  userId: string;
}

export async function login(req: Request) {
  try {
    const googleAccesstoken = req.headers["google-access-token"];
    if (!googleAccesstoken) {
      throw new HttpException(401);
    }
    // allow this invalid token in dev
    if (googleAccesstoken === ALLOWED_DEV_TOKEN && isDev()) {
      return createToken(ALLOWED_DEV_TOKEN);
    }
    const googleResp = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAccesstoken}`
    );
    if (googleResp.status !== 200) {
      throw new HttpException(401);
    }
    const googleTokenResp: GoogleTokenResp = await googleResp.json();
    if (googleTokenResp.issued_to !== process.env.GOOGLE_CLIENT_ID) {
      throw new HttpException(401);
    }
    return createToken(googleTokenResp.user_id);
  } catch (err) {
    throw new HttpException(401);
  }
}

function createToken(userId: string): string {
  const payload = getAccessTokenPayload(userId);
  const token = sign(payload, process.env.SECRET, {
    // TODO make it expire in 5 mins
    expiresIn: 86400,
  });
  return token;
}

function getAccessTokenPayload(userId: string): AccessTokenPayload {
  return {
    userId,
  };
}
