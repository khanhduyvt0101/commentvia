import { databaseUrl, prepareDatabase } from "./db/migrations";

await prepareDatabase();

console.log(`Database schema is ready at ${databaseUrl}`);
