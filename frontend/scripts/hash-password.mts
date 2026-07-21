/**
 * Erzeugt den Wert für ADMIN_PASSWORD_HASH.
 *
 *   npm run admin:hash -- "mein-passwort"
 */
import { hashPassword } from "../src/lib/password";

const password = process.argv[2];

if (!password) {
  console.error('Aufruf: npm run admin:hash -- "mein-passwort"');
  process.exit(1);
}

if (password.length < 12) {
  console.warn("Hinweis: mindestens 12 Zeichen empfohlen.\n");
}

console.log(`ADMIN_PASSWORD_HASH=${await hashPassword(password)}`);
