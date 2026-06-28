CREATE TYPE "public"."reply_status" AS ENUM('delivered', 'needs review', 'failed');--> statement-breakpoint
CREATE TYPE "public"."rule_status" AS ENUM('active', 'paused', 'review');--> statement-breakpoint
CREATE TABLE "activity_daily" (
	"day" text PRIMARY KEY NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"dms" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keyword_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"post_url" text NOT NULL,
	"keyword" text NOT NULL,
	"dm_link" text NOT NULL,
	"dm_message" text NOT NULL,
	"public_reply" text NOT NULL,
	"status" "rule_status" DEFAULT 'active' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"sent" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reply_events" (
	"id" text PRIMARY KEY NOT NULL,
	"rule_id" text NOT NULL,
	"viewer" text NOT NULL,
	"comment" text NOT NULL,
	"reply" text NOT NULL,
	"status" "reply_status" DEFAULT 'delivered' NOT NULL,
	"time_label" text NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reply_events" ADD CONSTRAINT "reply_events_rule_id_keyword_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."keyword_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "keyword_rules_keyword_idx" ON "keyword_rules" USING btree ("keyword");--> statement-breakpoint
CREATE INDEX "keyword_rules_status_idx" ON "keyword_rules" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reply_events_received_at_idx" ON "reply_events" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "reply_events_rule_id_idx" ON "reply_events" USING btree ("rule_id");