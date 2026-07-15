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

function readFileIfRegular(filePath: string): string {
  try {
    // Open+read in one shot; map missing/non-file into 404 without existence race
    const fd = fs.openSync(filePath, "r");
    try {
      const stats = fs.fstatSync(fd);
      if (!stats.isFile()) {
        throw new HttpError(404, "File not found");
      }
      return fs.readFileSync(fd, "utf8");
    } finally {
      fs.closeSync(fd);
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") {
      throw new HttpError(404, "File not found");
    }
    throw error;
  }
}

export function readUploadedFile(filename: string): string {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const filePath = resolveInside(uploadsDir, filename);
  return readFileIfRegular(filePath);
}

export function resolvePublicAsset(assetPath: string): string {
  const publicDir = path.join(process.cwd(), "public");
  const filePath = resolveInside(publicDir, assetPath);
  return readFileIfRegular(filePath);
}
