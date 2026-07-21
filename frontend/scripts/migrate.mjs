/**
 * Wendet die Migrationen aus ./drizzle an.
 *
 * Bewusst plain JavaScript und bewusst der Migrator aus drizzle-orm
 * (Produktions-Dependency): so läuft das Skript im Docker-Image ohne tsx
 * und ohne drizzle-kit.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL ist nicht gesetzt.");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

try {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("Migrationen angewendet.");
} catch (error) {
  console.error("Migration fehlgeschlagen:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
