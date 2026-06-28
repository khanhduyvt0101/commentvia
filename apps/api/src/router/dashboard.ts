import { getDashboardPayload } from "../db/queries";
import { procedure } from "../orpc";

export const dashboard = procedure.dashboard.handler(({ input }) =>
	getDashboardPayload(input?.range ?? "30d"),
);
