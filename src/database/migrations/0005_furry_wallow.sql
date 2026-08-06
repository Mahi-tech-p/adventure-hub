CREATE TYPE "public"."activity_status" AS ENUM('ACTIVE', 'MAINTENANCE', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."activity_difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"park_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"short_description" varchar(500),
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"duration_minutes" integer NOT NULL,
	"minimum_age" integer,
	"maximum_age" integer,
	"minimum_height" integer,
	"maximum_height" integer,
	"minimum_weight" integer,
	"maximum_weight" integer,
	"capacity" integer NOT NULL,
	"difficulty" "activity_difficulty" NOT NULL,
	"status" "activity_status" DEFAULT 'ACTIVE' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "activities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;