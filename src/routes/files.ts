import { Router } from "express";
import { ZodError } from "zod";
import { HttpError } from "../middleware/errors";
import { assetQuerySchema, fileQuerySchema } from "../middleware/validation";
import { readUploadedFile, resolvePublicAsset } from "../services/pathReader";

export const filesRouter = Router();

filesRouter.get("/files/upload", (req, res, next) => {
  try {
    const { file } = fileQuerySchema.parse(req.query);
    res.type("text/plain").send(readUploadedFile(file));
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});

filesRouter.get("/files/public", (req, res, next) => {
  try {
    const { path: assetPath } = assetQuerySchema.parse(req.query);
    res.type("text/plain").send(resolvePublicAsset(assetPath));
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, error.errors.map((e) => e.message).join("; ")));
      return;
    }
    next(error);
  }
});
