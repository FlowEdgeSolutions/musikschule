import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Sql = ReturnType<typeof postgres>;
type Database = ReturnType<typeof createDb>;

// Im Dev legt jeder HMR-Durchlauf sonst einen neuen Pool an und die Verbindungen laufen voll.
const globalForDb = globalThis as unknown as { __schnittkeDb?: Database; __schnittkeSql?: Sql };

const createDb = (sql: Sql) => drizzle(sql, { schema });

/**
 * Bewusst faul aufgebaut: beim Docker-Build und beim Sammeln der Routen gibt es
 * noch keine Datenbank. Eine fehlende DATABASE_URL fällt so erst beim ersten
 * Query auf statt schon beim Import.
 */
export const getDb = (): Database => {
  if (globalForDb.__schnittkeDb) return globalForDb.__schnittkeDb;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL ist nicht gesetzt. Siehe frontend/.env.example.");
  }

  const sql = postgres(connectionString, {
    max: process.env.NODE_ENV === "production" ? 10 : 3,
  });

  globalForDb.__schnittkeSql = sql;
  globalForDb.__schnittkeDb = createDb(sql);

  return globalForDb.__schnittkeDb;
};
