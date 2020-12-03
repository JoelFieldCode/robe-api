import { VerifyCallback, VerifyOptions } from "jsonwebtoken";

export const mockVerifyWithUserId = (userId: string) => (
  token: string,
  secret: any,
  options: VerifyOptions,
  callback: VerifyCallback
) => callback(null, { userId });
