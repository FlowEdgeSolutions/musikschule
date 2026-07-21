import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { asc, eq, notInArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { events, mediaAssets, posts, siteContent, ticketRequests } from "@/lib/db/schema";
import { defaultCmsData } from "./default-data";
import { MEDIA_URL_PREFIX, UPLOAD_DIR } from "./uploads";
import type { CmsData, CmsEvent, CmsPost, TicketRequest } from "./types";

const cloneDefaultData = (): CmsData =>
  JSON.parse(JSON.stringify(defaultCmsData)) as CmsData;

export const getCmsData = async (): Promise<CmsData> => {
  const [siteRows, eventRows, postRows, ticketRows] = await Promise.all([
    getDb().select().from(siteContent).where(eq(siteContent.id, 1)).limit(1),
    getDb().select().from(events).orderBy(asc(events.sortOrder)),
    getDb().select().from(posts).orderBy(asc(posts.sortOrder)),
    getDb().select().from(ticketRequests).orderBy(asc(ticketRequests.createdAt)),
  ]);

  const site = siteRows[0];

  // Vor dem ersten Seed ist die Datenbank leer — dann rendert die Website die Standardinhalte.
  if (!site) return cloneDefaultData();

  return {
    site: {
      heroEyebrow: site.heroEyebrow,
      heroTitleLine1: site.heroTitleLine1,
      heroTitleAccent: site.heroTitleAccent,
      heroTitleLine2: site.heroTitleLine2,
      heroSubtitle: site.heroSubtitle,
      aboutKicker: site.aboutKicker,
      aboutTitleLine1: site.aboutTitleLine1,
      aboutTitleAccent: site.aboutTitleAccent,
      aboutLead: site.aboutLead,
    },
    events: eventRows.map(toCmsEvent),
    posts: postRows.map(toCmsPost),
    tickets: ticketRows.map(toTicketRequest).reverse(),
    updatedAt: site.updatedAt.toISOString(),
  };
};

/**
 * Das Admin-UI schickt den kompletten Datensatz zurück. Events und Posts werden
 * deshalb abgeglichen (fehlende löschen, vorhandene upserten).
 *
 * Tickets werden bewusst NUR im Status aktualisiert und nie gelöscht: zwischen
 * dem Laden des Dashboards und dem Speichern können neue Anfragen eingehen,
 * die sonst verloren gingen.
 */
export const saveCmsData = async (data: CmsData): Promise<CmsData> => {
  const now = new Date();

  await getDb().transaction(async (tx) => {
    const site = { ...cloneDefaultData().site, ...data.site };

    await tx
      .insert(siteContent)
      .values({ id: 1, ...site, updatedAt: now })
      .onConflictDoUpdate({
        target: siteContent.id,
        set: { ...site, updatedAt: now },
      });

    const eventList = Array.isArray(data.events) ? data.events : [];
    const eventIds = eventList.map((item) => item.id);

    if (eventIds.length > 0) {
      await tx.delete(events).where(notInArray(events.id, eventIds));
    } else {
      await tx.delete(events);
    }

    for (const [index, event] of eventList.entries()) {
      const values = { ...fromCmsEvent(event), sortOrder: index, updatedAt: now };
      await tx
        .insert(events)
        .values(values)
        .onConflictDoUpdate({ target: events.id, set: values });
    }

    const postList = Array.isArray(data.posts) ? data.posts : [];
    const postIds = postList.map((item) => item.id);

    if (postIds.length > 0) {
      await tx.delete(posts).where(notInArray(posts.id, postIds));
    } else {
      await tx.delete(posts);
    }

    for (const [index, post] of postList.entries()) {
      const values = { ...fromCmsPost(post), sortOrder: index, updatedAt: now };
      await tx
        .insert(posts)
        .values(values)
        .onConflictDoUpdate({ target: posts.id, set: values });
    }

    for (const ticket of Array.isArray(data.tickets) ? data.tickets : []) {
      await tx
        .update(ticketRequests)
        .set({ status: ticket.status, updatedAt: now })
        .where(eq(ticketRequests.id, ticket.id));
    }
  });

  return getCmsData();
};

/**
 * Legt eine Ticketanfrage als einzelnes INSERT an — kein Lesen-Ändern-Schreiben
 * des gesamten Datensatzes, damit parallele Admin-Speicherungen nichts überschreiben.
 */
export const createTicketRequest = async (
  input: Omit<TicketRequest, "id" | "status" | "createdAt">,
): Promise<TicketRequest> => {
  const row = {
    id: crypto.randomUUID(),
    ...input,
    status: "new" as const,
  };

  await getDb().insert(ticketRequests).values(row);

  return { ...row, createdAt: new Date().toISOString() };
};

export const findBookableEvent = async (eventId: string) => {
  const rows = await getDb().select().from(events).where(eq(events.id, eventId)).limit(1);
  const event = rows[0];

  if (!event || event.status !== "published" || !event.ticketEnabled) return null;

  return event;
};

export const uploadCmsFile = async (file: File) => {
  const extension = path.extname(file.name).toLowerCase() || ".bin";
  const safeBase = path
    .basename(file.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
  const filename = `${Date.now()}-${safeBase || "datei"}${extension}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  const url = `${MEDIA_URL_PREFIX}/${filename}`;

  await getDb().insert(mediaAssets).values({
    id: crypto.randomUUID(),
    filename: file.name.slice(0, 255),
    contentType: file.type || "application/octet-stream",
    path: filename,
    url,
    size: file.size,
  });

  return { pathname: filename, url };
};

type EventRow = typeof events.$inferSelect;
type PostRow = typeof posts.$inferSelect;
type TicketRow = typeof ticketRequests.$inferSelect;

const toCmsEvent = (row: EventRow): CmsEvent => ({
  id: row.id,
  title: row.title,
  category: row.category,
  date: row.date,
  time: row.time,
  location: row.location,
  description: row.description,
  seatsLabel: row.seatsLabel,
  color: row.color,
  status: row.status as CmsEvent["status"],
  ticketEnabled: row.ticketEnabled,
});

const fromCmsEvent = (event: CmsEvent) => ({
  id: event.id,
  title: event.title,
  category: event.category ?? "",
  date: event.date ?? "",
  time: event.time ?? "",
  location: event.location ?? "",
  description: event.description ?? "",
  seatsLabel: event.seatsLabel ?? "",
  color: event.color ?? "#2d2d2d",
  status: event.status ?? "draft",
  ticketEnabled: Boolean(event.ticketEnabled),
});

const toCmsPost = (row: PostRow): CmsPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  category: row.category,
  excerpt: row.excerpt,
  body: row.body,
  imageUrl: row.imageUrl,
  imageAlt: row.imageAlt,
  publishedAt: row.publishedAt,
  status: row.status as CmsPost["status"],
});

const fromCmsPost = (post: CmsPost) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  category: post.category ?? "",
  excerpt: post.excerpt ?? "",
  body: post.body ?? "",
  imageUrl: post.imageUrl ?? "",
  imageAlt: post.imageAlt ?? "",
  publishedAt: post.publishedAt ?? "",
  status: post.status ?? "draft",
});

const toTicketRequest = (row: TicketRow): TicketRequest => ({
  id: row.id,
  eventId: row.eventId,
  eventTitle: row.eventTitle,
  name: row.name,
  email: row.email,
  phone: row.phone,
  quantity: row.quantity,
  note: row.note,
  status: row.status as TicketRequest["status"],
  createdAt: row.createdAt.toISOString(),
});
