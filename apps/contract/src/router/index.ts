import { dashboard } from "./dashboard";
import { metaConnection, platformReadiness } from "./platform";
import { rules } from "./rules";
import { health } from "./system";

export const contract = {
	dashboard,
	health,
	metaConnection,
	platformReadiness,
	rules,
} as const;

export * from "./dashboard";
export * from "./platform";
export * from "./rules";
export * from "./system";
