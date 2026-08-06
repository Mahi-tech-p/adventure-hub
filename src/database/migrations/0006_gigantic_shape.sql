CREATE TYPE "public"."slot_status" AS ENUM('AVAILABLE', 'FULL', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "activity_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"slot_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"capacity" integer NOT NULL,
	"booked_count" integer DEFAULT 0 NOT NULL,
	"price_override" numeric(10, 2),
	"status" "slot_status" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "activity_slots" ADD CONSTRAINT "activity_slots_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;