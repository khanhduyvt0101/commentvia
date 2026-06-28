import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const rootEnvPath = path.resolve(import.meta.dirname, "../../..", ".env.local");

if (existsSync(rootEnvPath)) {
	const content = readFileSync(rootEnvPath, "utf8");

	for (const rawLine of content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) {
			continue;
		}

		const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
		if (!match) {
			continue;
		}

		const key = match[1];
		const rawValue = match[2] ?? "";
		if (!key) {
			continue;
		}

		if (process.env[key] !== undefined) {
			continue;
		}

		process.env[key] = rawValue
			.trim()
			.replace(/^['"]/, "")
			.replace(/['"]$/, "");
	}
}
