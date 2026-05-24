import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultCmsData } from "./default-data";
import type { CmsData } from "./types";

const CMS_BLOB_PATH = "cms/data.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), ".local-data", "cms-data.json");
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "admin");

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const cloneDefaultData = (): CmsData =>
  JSON.parse(JSON.stringify(defaultCmsData)) as CmsData;

const normalizeCmsData = (value: unknown): CmsData => {
  const defaults = cloneDefaultData();
  const data = typeof value === "object" && value !== null ? (value as Partial<CmsData>) : {};

  return {
    site: { ...defaults.site, ...(data.site ?? {}) },
    events: Array.isArray(data.events) ? data.events : defaults.events,
    posts: Array.isArray(data.posts) ? data.posts : defaults.posts,
    tickets: Array.isArray(data.tickets) ? data.tickets : defaults.tickets,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : defaults.updatedAt,
  };
};

const streamToText = async (stream: ReadableStream<Uint8Array>) => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks).toString("utf8");
};

export const getCmsData = async (): Promise<CmsData> => {
  if (hasBlobToken()) {
    try {
      const { get } = await import("@vercel/blob");
      const blob = await get(CMS_BLOB_PATH, {
        access: "private",
        useCache: false,
      });

      if (!blob || blob.statusCode !== 200) return cloneDefaultData();

      return normalizeCmsData(JSON.parse(await streamToText(blob.stream)));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Falling back to default CMS data:", error);
      }
      return cloneDefaultData();
    }
  }

  try {
    return normalizeCmsData(JSON.parse(await readFile(LOCAL_DATA_PATH, "utf8")));
  } catch {
    return cloneDefaultData();
  }
};

export const saveCmsData = async (data: CmsData) => {
  const nextData = normalizeCmsData({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  if (hasBlobToken()) {
    const { put } = await import("@vercel/blob");
    await put(CMS_BLOB_PATH, JSON.stringify(nextData, null, 2), {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
    });
    return nextData;
  }

  await mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await writeFile(LOCAL_DATA_PATH, JSON.stringify(nextData, null, 2), "utf8");
  return nextData;
};

export const uploadCmsFile = async (file: File) => {
  const extension = path.extname(file.name).toLowerCase() || ".bin";
  const safeBase = path
    .basename(file.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
  const pathname = `uploads/${Date.now()}-${safeBase || "datei"}${extension}`;

  if (hasBlobToken()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });

    return {
      pathname: blob.pathname,
      url: `/api/media/${blob.pathname}`,
    };
  }

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const localName = path.basename(pathname);
  const localPath = path.join(LOCAL_UPLOAD_DIR, localName);
  await writeFile(localPath, Buffer.from(await file.arrayBuffer()));

  return {
    pathname,
    url: `/uploads/admin/${localName}`,
  };
};
