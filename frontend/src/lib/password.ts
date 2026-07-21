import crypto from "node:crypto";
import { promisify } from "node:util";

const SCRYPT_KEYLEN = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const MAXMEM = 64 * 1024 * 1024;

const scrypt = promisify(crypto.scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: crypto.ScryptOptions,
) => Promise<Buffer>;

export const timingSafeEquals = (a: Buffer, b: Buffer) =>
  a.length === b.length && crypto.timingSafeEqual(a, b);

/**
 * Format: scrypt:N:r:p:<salt-base64>:<hash-base64>
 *
 * Trennzeichen ist bewusst ":" und nicht "$": Docker Compose interpoliert
 * Werte aus der .env-Datei, und ein "$" darin würde als Variablenreferenz
 * gelesen — der Hash käme im Container verstümmelt an.
 */
export const hashPassword = async (password: string) => {
  const salt = crypto.randomBytes(16);
  const { N, r, p } = SCRYPT_PARAMS;
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN, { N, r, p, maxmem: MAXMEM });

  return `scrypt:${N}:${r}:${p}:${salt.toString("base64")}:${derived.toString("base64")}`;
};

export const verifyPassword = async (password: string, stored: string) => {
  if (!stored) return false;

  if (!stored.startsWith("scrypt:")) {
    // Altbestand: blankes SHA-256 ohne Salt. Funktioniert weiter, damit niemand
    // ausgesperrt wird — bitte mit `npm run admin:hash` neu erzeugen.
    console.warn(
      "ADMIN_PASSWORD_HASH liegt im alten SHA-256-Format vor. Bitte mit `npm run admin:hash` neu erzeugen.",
    );
    const actual = crypto.createHash("sha256").update(password, "utf8").digest("hex");
    return timingSafeEquals(Buffer.from(actual), Buffer.from(stored));
  }

  const [, n, r, p, salt, hash] = stored.split(":");
  const params = { N: Number(n), r: Number(r), p: Number(p) };

  if (!Number.isFinite(params.N) || !Number.isFinite(params.r) || !Number.isFinite(params.p)) {
    return false;
  }

  const expected = Buffer.from(hash, "base64");
  const derived = await scrypt(password, Buffer.from(salt, "base64"), expected.length, {
    ...params,
    maxmem: MAXMEM,
  });

  return timingSafeEquals(derived, expected);
};
