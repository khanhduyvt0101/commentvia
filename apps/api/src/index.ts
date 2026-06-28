import {
	instagramCommentEventSchema,
	keywordRuleSchema,
	localAppBaseUrl,
	localWebsiteBaseUrl,
} from "@commentvia/util";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { auth } from "./auth";
import { prepareDatabase } from "./db/migrations";
import {
	getPublicOrigins,
	handleCommentAutomation,
	handleMetaDataDeletion,
	requiredMetaPermissions,
	verifyWebhookChallenge,
} from "./meta";
import { router } from "./router/index";

const demoRules = [
	keywordRuleSchema.parse({
		id: "rule_outfit",
		postUrl: "https://www.instagram.com/p/demo/",
		keyword: "outfit",
		dmLink: "https://shop.example.com/outfit",
		dmMessage:
			"Cam on ban nha. Link outfit minh gui day: https://shop.example.com/outfit",
		publicReply: "Minh vua gui link qua inbox nha.",
		enabled: true,
		createdAt: new Date().toISOString(),
	}),
];

const json = (payload: unknown, status = 200) =>
	new Response(JSON.stringify(payload, null, 2), {
		status,
		headers: { "Content-Type": "application/json" },
	});

const appOrigin = process.env.APP_ORIGIN ?? localAppBaseUrl;
const websiteOrigin = process.env.WEBSITE_ORIGIN ?? localWebsiteBaseUrl;
const allowedBrowserOrigins = new Set([appOrigin, websiteOrigin]);

const getCorsHeaders = (request: Request) => {
	const origin = request.headers.get("Origin");
	const requestHeaders =
		request.headers.get("Access-Control-Request-Headers") ??
		"content-type, authorization";

	if (!origin || !allowedBrowserOrigins.has(origin)) {
		return new Headers();
	}

	return new Headers({
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Headers": requestHeaders,
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Origin": origin,
		Vary: "Origin",
	});
};

const withCors = (response: Response, request: Request) => {
	const headers = new Headers(response.headers);
	getCorsHeaders(request).forEach((value, key) => {
		headers.set(key, value);
	});

	return new Response(response.body, {
		headers,
		status: response.status,
		statusText: response.statusText,
	});
};

const rpcHandler = new RPCHandler(router, {
	plugins: [
		new CORSPlugin({
			allowHeaders: ["content-type", "authorization"],
			allowMethods: ["GET", "POST", "OPTIONS"],
			credentials: true,
			origin: appOrigin,
		}),
	],
});

try {
	await prepareDatabase();
	console.log("Database schema is ready.");
} catch (error) {
	console.warn(
		"Database setup was skipped. Start Postgres with `docker compose up -d postgres`, run `bun --filter @commentvia/api db:migrate`, and restart the API.",
	);
	console.warn(error);
}

const server = Bun.serve({
	port: Number(process.env.PORT ?? 41412),
	async fetch(request) {
		const url = new URL(request.url);

		if (url.pathname.startsWith("/api/auth")) {
			if (request.method === "OPTIONS") {
				return new Response(null, {
					headers: getCorsHeaders(request),
					status: 204,
				});
			}

			return withCors(await auth.handler(request), request);
		}

		const { matched, response } = await rpcHandler.handle(request, {
			context: {},
			prefix: "/rpc",
		});

		if (matched) {
			return response;
		}

		if (url.pathname === "/health") {
			return json({ ok: true, service: "commentvia-api" });
		}

		if (url.pathname === "/meta/requirements") {
			const origins = getPublicOrigins();

			return json({
				productionNeedsMetaReview: true,
				permissions: requiredMetaPermissions,
				accountType:
					"Instagram Creator or Business account connected to a Facebook Page",
				dataDeletionUrl: origins.dataDeletionUrl,
				oAuthCallbackUrl: `${url.origin}/meta/oauth/callback`,
			});
		}

		if (url.pathname === "/meta/oauth/callback") {
			return Response.redirect(`${appOrigin}/connections?provider=meta`, 302);
		}

		if (url.pathname === "/meta/data-deletion") {
			return json(await handleMetaDataDeletion(request));
		}

		if (url.pathname === "/webhooks/instagram" && request.method === "GET") {
			return verifyWebhookChallenge(url);
		}

		if (
			url.pathname === "/webhooks/instagram/test" &&
			request.method === "POST"
		) {
			const event = instagramCommentEventSchema.parse(await request.json());
			return json(await handleCommentAutomation(demoRules, event));
		}

		return json({ error: "Not found" }, 404);
	},
});

console.log(`CommentVia API running on http://localhost:${server.port}`);
