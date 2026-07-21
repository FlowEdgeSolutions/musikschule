/**
 * Schreibt die Standardinhalte in eine leere Datenbank. Idempotent:
 * vorhandene Zeilen werden nicht überschrieben.
 *
 *   npm run db:seed
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { defaultCmsData } from "../src/lib/cms/default-data";
import { events, posts, siteContent } from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL ist nicht gesetzt.");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

try {
  const existingSite = await db.select().from(siteContent).limit(1);

  if (existingSite.length > 0) {
    console.log("Datenbank enthält bereits Inhalte — Seed übersprungen.");
  } else {
    await db.insert(siteContent).values({ id: 1, ...defaultCmsData.site });

    if (defaultCmsData.events.length > 0) {
      await db.insert(events).values(
        defaultCmsData.events.map((event, index) => ({ ...event, sortOrder: index })),
      );
    }

    if (defaultCmsData.posts.length > 0) {
      await db.insert(posts).values(
        defaultCmsData.posts.map((post, index) => ({ ...post, sortOrder: index })),
      );
    }

    console.log(
      `Seed geschrieben: ${defaultCmsData.events.length} Events, ${defaultCmsData.posts.length} Beiträge.`,
    );
  }
} catch (error) {
  console.error("Seed fehlgeschlagen:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
