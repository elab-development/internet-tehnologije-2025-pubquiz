CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"season_id" integer NOT NULL,
	"title" text NOT NULL,
	"date_time" timestamp NOT NULL,
	"location" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;