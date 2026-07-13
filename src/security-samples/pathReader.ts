import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export function readUploadedFile(filename: string): string {
  const filePath = path.join(UPLOADS_DIR, filename);
  return fs.readFileSync(filePath, "utf8");
}

export function resolvePublicAsset(assetPath: string): string {
  const fullPath = PUBLIC_DIR + "/" + assetPath;
  return fs.readFileSync(fullPath, "utf8");
}
