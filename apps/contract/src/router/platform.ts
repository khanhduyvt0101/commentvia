import { oc } from "@orpc/contract";
import { z } from "zod";

export const platformScopeSchema = z.object({
	name: z.string(),
	reason: z.string(),
	required: z.boolean(),
});

export const platformReadinessSchema = z.object({
	appName: z.string(),
	supportEmail: z.string().email(),
	websiteUrl: z.string().url(),
	appUrl: z.string().url(),
	apiUrl: z.string().url(),
	privacyUrl: z.string().url(),
	termsUrl: z.string().url(),
	dataDeletionUrl: z.string().url(),
	google: z.object({
		enabled: z.boolean(),
		redirectUri: z.string().url(),
		scopes: z.array(platformScopeSchema),
		authorizedDomains: z.array(z.string()),
		verificationChecklist: z.array(z.string()),
	}),
	meta: z.object({
		enabled: z.boolean(),
		graphApiVersion: z.string(),
		authRedirectUri: z.string().url(),
		connectionRedirectUri: z.string().url(),
		requestedPermissions: z.array(platformScopeSchema),
		reviewChecklist: z.array(z.string()),
	}),
});

export const metaConnectionPayloadSchema = z.object({
	configured: z.boolean(),
	provider: z.literal("meta"),
	authorizationUrl: z.string().url().optional(),
	redirectUri: z.string().url(),
	state: z.string(),
	permissions: z.array(platformScopeSchema),
	dataDeletionUrl: z.string().url(),
});

export const platformReadiness = oc
	.route({
		method: "GET",
		path: "/platform-readiness",
		summary: "Read OAuth and platform review readiness metadata",
		tags: ["Platform"],
	})
	.output(platformReadinessSchema);

export const metaConnection = oc
	.route({
		method: "POST",
		path: "/integrations/meta/connect",
		summary: "Create the Meta account connection authorization URL",
		tags: ["Platform"],
	})
	.output(metaConnectionPayloadSchema);

export type PlatformReadiness = z.infer<typeof platformReadinessSchema>;
