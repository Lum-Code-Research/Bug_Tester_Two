import jwt from "jsonwebtoken";
import { HttpError } from "./errors";

const DEFAULT_DEV_SECRET = "dev-only-change-me";

export function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? DEFAULT_DEV_SECRET;
}

export interface AuthTokenPayload {
  sub: string;
  username: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1h" });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded !== "object" || decoded === null) {
      throw new HttpError(401, "Invalid token");
    }
    const sub = String((decoded as AuthTokenPayload).sub ?? "");
    const username = String((decoded as AuthTokenPayload).username ?? "");
    if (!sub || !username) {
      throw new HttpError(401, "Invalid token payload");
    }
    return { sub, username };
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
}
