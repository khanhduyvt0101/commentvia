const devOriginPattern = /https?:\/\/localhost:4141[0-2]|localhost:4141[0-2]/;

type FetchedAsset = {
	url: string;
	body: string;
};

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

async function fetchText(url: string) {
	const response = await fetch(url, {
		headers: {
			"user-agent": "CommentVia release verification",
		},
	});
	const body = await response.text();

	assert(
		response.ok,
		`${url} returned ${response.status} ${response.statusText}: ${body.slice(
			0,
			160,
		)}`,
	);

	return body;
}

function assetPaths(html: string) {
	return [
		...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g),
		...html.matchAll(/["'`](\/assets\/[^"'`]+?\.(?:js|css))["'`]/g),
	].map((match) => match[1]);
}

async function fetchAssets(origin: string, html: string) {
	const pending = [...new Set(assetPaths(html))];
	const seen = new Set<string>();

	const assets: FetchedAsset[] = [];
	while (pending.length > 0) {
		const path = pending.shift();
		if (!path || seen.has(path)) {
			continue;
		}

		seen.add(path);
		const url = `${origin}${path}`;
		const body = await fetchText(url);
		assets.push({ url, body });

		for (const childPath of assetPaths(body)) {
			if (!seen.has(childPath)) {
				pending.push(childPath);
			}
		}
	}

	assert(assets.length > 0, `${origin} did not expose any JS/CSS assets`);

	return assets;
}

function assertNoDevOrigins(label: string, text: string) {
	assert(
		!devOriginPattern.test(text),
		`${label} contains a development origin`,
	);
}

async function verifyWebsite() {
	const origin = "https://commentvia.com";
	const html = await fetchText(`${origin}/en/`);
	assertNoDevOrigins("Website HTML", html);
	assert(
		/<script[^>]+type="module"[^>]+src="\/assets\/[^"]+\.js"/.test(html),
		"Website HTML is missing its module script",
	);
	assert(
		/<link[^>]+rel="stylesheet"[^>]+href="\/assets\/[^"]+\.css"/.test(html),
		"Website HTML is missing its stylesheet",
	);

	const assets = await fetchAssets(origin, html);
	const combined = assets.map((asset) => asset.body).join("\n");
	assertNoDevOrigins("Website assets", combined);
	assert(
		combined.includes("https://app.commentvia.com"),
		"Website assets do not point at the production app domain",
	);
	console.log(`[verify-prod-domains] Website OK (${assets.length} assets).`);
}

async function verifyApp() {
	const origin = "https://app.commentvia.com";
	const html = await fetchText(`${origin}/`);
	assertNoDevOrigins("SPA HTML", html);
	assert(
		html.includes("entry.client-"),
		"SPA HTML is missing the React Router client entry",
	);

	const assets = await fetchAssets(origin, html);
	const combined = assets.map((asset) => asset.body).join("\n");
	assertNoDevOrigins("SPA assets", combined);
	assert(
		combined.includes("https://api.commentvia.com"),
		"SPA assets do not point at the production API domain",
	);
	console.log(`[verify-prod-domains] SPA OK (${assets.length} assets).`);
}

async function verifyApi() {
	const body = await fetchText("https://api.commentvia.com/health");
	const health = JSON.parse(body) as { ok?: boolean; service?: string };
	assert(health.ok === true, "API health response did not include ok=true");
	assert(
		health.service === "commentvia-api",
		"API health response did not identify commentvia-api",
	);
	console.log("[verify-prod-domains] API OK.");
}

await verifyWebsite();
await verifyApp();
await verifyApi();
