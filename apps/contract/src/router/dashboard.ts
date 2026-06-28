import { oc } from "@orpc/contract";
import { z } from "zod";

export const dashboardRangeSchema = z
	.object({
		range: z.enum(["7d", "30d", "90d"]).default("30d"),
	})
	.optional();

export const dashboardMetricSchema = z.object({
	label: z.string(),
	value: z.number(),
	change: z.string(),
	trend: z.enum(["up", "down", "flat"]),
});

export const activityPointSchema = z.object({
	day: z.string(),
	comments: z.number(),
	dms: z.number(),
	clicks: z.number(),
});

export const ruleStatusSchema = z.enum(["active", "paused", "review"]);

export const dashboardRuleSchema = z.object({
	id: z.string(),
	name: z.string(),
	postUrl: z.string().url(),
	keyword: z.string(),
	dmLink: z.string().url(),
	publicReply: z.string(),
	status: ruleStatusSchema,
	sent: z.number(),
	clicks: z.number(),
	conversionRate: z.number(),
});

export const replyQueueItemSchema = z.object({
	id: z.string(),
	viewer: z.string(),
	comment: z.string(),
	reply: z.string(),
	status: z.enum(["delivered", "needs review", "failed"]),
	time: z.string(),
});

export const dashboardPayloadSchema = z.object({
	range: z.enum(["7d", "30d", "90d"]),
	metrics: z.array(dashboardMetricSchema),
	activity: z.array(activityPointSchema),
	rules: z.array(dashboardRuleSchema),
	queue: z.array(replyQueueItemSchema),
});

export const dashboard = oc
	.route({
		method: "POST",
		path: "/dashboard",
		summary: "Read creator dashboard data",
		tags: ["Dashboard"],
	})
	.input(dashboardRangeSchema)
	.output(dashboardPayloadSchema);

export type DashboardPayload = z.infer<typeof dashboardPayloadSchema>;
export type DashboardRule = z.infer<typeof dashboardRuleSchema>;
