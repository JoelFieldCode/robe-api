import { VerifyCallback, VerifyOptions } from "jsonwebtoken";
import { ALLOWED_DEV_TOKEN } from "../services/auth/login";

export const verify = (
  token: string,
  secret: any,
  options: VerifyOptions,
  callback: VerifyCallback
) => callback(null, { userId: ALLOWED_DEV_TOKEN });
