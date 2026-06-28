import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { LinksFunction, MetaFunction } from "react-router";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import "./app.css";
import "./i18n";
import { getResolvedLanguage, languageDirections } from "./i18n";

export const meta: MetaFunction = () => [
	{ title: "CommentVia App" },
	{
		name: "description",
		content:
			"Creator dashboard for Instagram comment automation, DM links, and rule analytics.",
	},
];

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	const language = getResolvedLanguage();

	return (
		<html
			dir={languageDirections[language]}
			lang={language}
			suppressHydrationWarning
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function Root() {
	const { i18n } = useTranslation();

	useEffect(() => {
		const language = getResolvedLanguage();
		document.documentElement.lang = language;
		document.documentElement.dir = languageDirections[language];
	}, [i18n.language, i18n.resolvedLanguage]);

	return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
	let title = "Something went wrong";
	let message = "The app hit an unexpected state.";

	if (isRouteErrorResponse(error)) {
		title = `${error.status} ${error.statusText}`;
		message = String(error.data ?? title);
	} else if (error instanceof Error) {
		message = error.message;
	}

	return (
		<main className="grid min-h-screen place-items-center bg-background px-6">
			<div className="max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
				<h1 className="font-heading text-2xl font-semibold">{title}</h1>
				<p className="mt-2 text-sm text-muted-foreground">{message}</p>
			</div>
		</main>
	);
}
