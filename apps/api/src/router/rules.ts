import { listDashboardRules } from "../db/queries";
import { procedure } from "../orpc";

export const rules = procedure.rules.handler(() => listDashboardRules());
