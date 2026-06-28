import { dashboard } from "./dashboard";
import { metaConnection, platformReadiness } from "./platform";
import { rules } from "./rules";
import { health } from "./system";

export const router = {
	dashboard,
	health,
	metaConnection,
	platformReadiness,
	rules,
} as const;

export type AppRouter = typeof router;
