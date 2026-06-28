import { localApiBaseUrl, localAppBaseUrl } from "@commentvia/util";
import "../root-env";

export const databaseUrl =
	process.env.DATABASE_URL ??
	"postgres://commentvia:commentvia@localhost:55432/commentvia";

export const apiOrigin = process.env.API_ORIGIN ?? localApiBaseUrl;
export const appOrigin = process.env.APP_ORIGIN ?? localAppBaseUrl;
