import { oc } from "@orpc/contract";
import { z } from "zod";
import { dashboardRuleSchema } from "./dashboard";

export const rules = oc
	.route({
		method: "GET",
		path: "/rules",
		summary: "List automation rules",
		tags: ["Rules"],
	})
	.output(z.array(dashboardRuleSchema));
