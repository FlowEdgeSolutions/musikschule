import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "schnittke_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value, "utf8").digest("hex");

const sign = (value: string) => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
};

export const verifyAdminPassword = (password: string) => {
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedHash) return false;
  const actual = sha256(password);
  if (actual.length !== expectedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expectedHash));
};

export const createAdminSession = async () => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
};

export const isAdminAuthenticated = async () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};
