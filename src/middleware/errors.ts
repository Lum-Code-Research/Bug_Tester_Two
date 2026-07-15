import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.path}`);
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
