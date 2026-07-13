import { Router } from "express";
import { readUploadedFile, resolvePublicAsset } from "../services/pathReader";

export const filesRouter = Router();

filesRouter.get("/files/upload", (req, res) => {
  const filename = String(req.query.file ?? "");
  try {
    res.type("text/plain").send(readUploadedFile(filename));
  } catch (error) {
    res.status(404).type("text/plain").send(String(error));
  }
});

filesRouter.get("/files/public", (req, res) => {
  const assetPath = String(req.query.path ?? "");
  try {
    res.type("text/plain").send(resolvePublicAsset(assetPath));
  } catch (error) {
    res.status(404).type("text/plain").send(String(error));
  }
});
