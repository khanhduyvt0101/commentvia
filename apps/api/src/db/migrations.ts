import { migrate } from "drizzle-orm/node-postgres/migrator";
import { runAuthMigrations } from "../auth";
import { db } from "./client";
import { databaseUrl } from "./env";
import { seedDemoData } from "./seed";

export const migrationsFolder = new URL("../../drizzle", import.meta.url)
	.pathname;

export async function prepareDatabase() {
	await runAuthMigrations();
	await migrate(db, { migrationsFolder });
	await seedDemoData();
}

export { databaseUrl };
