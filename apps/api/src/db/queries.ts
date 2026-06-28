import type {
	DashboardPayload,
	DashboardRule,
	replyQueueItemSchema,
} from "@commentvia/contract";
import { desc } from "drizzle-orm";
import type { z } from "zod";
import { db } from "./client";
import { activityDaily, keywordRules, replyEvents } from "./schema";

type ReplyQueueItem = z.infer<typeof replyQueueItemSchema>;

const roundOneDecimal = (value: number) => Math.round(value * 10) / 10;

const toDashboardRule = (
	rule: typeof keywordRules.$inferSelect,
): DashboardRule => ({
	id: rule.id,
	name: rule.name,
	postUrl: rule.postUrl,
	keyword: rule.keyword,
	dmLink: rule.dmLink,
	publicReply: rule.publicReply,
	status: rule.status,
	sent: rule.sent,
	clicks: rule.clicks,
	conversionRate:
		rule.sent === 0 ? 0 : roundOneDecimal((rule.clicks / rule.sent) * 100),
});

const toReplyQueueItem = (
	event: typeof replyEvents.$inferSelect,
): ReplyQueueItem => ({
	id: event.id,
	viewer: event.viewer,
	comment: event.comment,
	reply: event.reply,
	status: event.status,
	time: event.timeLabel,
});

export async function listDashboardRules() {
	const rows = await db
		.select()
		.from(keywordRules)
		.orderBy(desc(keywordRules.sent));

	return rows.map(toDashboardRule);
}

export async function getDashboardPayload(
	range: DashboardPayload["range"] = "30d",
): Promise<DashboardPayload> {
	const [rules, activity, queueRows] = await Promise.all([
		listDashboardRules(),
		db.select().from(activityDaily),
		db
			.select()
			.from(replyEvents)
			.orderBy(desc(replyEvents.receivedAt))
			.limit(8),
	]);

	const totalDms = rules.reduce((sum, rule) => sum + rule.sent, 0);
	const totalClicks = rules.reduce((sum, rule) => sum + rule.clicks, 0);
	const activeRules = rules.filter((rule) => rule.status === "active").length;

	return {
		range,
		metrics: [
			{
				label: "DMs sent",
				value: totalDms,
				change: "+18.4%",
				trend: "up",
			},
			{
				label: "Link clicks",
				value: totalClicks,
				change: "+12.1%",
				trend: "up",
			},
			{
				label: "Active rules",
				value: activeRules,
				change: `${activeRules} live`,
				trend: "flat",
			},
			{
				label: "Avg click rate",
				value:
					totalDms === 0 ? 0 : roundOneDecimal((totalClicks / totalDms) * 100),
				change: "+4.6 pts",
				trend: "up",
			},
		],
		activity,
		rules,
		queue: queueRows.map(toReplyQueueItem),
	};
}
