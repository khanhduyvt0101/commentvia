import { getDefaultAppBaseUrl, trimTrailingSlash } from "@commentvia/util";

export const createCommentViaUrls = (appBaseUrl = getDefaultAppBaseUrl()) => {
	const baseUrl = trimTrailingSlash(appBaseUrl);

	return {
		app: baseUrl,
		signIn: `${baseUrl}/auth/sign-in`,
		signUp: `${baseUrl}/auth/sign-up`,
	};
};

export const commentViaUrls = createCommentViaUrls();
