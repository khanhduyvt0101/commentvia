import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	layout("routes/app-layout.tsx", [
		index("routes/dashboard.tsx"),
		route("rules", "routes/rules.tsx"),
		route("analytics", "routes/analytics.tsx"),
		route("connections", "routes/connections.tsx"),
	]),
	route("auth/:view?", "routes/auth.tsx"),
] satisfies RouteConfig;
