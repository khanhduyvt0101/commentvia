import { getDefaultApiBaseUrl } from "@commentvia/util";
import { createAuthClient } from "better-auth/react";

export type CreateCommentViaAuthClientOptions = {
	apiBaseUrl?: string;
};

export const createCommentViaAuthClient = (
	options: CreateCommentViaAuthClientOptions = {},
) =>
	createAuthClient({
		basePath: "/api/auth",
		baseURL: options.apiBaseUrl ?? getDefaultApiBaseUrl(),
	});

export const authClient = createCommentViaAuthClient();
