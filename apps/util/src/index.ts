import { z } from "zod";

export type ImportMetaWithEnv = ImportMeta & {
	env?: Record<string, string | undefined>;
};

export const localApiBaseUrl = "http://localhost:41412";
export const localAppBaseUrl = "http://localhost:41411";
export const localWebsiteBaseUrl = "http://localhost:41410";
export const productionApiBaseUrl = "https://api.commentvia.com";
export const productionAppBaseUrl = "https://app.commentvia.com";
export const productionWebsiteBaseUrl = "https://commentvia.com";

const viteEnv = () => (import.meta as ImportMetaWithEnv).env;

const parseBooleanEnv = (value: string | boolean | undefined) => {
	if (value === undefined) {
		return undefined;
	}

	if (typeof value === "boolean") {
		return value;
	}

	if (value === "1" || value === "true") {
		return true;
	}

	if (value === "0" || value === "false") {
		return false;
	}

	return undefined;
};

const getCommentViaLocalEnv = () => {
	const env = viteEnv();

	return (
		getProcessEnv("COMMENTVIA_LOCAL") ??
		getProcessEnv("NEXT_PUBLIC_COMMENTVIA_LOCAL") ??
		getProcessEnv("VITE_COMMENTVIA_LOCAL") ??
		env?.VITE_COMMENTVIA_LOCAL
	);
};

const getProcessEnv = (key: string) => {
	try {
		return process.env[key];
	} catch {
		return undefined;
	}
};

const getViteProdEnv = () => {
	const value = viteEnv()?.PROD;

	return parseBooleanEnv(value);
};

const localOverride = parseBooleanEnv(getCommentViaLocalEnv());

export const isLocal =
	localOverride ??
	!(getProcessEnv("NODE_ENV") === "production" || getViteProdEnv());

export const isLive = !isLocal;

const getLocalBrowserBaseUrl = (port: number) => {
	try {
		const browserWindow = globalThis as typeof globalThis & {
			location?: { hostname?: string; protocol?: string };
		};
		if (browserWindow.location?.hostname && browserWindow.location.protocol) {
			return `${browserWindow.location.protocol}//${browserWindow.location.hostname}:${port}`;
		}
	} catch {
		// Fall through to the non-browser loopback default.
	}

	return `http://${"127.0.0.1"}:${port}`;
};

export const getDefaultApiBaseUrl = () =>
	viteEnv()?.VITE_API_URL ??
	getProcessEnv("VITE_API_URL") ??
	getProcessEnv("API_ORIGIN") ??
	(isLive ? productionApiBaseUrl : getLocalBrowserBaseUrl(41412));

export const getDefaultAppBaseUrl = () =>
	viteEnv()?.VITE_APP_URL ??
	getProcessEnv("VITE_APP_URL") ??
	getProcessEnv("APP_ORIGIN") ??
	(isLive ? productionAppBaseUrl : getLocalBrowserBaseUrl(41411));

export const getDefaultWebsiteBaseUrl = () =>
	viteEnv()?.VITE_WEBSITE_URL ??
	getProcessEnv("VITE_WEBSITE_URL") ??
	getProcessEnv("WEBSITE_ORIGIN") ??
	(isLive ? productionWebsiteBaseUrl : getLocalBrowserBaseUrl(41410));

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
