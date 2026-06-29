import {
	getDefaultApiBaseUrl,
	getDefaultAppBaseUrl,
	getDefaultWebsiteBaseUrl,
	trimTrailingSlash,
} from "@commentvia/util";
import {
	createMetaConnectionPayload,
	getMetaConfig,
	getPublicOrigins,
	metaConnectionPermissions,
} from "../meta";
import { procedure } from "../orpc";

export const platformReadiness = procedure.platformReadiness.handler(() => {
	const origins = getPublicOrigins();
	const apiUrl = trimTrailingSlash(getDefaultApiBaseUrl());
	const appUrl = trimTrailingSlash(getDefaultAppBaseUrl());
	const websiteUrl = trimTrailingSlash(getDefaultWebsiteBaseUrl());
	const metaConfig = getMetaConfig();
	const googleEnabled = Boolean(
		process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
	);
	const facebookEnabled = Boolean(
		(process.env.FACEBOOK_CLIENT_ID ?? process.env.META_APP_ID) &&
			(process.env.FACEBOOK_CLIENT_SECRET ?? process.env.META_APP_SECRET),
	);

	return {
		appName: "CommentVia",
		supportEmail: process.env.SUPPORT_EMAIL ?? "khanhduyvt0101@gmail.com",
		websiteUrl,
		appUrl,
		apiUrl,
		privacyUrl: origins.privacyUrl,
		termsUrl: origins.termsUrl,
		dataDeletionUrl: origins.dataDeletionUrl,
		google: {
			enabled: googleEnabled,
			redirectUri: `${apiUrl}/api/auth/callback/google`,
			scopes: [
				{
					name: "openid",
					reason: "Authenticate the Google account with OpenID Connect.",
					required: true,
				},
				{
					name: "email",
					reason: "Create and match the CommentVia user account by email.",
					required: true,
				},
				{
					name: "profile",
					reason: "Display the user's name and avatar in the dashboard.",
					required: true,
				},
			],
			authorizedDomains: [new URL(websiteUrl).hostname],
			verificationChecklist: [
				"Use only openid, email, and profile for Google sign-in to avoid sensitive-scope verification.",
				"Configure OAuth consent screen homepage, privacy policy, and terms URLs on the same verified domain.",
				"Add the API callback URL to Google OAuth Authorized redirect URIs.",
				"Use the official Google sign-in brand treatment in the app.",
			],
		},
		meta: {
			enabled: facebookEnabled && Boolean(metaConfig.appId),
			graphApiVersion: metaConfig.graphApiVersion,
			authRedirectUri: `${apiUrl}/api/auth/callback/facebook`,
			connectionRedirectUri:
				process.env.META_REDIRECT_URI ?? `${apiUrl}/meta/oauth/callback`,
			requestedPermissions: [...metaConnectionPermissions],
			reviewChecklist: [
				"Request only the Instagram business permissions needed for comment matching and private replies.",
				"Keep Facebook Login scopes limited to email and public_profile for app sign-in.",
				"Provide reviewer credentials, screen recording, privacy policy, terms, and data deletion URL.",
				"Show a working tester flow with an Instagram professional account connected to a Facebook Page.",
				"Explain every requested permission in the App Review submission using the same wording shown in the app.",
			],
		},
	};
});

export const metaConnection = procedure.metaConnection.handler(() =>
	createMetaConnectionPayload(),
);
