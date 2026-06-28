import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const monorepoRoot = resolve(import.meta.dirname, "..");
const appsDir = resolve(monorepoRoot, "apps");
const apiRoot = resolve(appsDir, "api");
const packageJson = await Bun.file(`${apiRoot}/package.json`).json();

const imageId = "commentvia-api";
const serverDirName = "api";

async function findWorkspacePackageDir(packageName: string) {
	for await (const packagePath of new Bun.Glob("*/package.json").scan({
		cwd: appsDir,
		onlyFiles: true,
	})) {
		const candidate = await Bun.file(resolve(appsDir, packagePath)).json();
		if (candidate.name === packageName) {
			return resolve(appsDir, packagePath.replace("/package.json", ""));
		}
	}

	return undefined;
}

async function resolveWorkspaceDependencies(
	packageDir: string,
	visited = new Set<string>(),
) {
	const resolvedDir = resolve(packageDir);
	if (visited.has(resolvedDir)) {
		return visited;
	}

	visited.add(resolvedDir);

	const pkg = await Bun.file(`${resolvedDir}/package.json`).json();
	const dependencies = { ...pkg.dependencies, ...pkg.peerDependencies };

	for (const [name, version] of Object.entries(dependencies)) {
		if (typeof version !== "string" || !version.startsWith("workspace:")) {
			continue;
		}

		const dependencyDir = await findWorkspacePackageDir(name);
		if (dependencyDir) {
			await resolveWorkspaceDependencies(dependencyDir, visited);
		}
	}

	return visited;
}

const workspaceDependencyDirs = await resolveWorkspaceDependencies(apiRoot);
const workspacePackageDirs = [...workspaceDependencyDirs]
	.map((dir) => dir.replace(`${monorepoRoot}/`, ""))
	.sort();

await rm(`${apiRoot}/dist`, { force: true, recursive: true });
await mkdir(`${apiRoot}/dist/docker/installer`, { recursive: true });
await mkdir(`${apiRoot}/dist/docker/runner`, { recursive: true });

const rootPackageJson = await Bun.file(`${monorepoRoot}/package.json`).json();
await Bun.write(
	`${apiRoot}/dist/docker/installer/package.json`,
	`${JSON.stringify(
		{
			private: true,
			type: rootPackageJson.type,
			version: "0.0.0",
			workspaces: workspacePackageDirs,
		},
		null,
		"\t",
	)}\n`,
);

for (const packageDir of workspacePackageDirs) {
	await mkdir(`${apiRoot}/dist/docker/installer/${packageDir}`, {
		recursive: true,
	});

	const pkg = await Bun.file(
		`${monorepoRoot}/${packageDir}/package.json`,
	).json();
	const { devDependencies, scripts, ...installPackageJson } = pkg;
	await Bun.write(
		`${apiRoot}/dist/docker/installer/${packageDir}/package.json`,
		`${JSON.stringify(
			{ ...installPackageJson, version: "0.0.0" },
			null,
			"\t",
		)}\n`,
	);
}

await Bun.$`cp ${monorepoRoot}/bun.lock ${apiRoot}/dist/docker/installer/bun.lock`;
await Bun.$`bun install --lockfile-only`.cwd(
	`${apiRoot}/dist/docker/installer`,
);

await Bun.$`cp ${monorepoRoot}/tsconfig.base.json ${apiRoot}/dist/docker/runner/tsconfig.base.json`;
await Bun.$`cp ${monorepoRoot}/tsconfig.json ${apiRoot}/dist/docker/runner/tsconfig.json`;

for (const packageDir of workspacePackageDirs) {
	await mkdir(`${apiRoot}/dist/docker/runner/${packageDir}`, {
		recursive: true,
	});

	await Bun.$`cp ${monorepoRoot}/${packageDir}/package.json ${apiRoot}/dist/docker/runner/${packageDir}/package.json`;

	const tsconfigPath = `${monorepoRoot}/${packageDir}/tsconfig.json`;
	if (existsSync(tsconfigPath)) {
		await Bun.$`cp ${tsconfigPath} ${apiRoot}/dist/docker/runner/${packageDir}/tsconfig.json`;
	}

	const srcPath = `${monorepoRoot}/${packageDir}/src`;
	if (existsSync(srcPath)) {
		await Bun.$`cp -r ${srcPath} ${apiRoot}/dist/docker/runner/${packageDir}/src`;
	}

	const drizzlePath = `${monorepoRoot}/${packageDir}/drizzle`;
	if (existsSync(drizzlePath)) {
		await Bun.$`cp -r ${drizzlePath} ${apiRoot}/dist/docker/runner/${packageDir}/drizzle`;
	}

	const drizzleConfigPath = `${monorepoRoot}/${packageDir}/drizzle.config.ts`;
	if (existsSync(drizzleConfigPath)) {
		await Bun.$`cp ${drizzleConfigPath} ${apiRoot}/dist/docker/runner/${packageDir}/drizzle.config.ts`;
	}
}

await Bun.write(
	`${apiRoot}/dist/docker/Dockerfile`,
	`FROM oven/bun:1-slim

ENV NODE_ENV=production

RUN apt-get update \\
  && apt-get install -y --no-install-recommends curl ca-certificates \\
  && apt-get clean \\
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY --chown=bun:bun installer/ .
RUN bun install --frozen-lockfile --production && bun pm cache rm

COPY --chown=bun:bun runner/ .

USER bun
WORKDIR /workspace/apps/${serverDirName}
EXPOSE 41412
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD curl -f http://localhost:\${PORT:-41412}/health || exit 1
CMD ["bun", "src/index.ts"]
`,
);

await Bun.$`tar -czf ${apiRoot}/dist/${imageId}_${packageJson.version}_docker.tar.gz -C ${apiRoot}/dist docker`;
await rm(`${apiRoot}/dist/docker`, { force: true, recursive: true });

if (process.env.GITHUB_OUTPUT) {
	const { appendFile } = await import("node:fs/promises");
	await appendFile(
		process.env.GITHUB_OUTPUT,
		`name=${imageId}\nversion=${packageJson.version}\n`,
		"utf8",
	);
}

console.log(
	`Docker context: apps/api/dist/${imageId}_${packageJson.version}_docker.tar.gz`,
);
