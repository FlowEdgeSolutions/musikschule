import { defineConfig } from "drizzle-kit";

// drizzle-kit läuft außerhalb von Next und kennt dessen Env-Dateien nicht.
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Datei fehlt — dann muss DATABASE_URL aus der Umgebung kommen.
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ist nicht gesetzt (erwartet in frontend/.env).");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
