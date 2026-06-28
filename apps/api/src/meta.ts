import { timingSafeEqual } from "node:crypto";
import type { InstagramCommentEvent, KeywordRule } from "@commentvia/util";
import {
	findMatchingRule,
	localApiBaseUrl,
	localAppBaseUrl,
	localWebsiteBaseUrl,
	trimTrailingSlash,
} from "@commentvia/util";

export type MetaConfig = {
	appId: string;
	appSecret: string;
	graphApiVersion: string;
	pageAccessToken: string;
	verifyToken: string;
};

export type PrivateReplyResult = {
	commentId: string;
	messageId?: string;
	status: "sent" | "skipped" | "failed";
	reason?: string;
};

export const metaConnectionPermissions = [
	{
		name: "instagram_business_basic",
		reason:
			"Identify the connected Instagram professional account and show account connection status.",
		required: true,
	},
	{
		name: "instagram_business_manage_comments",
		reason:
			"Read and manage comments so keyword rules can detect eligible comments and leave the public reply.",
		required: true,
	},
	{
		name: "instagram_business_manage_messages",
		reason:
			"Send the requested private reply or DM link after a viewer comments the configured keyword.",
		required: true,
	},
] as const;

export const facebookLoginPermissions = [
	{
		name: "email",
		reason: "Let users sign in to CommentVia with a Facebook account email.",
		required: true,
	},
	{
		name: "public_profile",
		reason: "Let users sign in with their Facebook profile name and avatar.",
		required: true,
	},
] as const;

export const requiredMetaPermissions = metaConnectionPermissions;

export const getPublicOrigins = () => {
	const apiUrl = trimTrailingSlash(process.env.API_ORIGIN ?? localApiBaseUrl);
	const appUrl = trimTrailingSlash(process.env.APP_ORIGIN ?? localAppBaseUrl);
	const websiteUrl = trimTrailingSlash(
		process.env.WEBSITE_ORIGIN ?? localWebsiteBaseUrl,
	);

	return {
		apiUrl,
		appUrl,
		websiteUrl,
		dataDeletionUrl: `${websiteUrl}/data-deletion`,
		privacyUrl: `${websiteUrl}/privacy`,
		termsUrl: `${websiteUrl}/terms`,
	};
};

export const getMetaConfig = (): MetaConfig => ({
	appId: process.env.META_APP_ID ?? process.env.FACEBOOK_CLIENT_ID ?? "",
	appSecret:
		process.env.META_APP_SECRET ?? process.env.FACEBOOK_CLIENT_SECRET ?? "",
	graphApiVersion: process.env.META_GRAPH_API_VERSION ?? "v24.0",
	pageAccessToken: process.env.META_PAGE_ACCESS_TOKEN ?? "",
	verifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN ?? "commentvia-local",
});

export const verifyWebhookChallenge = (
	requestUrl: URL,
	config = getMetaConfig(),
) => {
	const mode = requestUrl.searchParams.get("hub.mode");
	const token = requestUrl.searchParams.get("hub.verify_token");
	const challenge = requestUrl.searchParams.get("hub.challenge");

	if (mode === "subscribe" && token === config.verifyToken && challenge) {
		return new Response(challenge, { status: 200 });
	}

	return new Response("Webhook verification failed", { status: 403 });
};

export const createMetaConnectionPayload = () => {
	const config = getMetaConfig();
	const { apiUrl, dataDeletionUrl } = getPublicOrigins();
	const redirectUri =
		process.env.META_REDIRECT_URI ?? `${apiUrl}/meta/oauth/callback`;
	const state = crypto.randomUUID();
	const permissions = [...metaConnectionPermissions];

	if (!config.appId) {
		return {
			configured: false,
			provider: "meta" as const,
			redirectUri,
			state,
			permissions,
			dataDeletionUrl,
		};
	}

	const authorizationUrl = new URL(
		`https://www.facebook.com/${config.graphApiVersion}/dialog/oauth`,
	);
	authorizationUrl.searchParams.set("client_id", config.appId);
	authorizationUrl.searchParams.set("redirect_uri", redirectUri);
	authorizationUrl.searchParams.set(
		"scope",
		permissions.map((permission) => permission.name).join(","),
	);
	authorizationUrl.searchParams.set("state", state);
	authorizationUrl.searchParams.set("response_type", "code");

	return {
		configured: true,
		provider: "meta" as const,
		authorizationUrl: authorizationUrl.toString(),
		redirectUri,
		state,
		permissions,
		dataDeletionUrl,
	};
};

