import { procedure } from "../orpc";

export const health = procedure.health.handler(() => ({
	ok: true,
	service: "commentvia-api",
	now: new Date().toISOString(),
}));
