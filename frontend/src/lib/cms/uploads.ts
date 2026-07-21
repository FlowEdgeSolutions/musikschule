import path from "node:path";

/**
 * Uploads liegen bewusst NICHT unter public/: der Standalone-Server von Next
 * baut das Verzeichnis beim Build in ein Manifest und liefert später
 * hinzugefügte Dateien nicht aus (404). Ausgeliefert wird deshalb über
 * /api/media, gelesen wird aus diesem Verzeichnis.
 *
 * In Produktion ist es ein Docker-Volume (UPLOAD_DIR=/app/uploads).
 */
export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "uploads");

export const MEDIA_URL_PREFIX = "/api/media";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const contentTypeFor = (filename: string) =>
  CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? "application/octet-stream";

/**
 * Löst einen angefragten Pfad innerhalb von UPLOAD_DIR auf und gibt null
 * zurück, sobald er ausbrechen würde ("../", absolute Pfade, Nullbytes).
 */
export const resolveUploadPath = (segments: string[]) => {
  if (segments.length === 0) return null;
  if (segments.some((segment) => !segment || segment.includes("\0"))) return null;

  const resolved = path.resolve(UPLOAD_DIR, ...segments);
  const base = UPLOAD_DIR.endsWith(path.sep) ? UPLOAD_DIR : UPLOAD_DIR + path.sep;

  return resolved.startsWith(base) ? resolved : null;
};
