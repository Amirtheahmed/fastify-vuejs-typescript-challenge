import path from "path";
import fs, { constants as fsConstants, promises as fsPromises } from "fs";
import util from "util";

const writeFile = util.promisify(fs.writeFile);
export const unlink = util.promisify(fs.unlink);

export async function saveImage(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const uploadsDir = path.join(__dirname, "../../uploads/images");
  fs.mkdirSync(uploadsDir, { recursive: true });

  const imagePath = path.join(uploadsDir, filename);
  await writeFile(imagePath, buffer);

  return `/uploads/images/${filename}`;
}

export function getProductImagePath(imageUrl: string): string {
  const filename = path.basename(imageUrl);
  return path.join(__dirname, "../../uploads/images", filename);
}

export async function fileExists(filePath: string) {
  try {
    await fsPromises.access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}
