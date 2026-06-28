import { z } from "zod";

export type ImportMetaWithEnv = ImportMeta & {
	env?: Record<string, string | undefined>;
};

export const localApiBaseUrl = "http://localhost:41412";
export const localAppBaseUrl = "http://localhost:41411";
export const localWebsiteBaseUrl = "http://localhost:41410";

const viteEnv = () => (import.meta as ImportMetaWithEnv).env;

export const getDefaultApiBaseUrl = () =>
	viteEnv()?.VITE_API_URL ?? localApiBaseUrl;

export const getDefaultAppBaseUrl = () =>
	viteEnv()?.VITE_APP_URL ?? localAppBaseUrl;

export const getDefaultWebsiteBaseUrl = () =>
	viteEnv()?.VITE_WEBSITE_URL ?? localWebsiteBaseUrl;

export const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const keywordRuleSchema = z.object({
	id: z.string(),
	postUrl: z.string().url(),
	keyword: z.string().min(1),
	dmLink: z.string().url(),
	dmMessage: z.string().min(1),
	publicReply: z.string().min(1),
	enabled: z.boolean(),
	createdAt: z.string(),
});

export type KeywordRule = z.infer<typeof keywordRuleSchema>;

export const instagramCommentEventSchema = z.object({
	commentId: z.string(),
	mediaId: z.string(),
	postUrl: z.string().url().optional(),
	username: z.string(),
	text: z.string(),
	receivedAt: z.string(),
});

export type InstagramCommentEvent = z.infer<typeof instagramCommentEventSchema>;

export type AutomationMatch = {
	rule: KeywordRule;
	event: InstagramCommentEvent;
	normalizedKeyword: string;
};

export const normalizeKeyword = (value: string) =>
	value.trim().toLocaleLowerCase().normalize("NFKC");

export const findMatchingRule = (
	rules: KeywordRule[],
	event: InstagramCommentEvent,
): AutomationMatch | undefined => {
	const comment = normalizeKeyword(event.text);

	for (const rule of rules) {
		if (!rule.enabled) {
			continue;
		}

		const normalizedKeyword = normalizeKeyword(rule.keyword);
		if (comment.includes(normalizedKeyword)) {
			return { event, normalizedKeyword, rule };
		}
	}

	return undefined;
};
