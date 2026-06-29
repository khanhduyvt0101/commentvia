import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import {
	productionApiBaseUrl,
	productionAppBaseUrl,
} from "../apps/util/src/index";

const workspaceRoot = new URL("..", import.meta.url).pathname;
const websiteDist = join(workspaceRoot, "apps/website/dist");
const appClientDist = join(workspaceRoot, "apps/spa/build/client");
const devOriginPattern = /https?:\/\/localhost:4141[0-2]|localhost:4141[0-2]/;
const args = new Set(process.argv.slice(2));
const verifyWebsite = args.size === 0 || args.has("--website");
const verifyApp = args.size === 0 || args.has("--app");
const requireProdUrls = process.env.REQUIRE_PROD_URLS === "true";

async function listFiles(dir: string): Promise<string[]> {
	const entries = await readdir(dir);
	const files = await Promise.all(
		entries.map(async (entry) => {
			const path = join(dir, entry);
			const details = await stat(path);
			return details.isDirectory() ? listFiles(path) : [path];
		}),
	);

	return files.flat();
}

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

function relativePath(path: string) {
	return relative(workspaceRoot, path);
}

async function readText(path: string) {
	return readFile(path, "utf8");
}

async function assertNoDevOrigins(dir: string) {
	const files = (await listFiles(dir)).filter((file) =>
		/\.(html|js|css|json|txt|xml)$/.test(file),
	);

	for (const file of files) {
		const text = await readText(file);
		assert(
			!devOriginPattern.test(text),
			`${relativePath(file)} contains a localhost development origin`,
		);
	}
}

async function verifyWebsiteBuild() {
	const files = await listFiles(websiteDist);
	const htmlFiles = files.filter((file) => file.endsWith(".html"));
	assert(htmlFiles.length > 0, "Website build did not produce HTML files");

	for (const file of htmlFiles) {
		const text = await readText(file);
		assert(
			/<script[^>]+type="module"[^>]+src="\/assets\/[^"]+\.js"/.test(text),
			`${relativePath(file)} is missing the Vite module script`,
		);
		assert(
			/<link[^>]+rel="stylesheet"[^>]+href="\/assets\/[^"]+\.css"/.test(text),
			`${relativePath(file)} is missing the Vite stylesheet`,
		);
	}

	await assertNoDevOrigins(websiteDist);

	if (requireProdUrls) {
		const bundleText = (
			await Promise.all(
				files
					.filter((file) => /\.(html|js)$/.test(file))
					.map((file) => readText(file)),
			)
		).join("\n");
		assert(
			bundleText.includes(productionAppBaseUrl),
			"Website build does not include the production app URL",
		);
	}
}

async function verifyAppBuild() {
	const indexPath = join(appClientDist, "index.html");
	const indexHtml = await readText(indexPath);
	assert(
		/<script[^>]+type="module"[\s\S]*entry\.client-[^"]+\.js/.test(indexHtml),
		"SPA build is missing the React Router client entry script",
	);
	assert(
		/<link[^>]+rel="stylesheet"[^>]+href="\/assets\/[^"]+\.css"/.test(
			indexHtml,
		),
		"SPA build is missing the stylesheet",
	);

	const files = await listFiles(appClientDist);
	await assertNoDevOrigins(appClientDist);

	if (requireProdUrls) {
		const bundleText = (
			await Promise.all(
				files
					.filter((file) => /\.(html|js)$/.test(file))
					.map((file) => readText(file)),
			)
		).join("\n");
		assert(
			bundleText.includes(productionApiBaseUrl),
			"SPA build does not include the production API URL",
		);
	}
}

if (verifyWebsite) {
	await verifyWebsiteBuild();
	console.log("[verify-prod-build] Website build is safe for production.");
}

if (verifyApp) {
	await verifyAppBuild();
	console.log("[verify-prod-build] SPA build is safe for production.");
}
