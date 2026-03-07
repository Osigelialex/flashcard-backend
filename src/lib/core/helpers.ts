import crypto from "crypto";
import jwt from "jsonwebtoken";
import { appConfig } from "@config/index";
import { logger } from "./logger";

export const generateToken = (length: number) => {
  return crypto.randomBytes(length).toString("hex");
};

export const nowInSec = () => Math.floor(Date.now() / 1000);

export function generateOtp(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";

  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % digits.length];
  }

  return otp;
}

export function hash(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export const signToken = (claims: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    jwt.sign(claims, appConfig.app.secretKey, function (err, token) {
      if (err) {
        logger.error(`JWT token generation failed: ${err}`);
        reject("Error during token generation");
      }
      resolve(token);
    });
  });
};

export const validateToken = (token: string) => {
  try {
    return jwt.verify(token, appConfig.app.secretKey);
  } catch (e) {
    logger.error(`Token validation failed: ${e}`);
  }
};
