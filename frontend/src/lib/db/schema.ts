import {
  boolean,
  integer,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/** Einzelne Zeile mit id = 1. Hält die redaktionellen Texte von Hero und About. */
export const siteContent = pgTable("site_content", {
  id: integer("id").primaryKey().default(1),
  heroEyebrow: varchar("hero_eyebrow", { length: 255 }).notNull().default(""),
  heroTitleLine1: varchar("hero_title_line1", { length: 255 }).notNull().default(""),
  heroTitleAccent: varchar("hero_title_accent", { length: 255 }).notNull().default(""),
  heroTitleLine2: varchar("hero_title_line2", { length: 255 }).notNull().default(""),
  heroSubtitle: text("hero_subtitle").notNull().default(""),
  aboutKicker: varchar("about_kicker", { length: 255 }).notNull().default(""),
  aboutTitleLine1: varchar("about_title_line1", { length: 255 }).notNull().default(""),
  aboutTitleAccent: varchar("about_title_accent", { length: 255 }).notNull().default(""),
  aboutLead: text("about_lead").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * `date`/`time` sind bewusst freie Strings ("15. März 2026", "19:30 Uhr") —
 * so pflegt die Redaktion sie im Admin-UI, und so rendert die Website sie.
 * `sortOrder` hält die im Dashboard gewählte Reihenfolge fest.
 */
export const events = pgTable(
  "events",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull().default(""),
    date: varchar("date", { length: 80 }).notNull().default(""),
    time: varchar("time", { length: 80 }).notNull().default(""),
    location: varchar("location", { length: 255 }).notNull().default(""),
    description: text("description").notNull().default(""),
    seatsLabel: varchar("seats_label", { length: 100 }).notNull().default(""),
    color: varchar("color", { length: 20 }).notNull().default("#2d2d2d"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    ticketEnabled: boolean("ticket_enabled").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("events_status_idx").on(table.status)],
);

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    category: varchar("category", { length: 100 }).notNull().default(""),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull().default(""),
    imageUrl: varchar("image_url", { length: 500 }).notNull().default(""),
    imageAlt: varchar("image_alt", { length: 255 }).notNull().default(""),
    publishedAt: varchar("published_at", { length: 32 }).notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("posts_status_idx").on(table.status)],
);

/** `eventTitle` wird bewusst kopiert, damit die Anfrage lesbar bleibt, wenn das Event später umbenannt oder gelöscht wird. */
export const ticketRequests = pgTable(
  "ticket_requests",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    eventId: varchar("event_id", { length: 36 }).notNull(),
    eventTitle: varchar("event_title", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 100 }).notNull().default(""),
    quantity: integer("quantity").notNull().default(1),
    note: text("note").notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    ...timestamps,
  },
  (table) => [
    index("ticket_requests_event_id_idx").on(table.eventId),
    index("ticket_requests_email_idx").on(table.email),
    index("ticket_requests_status_idx").on(table.status),
  ],
);

export const mediaAssets = pgTable("media_assets", {
  id: varchar("id", { length: 36 }).primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  path: varchar("path", { length: 500 }).notNull().unique(),
  url: varchar("url", { length: 500 }).notNull(),
  size: integer("size").notNull(),
  ...timestamps,
});
