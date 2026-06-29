import { getDefaultApiBaseUrl, getDefaultAppBaseUrl } from "@commentvia/util";
import "../root-env";

export const databaseUrl =
	process.env.DATABASE_URL ??
	"postgres://commentvia:commentvia@localhost:55432/commentvia";

export const apiOrigin = getDefaultApiBaseUrl();
export const appOrigin = getDefaultAppBaseUrl();
