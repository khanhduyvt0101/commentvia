export const workspaceRoot = new URL("..", import.meta.url).pathname;

export function formatError(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

export async function commandExists(command: string): Promise<boolean> {
	const result = await Bun.$`which ${command}`.quiet().nothrow();
	return result.exitCode === 0;
}

export async function assertDockerReady() {
	if (!(await commandExists("docker"))) {
		throw new Error(
			"Missing prerequisite: Docker CLI is not installed. Install Docker Desktop and run `bun local-up` again.",
		);
	}

	const info = await Bun.$`docker info`.quiet().nothrow();
	if (info.exitCode !== 0) {
		throw new Error(
			"Docker is installed but not running. Start Docker Desktop, then run `bun local-up` again.",
		);
	}
}

export async function getComposePort(
	serviceName: string,
	containerPort: number,
): Promise<number> {
	const output =
		await Bun.$`docker compose port ${serviceName} ${containerPort}`.text();
	const port = Number.parseInt(output.trim().split(":").pop() ?? "", 10);
	if (!Number.isInteger(port)) {
		throw new Error(
			`Could not resolve Docker Compose port for ${serviceName}:${containerPort}.`,
		);
	}
	return port;
}

export async function bestEffort(
	label: string,
	action: () => Promise<unknown>,
) {
	console.log(`[local-down] ${label}`);
	try {
		await action();
	} catch (error) {
		console.warn(`[local-down] Skipped ${label}: ${formatError(error)}`);
	}
}
