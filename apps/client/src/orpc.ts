import type { contract } from "@commentvia/contract";
import { getDefaultApiBaseUrl, trimTrailingSlash } from "@commentvia/util";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";

export type CommentViaRpcClient = ContractRouterClient<typeof contract>;

export type CreateCommentViaRpcClientOptions = {
	apiBaseUrl?: string;
	credentials?: RequestCredentials;
	fetch?: typeof fetch;
};

export const createCommentViaRpcClient = (
	options: CreateCommentViaRpcClientOptions = {},
): CommentViaRpcClient => {
	const apiBaseUrl = trimTrailingSlash(
		options.apiBaseUrl ?? getDefaultApiBaseUrl(),
	);
	const requestFetch = options.fetch ?? fetch;
	const credentials = options.credentials ?? "include";
	const link = new RPCLink({
		fetch: (request, init) =>
			requestFetch(request, {
				...init,
				credentials,
			}),
		url: `${apiBaseUrl}/rpc`,
	});

	return createORPCClient(link);
};

export const orpc = createCommentViaRpcClient();
