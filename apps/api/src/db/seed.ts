import { count } from "drizzle-orm";
import { db } from "./client";
import {
	activityDaily,
	type InsertActivityPoint,
	type InsertKeywordRule,
	type InsertReplyEvent,
	keywordRules,
	replyEvents,
} from "./schema";

const seedRules = [
	{
		id: "rule_outfit",
		name: "Outfit link on launch Reel",
		postUrl: "https://www.instagram.com/p/CuteLookDemo/",
		keyword: "outfit",
		dmLink: "https://shop.link/outfit",
		dmMessage: "Here is the outfit link: https://shop.link/outfit",
		publicReply: "Check your inbox. I sent the outfit link.",
		status: "active",
		sent: 1240,
		clicks: 812,
	},
	{
		id: "rule_hair",
		name: "Hair tools carousel",
		postUrl: "https://www.instagram.com/p/HairStackDemo/",
		keyword: "hair",
		dmLink: "https://shop.link/hair",
		dmMessage: "Here are the hair tools: https://shop.link/hair",
		publicReply: "Sent it to your inbox.",
		status: "active",
		sent: 846,
		clicks: 491,
	},
	{
		id: "rule_paint",
		name: "Studio wall color post",
		postUrl: "https://www.instagram.com/p/PaintDemo/",
		keyword: "paint",
		dmLink: "https://shop.link/paint",
		dmMessage: "Here are the paint details: https://shop.link/paint",
		publicReply: "Check DM. I shared the paint details.",
		status: "review",
		sent: 312,
		clicks: 168,
	},
] satisfies InsertKeywordRule[];

const seedActivity = [
	{ day: "Mon", comments: 132, dms: 118, clicks: 73 },
	{ day: "Tue", comments: 164, dms: 151, clicks: 95 },
	{ day: "Wed", comments: 121, dms: 112, clicks: 76 },
	{ day: "Thu", comments: 186, dms: 169, clicks: 108 },
	{ day: "Fri", comments: 218, dms: 201, clicks: 142 },
	{ day: "Sat", comments: 247, dms: 231, clicks: 158 },
	{ day: "Sun", comments: 204, dms: 190, clicks: 127 },
] satisfies InsertActivityPoint[];

const seedReplies = [
	{
		id: "evt_1",
		ruleId: "rule_outfit",
		viewer: "sophia.tran",
		comment: "outfit",
		reply: "Check your inbox. I sent the outfit link.",
		status: "delivered",
		timeLabel: "2m ago",
	},
	{
		id: "evt_2",
		ruleId: "rule_hair",
		viewer: "mai.style",
		comment: "xin link hair",
		reply: "Sent it to your inbox.",
		status: "delivered",
		timeLabel: "8m ago",
	},
	{
		id: "evt_3",
		ruleId: "rule_paint",
		viewer: "linh.home",
		comment: "paint mau gi vay?",
		reply: "Check DM. I shared the paint details.",
		status: "needs review",
		timeLabel: "13m ago",
	},
] satisfies InsertReplyEvent[];

export async function seedDemoData() {
	const [ruleCountRow] = await db.select({ value: count() }).from(keywordRules);
	const ruleCount = ruleCountRow?.value ?? 0;

	if (ruleCount > 0) {
		return;
	}

	await db.insert(keywordRules).values(seedRules).onConflictDoNothing();
	await db.insert(activityDaily).values(seedActivity).onConflictDoNothing();
	await db.insert(replyEvents).values(seedReplies).onConflictDoNothing();
}
