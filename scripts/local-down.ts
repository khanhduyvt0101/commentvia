import { assertDockerReady, bestEffort, workspaceRoot } from "./local-utils";

const keepData = process.argv.includes("--keep-data");

await bestEffort("Checking Docker", assertDockerReady);

await bestEffort(
	keepData
		? "Stopping Docker services and keeping volumes"
		: "Stopping Docker services and deleting volumes",
	() =>
		keepData
			? Bun.$`docker compose down --remove-orphans`.cwd(workspaceRoot).quiet()
			: Bun.$`docker compose down -v --remove-orphans`
					.cwd(workspaceRoot)
					.quiet(),
);

console.log(
	keepData
		? "[local-down] Done. Docker volumes were kept."
		: "[local-down] Done. Docker volumes were removed.",
);
