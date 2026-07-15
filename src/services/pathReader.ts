import fs from "fs";
import path from "path";
import { HttpError } from "../middleware/errors";

function resolveInside(rootDir: string, relativePath: string): string {
  const root = path.resolve(rootDir);
  const candidate = path.resolve(root, relativePath);
  const relative = path.relative(root, candidate);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new HttpError(400, "Invalid path");
  }

  return candidate;
}

export function readUploadedFile(filename: string): string {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const filePath = resolveInside(uploadsDir, filename);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new HttpError(404, "File not found");
  }
  return fs.readFileSync(filePath, "utf8");
}

export function resolvePublicAsset(assetPath: string): string {
  const publicDir = path.join(process.cwd(), "public");
  const filePath = resolveInside(publicDir, assetPath);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new HttpError(404, "Asset not found");
  }
  return fs.readFileSync(filePath, "utf8");
}
