import {
	assertDockerReady,
	formatError,
	getComposePort,
	workspaceRoot,
} from "./local-utils";

const postgresService = "postgres";
const postgresContainer = "commentvia-postgres";
const postgresContainerPort = 5432;

async function ensurePostgresDatabase() {
	const readyAsCommentVia =
		await Bun.$`docker exec ${postgresContainer} psql -U commentvia -d commentvia -c "SELECT 1"`
			.quiet()
			.nothrow();
	if (readyAsCommentVia.exitCode === 0) {
		return;
	}

	const readyAsPostgres =
		await Bun.$`docker exec ${postgresContainer} psql -U postgres -d postgres -c "SELECT 1"`
			.quiet()
			.nothrow();
	if (readyAsPostgres.exitCode !== 0) {
		throw new Error(
			"Postgres is running, but the expected `commentvia` role/database is missing and the `postgres` admin role is not available. Run `bun local-down` to remove the old local volume, then run `bun local-up` again.",
		);
	}

	console.log("[local-up] Creating missing commentvia database role");
	await Bun.$`docker exec ${postgresContainer} psql -U postgres -d postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'commentvia') THEN CREATE ROLE commentvia LOGIN PASSWORD 'commentvia'; END IF; END $$;"`.quiet();
	await Bun.$`docker exec ${postgresContainer} psql -U postgres -d postgres -c "SELECT 'CREATE DATABASE commentvia OWNER commentvia' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'commentvia')\\gexec"`.quiet();
	await Bun.$`docker exec ${postgresContainer} psql -U postgres -d postgres -c "ALTER DATABASE commentvia OWNER TO commentvia;"`.quiet();
}

try {
	console.log("[local-up] Checking Docker");
	await assertDockerReady();

	console.log("[local-up] Starting Docker services");
	await Bun.$`docker compose up -d --wait`.cwd(workspaceRoot).quiet();

	const pgPort = await getComposePort(postgresService, postgresContainerPort);
	const databaseUrl = `postgres://commentvia:commentvia@localhost:${pgPort}/commentvia`;

	console.log(`[local-up] Postgres ready on localhost:${pgPort}`);
	await ensurePostgresDatabase();
	console.log("[local-up] Running Better Auth migrations");
	await Bun.$`bun --filter @commentvia/api db:migrate`.cwd(workspaceRoot).env({
		...process.env,
		DATABASE_URL: databaseUrl,
	});

	console.log("");
	console.log("[local-up] Local dependencies are ready");
	console.log(`  DATABASE_URL=${databaseUrl}`);
	console.log("  API: bun dev:api      (http://localhost:41412)");
	console.log("  SPA: bun dev:spa      (http://localhost:41411)");
	console.log("  Web: bun dev:website  (http://localhost:41410)");
	console.log("  Teardown: bun local-down");
} catch (error) {
	console.error(`[local-up] Failed: ${formatError(error)}`);
	process.exit(1);
}
