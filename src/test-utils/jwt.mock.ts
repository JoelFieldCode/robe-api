import { VerifyCallback, VerifyOptions } from "jsonwebtoken";

export const verify = (
  token: string,
  secret: any,
  options: VerifyOptions,
  callback: VerifyCallback
) => callback(null, { userId: "test" });
