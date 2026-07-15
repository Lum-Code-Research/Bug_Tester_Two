import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

function sanitizeForLog(value: unknown): string {
  return String(value)
    .replace(/[\r\n]+/g, " ")
    // Remove ASCII control chars without triggering no-control-regex
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");
}

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const method = sanitizeForLog(req.method);
  const path = sanitizeForLog(req.path);
  console.log(`${method} ${path}`);
  next();
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err.status === "number" ? err.status : 500;
  const message =
    status >= 500
      ? "Internal server error"
      : String(err.message ?? "Request failed");

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
};

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
