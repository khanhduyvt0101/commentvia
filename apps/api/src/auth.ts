import { isLive } from "@commentvia/util";
import { APIError, type BetterAuthOptions, betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { pgPool } from "./db/client";
import { apiOrigin, appOrigin } from "./db/env";
import { facebookLoginPermissions } from "./meta";

const allowedProductionSignupEmails = new Set(["khanhduyvt0101@gmail.com"]);

const normalizeEmail = (email: string) => email.trim().toLocaleLowerCase();

const assertCanCreateAccount = (email: string) => {
	if (!isLive) {
		return;
	}

	if (allowedProductionSignupEmails.has(normalizeEmail(email))) {
		return;
	}

	throw new APIError("FORBIDDEN", {
		message: "CommentVia is invite-only right now.",
	});
};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const facebookClientId =
	process.env.FACEBOOK_CLIENT_ID ?? process.env.META_APP_ID;
const facebookClientSecret =
	process.env.FACEBOOK_CLIENT_SECRET ?? process.env.META_APP_SECRET;

const socialProviders = {
	...(googleClientId && googleClientSecret
		? {
				google: {
					accessType: "online",
					clientId: googleClientId,
					clientSecret: googleClientSecret,
					prompt: "select_account",
					scope: ["openid", "email", "profile"],
				},
			}
		: {}),
	...(facebookClientId && facebookClientSecret
		? {
				facebook: {
					clientId: facebookClientId,
					clientSecret: facebookClientSecret,
					fields: ["id", "name", "email", "picture"],
					scope: facebookLoginPermissions.map((permission) => permission.name),
				},
			}
		: {}),
} satisfies BetterAuthOptions["socialProviders"];

export const authOptions = {
	appName: "CommentVia",
	baseURL: apiOrigin,
	basePath: "/api/auth",
	database: pgPool,
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					assertCanCreateAccount(user.email);
				},
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	socialProviders,
	trustedOrigins: [appOrigin, apiOrigin],
	advanced: {
		cookiePrefix: "commentvia",
		useSecureCookies: process.env.NODE_ENV === "production",
	},
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);

export const runAuthMigrations = async () => {
	const migrations = await getMigrations(authOptions);
	if (
		migrations.toBeCreated.length === 0 &&
		migrations.toBeAdded.length === 0
	) {
		return;
	}

	await migrations.runMigrations();
};
