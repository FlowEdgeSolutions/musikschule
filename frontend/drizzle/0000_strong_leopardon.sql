CREATE TABLE "events" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT '' NOT NULL,
	"date" varchar(80) DEFAULT '' NOT NULL,
	"time" varchar(80) DEFAULT '' NOT NULL,
	"location" varchar(255) DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"seats_label" varchar(100) DEFAULT '' NOT NULL,
	"color" varchar(20) DEFAULT '#2d2d2d' NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"ticket_enabled" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"filename" varchar(255) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"path" varchar(500) NOT NULL,
	"url" varchar(500) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT '' NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"image_url" varchar(500) DEFAULT '' NOT NULL,
	"image_alt" varchar(255) DEFAULT '' NOT NULL,
	"published_at" varchar(32) DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"hero_eyebrow" varchar(255) DEFAULT '' NOT NULL,
	"hero_title_line1" varchar(255) DEFAULT '' NOT NULL,
	"hero_title_accent" varchar(255) DEFAULT '' NOT NULL,
	"hero_title_line2" varchar(255) DEFAULT '' NOT NULL,
	"hero_subtitle" text DEFAULT '' NOT NULL,
	"about_kicker" varchar(255) DEFAULT '' NOT NULL,
	"about_title_line1" varchar(255) DEFAULT '' NOT NULL,
	"about_title_accent" varchar(255) DEFAULT '' NOT NULL,
	"about_lead" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_requests" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"event_id" varchar(36) NOT NULL,
	"event_title" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(100) DEFAULT '' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ticket_requests_event_id_idx" ON "ticket_requests" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "ticket_requests_email_idx" ON "ticket_requests" USING btree ("email");--> statement-breakpoint
CREATE INDEX "ticket_requests_status_idx" ON "ticket_requests" USING btree ("status");