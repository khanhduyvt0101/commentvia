import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseUrl } from "./env";
import * as schema from "./schema";

export const pgPool = new Pool({
	connectionString: databaseUrl,
	max: Number(process.env.DATABASE_POOL_MAX ?? 8),
});

export const db = drizzle(pgPool, { schema });

export type Database = typeof db;
