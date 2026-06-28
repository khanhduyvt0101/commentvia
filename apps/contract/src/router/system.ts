import { oc } from "@orpc/contract";
import { z } from "zod";

export const healthPayloadSchema = z.object({
	ok: z.boolean(),
	service: z.string(),
	now: z.string(),
});

export const health = oc
	.route({
		method: "GET",
		path: "/health",
		summary: "Check CommentVia API health",
		tags: ["System"],
	})
	.output(healthPayloadSchema);