const decodeBase64Url = (value: string) => {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(
		normalized.length + ((4 - (normalized.length % 4)) % 4),
		"=",
	);

	return Buffer.from(padded, "base64");
};

const verifySignedRequest = async (
	signedRequest: string,
	appSecret: string,
) => {
	const [encodedSignature, encodedPayload] = signedRequest.split(".");

	if (!(encodedSignature && encodedPayload && appSecret)) {
		return undefined;
	}

	const signature = decodeBase64Url(encodedSignature);
	const expected = Buffer.from(
		await crypto.subtle.sign(
			"HMAC",
			await crypto.subtle.importKey(
				"raw",
				new TextEncoder().encode(appSecret),
				{ hash: "SHA-256", name: "HMAC" },
				false,
				["sign"],
			),
			new TextEncoder().encode(encodedPayload),
		),
	);

	if (
		signature.length !== expected.length ||
		!timingSafeEqual(signature, expected)
	) {
		return undefined;
	}

	return JSON.parse(decodeBase64Url(encodedPayload).toString("utf8")) as {
		user_id?: string;
		algorithm?: string;
	};
};

export const handleMetaDataDeletion = async (request: Request) => {
	const config = getMetaConfig();
	const { dataDeletionUrl } = getPublicOrigins();
	let signedRequest = "";

	if (request.method === "POST") {
		const contentType = request.headers.get("Content-Type") ?? "";
		if (contentType.includes("application/json")) {
			const body = (await request.json()) as { signed_request?: string };
			signedRequest = body.signed_request ?? "";
		} else {
			const form = await request.formData();
			signedRequest = String(form.get("signed_request") ?? "");
		}
	}

	const payload = await verifySignedRequest(signedRequest, config.appSecret);
	const confirmationCode = `meta-delete-${payload?.user_id ?? crypto.randomUUID()}`;

	return {
		confirmation_code: confirmationCode,
		url: `${dataDeletionUrl}?code=${encodeURIComponent(confirmationCode)}`,
	};
};

export const sendPrivateReply = async (
	commentId: string,
	message: string,
	config = getMetaConfig(),
): Promise<PrivateReplyResult> => {
	if (!config.pageAccessToken) {
		return {
			commentId,
			status: "skipped",
			reason: "META_PAGE_ACCESS_TOKEN is not configured. Local demo mode only.",
		};
	}

	const url = new URL(
		`https://graph.facebook.com/${config.graphApiVersion}/${commentId}/private_replies`,
	);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			access_token: config.pageAccessToken,
			message,
		}),
	});

	const payload = (await response.json()) as {
		id?: string;
		error?: { message?: string };
	};

	if (!response.ok) {
		return {
			commentId,
			status: "failed",
			reason: payload.error?.message ?? "Meta private reply failed.",
		};
	}

	return {
		commentId,
		messageId: payload.id,
		status: "sent",
	};
};

export const handleCommentAutomation = async (
	rules: KeywordRule[],
	event: InstagramCommentEvent,
) => {
	const match = findMatchingRule(rules, event);

	if (!match) {
		return {
			status: "skipped" as const,
			reason: "No enabled keyword rule matched this comment.",
		};
	}

	const result = await sendPrivateReply(event.commentId, match.rule.dmMessage);

	return {
		status: result.status,
		result,
		ruleId: match.rule.id,
	};
};
