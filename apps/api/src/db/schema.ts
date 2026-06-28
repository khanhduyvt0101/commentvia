import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const ruleStatus = pgEnum("rule_status", ["active", "paused", "review"]);

export const replyStatus = pgEnum("reply_status", [
	"delivered",
	"needs review",
	"failed",
]);

export const keywordRules = pgTable(
	"keyword_rules",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		postUrl: text("post_url").notNull(),
		keyword: text("keyword").notNull(),
		dmLink: text("dm_link").notNull(),
		dmMessage: text("dm_message").notNull(),
		publicReply: text("public_reply").notNull(),
		status: ruleStatus("status").notNull().default("active"),
		enabled: boolean("enabled").notNull().default(true),
		sent: integer("sent").notNull().default(0),
		clicks: integer("clicks").notNull().default(0),
		createdAt: timestamp("created_at", {
			mode: "date",
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", {
			mode: "date",
			withTimezone: true,
		})
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("keyword_rules_keyword_idx").on(table.keyword),
		index("keyword_rules_status_idx").on(table.status),
	],
);

export const replyEvents = pgTable(
	"reply_events",
	{
		id: text("id").primaryKey(),
		ruleId: text("rule_id")
			.notNull()
			.references(() => keywordRules.id, { onDelete: "cascade" }),
		viewer: text("viewer").notNull(),
		comment: text("comment").notNull(),
		reply: text("reply").notNull(),
		status: replyStatus("status").notNull().default("delivered"),
		timeLabel: text("time_label").notNull(),
		receivedAt: timestamp("received_at", {
			mode: "date",
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
		createdAt: timestamp("created_at", {
			mode: "date",
			withTimezone: true,
		})
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("reply_events_received_at_idx").on(table.receivedAt),
		index("reply_events_rule_id_idx").on(table.ruleId),
	],
);

export const activityDaily = pgTable("activity_daily", {
	day: text("day").primaryKey(),
	comments: integer("comments").notNull().default(0),
	dms: integer("dms").notNull().default(0),
	clicks: integer("clicks").notNull().default(0),
});

export type InsertKeywordRule = typeof keywordRules.$inferInsert;
export type SelectKeywordRule = typeof keywordRules.$inferSelect;
export type InsertReplyEvent = typeof replyEvents.$inferInsert;
export type SelectReplyEvent = typeof replyEvents.$inferSelect;
export type InsertActivityPoint = typeof activityDaily.$inferInsert;
export type SelectActivityPoint = typeof activityDaily.$inferSelect;
