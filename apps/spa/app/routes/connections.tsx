import type { PlatformReadiness } from "@commentvia/client";
import { authClient } from "@commentvia/client/auth";
import { orpc } from "@commentvia/client/orpc";
import {
	CheckCircle2,
	ExternalLink,
	KeyRound,
	LinkIcon,
	ShieldCheck,
	TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export async function clientLoader() {
	return orpc.platformReadiness();
}

type Scope = PlatformReadiness["google"]["scopes"][number];

function StatusBadge({ enabled }: { enabled: boolean }) {
	return (
		<Badge variant={enabled ? "secondary" : "outline"}>
			{enabled ? (
				<CheckCircle2 data-icon="inline-start" />
			) : (
				<TriangleAlert data-icon="inline-start" />
			)}
			{enabled ? "Configured" : "Needs credentials"}
		</Badge>
	);
}

function ScopeList({ scopes }: { scopes: Scope[] }) {
	return (
		<div className="grid gap-2">
			{scopes.map((scope) => (
				<div className="rounded-lg border bg-background p-3" key={scope.name}>
					<div className="flex flex-wrap items-center gap-2">
						<code className="rounded bg-muted px-1.5 py-0.5 text-xs">
							{scope.name}
						</code>
						{scope.required ? <Badge variant="outline">Required</Badge> : null}
					</div>
					<p className="mt-2 text-xs leading-5 text-muted-foreground">
						{scope.reason}
					</p>
				</div>
			))}
		</div>
	);
}

function UrlRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 rounded-lg bg-muted/50 p-3">
			<p className="text-xs font-medium text-muted-foreground">{label}</p>
			<code className="break-all text-xs">{value}</code>
		</div>
	);
}

export default function ConnectionsRoute() {
	const readiness = useLoaderData() as PlatformReadiness;
	const [metaLoading, setMetaLoading] = useState(false);

	const signInWithGoogle = () =>
		authClient.signIn.social({
			callbackURL: "/",
			provider: "google",
			scopes: readiness.google.scopes.map((scope) => scope.name),
		});

	const signInWithFacebook = () =>
		authClient.signIn.social({
			callbackURL: "/",
			provider: "facebook",
			scopes: ["email", "public_profile"],
		});

	const connectMeta = async () => {
		setMetaLoading(true);
		try {
			const payload = await orpc.metaConnection();
			if (payload.authorizationUrl) {
				window.location.href = payload.authorizationUrl;
			}
		} finally {
			setMetaLoading(false);
		}
	};

	return (
		<>
			<section className="flex flex-col gap-2">
				<Badge className="w-fit" variant="secondary">
					<ShieldCheck data-icon="inline-start" />
					Review readiness
				</Badge>
				<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 className="font-heading text-3xl font-semibold tracking-tight">
							Account connections
						</h1>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
							Use minimal OAuth scopes, verified legal URLs, and clear
							permission reasons so Meta and Google reviewers can approve the
							app faster.
						</p>
					</div>
				</div>
			</section>

			<section className="grid gap-4 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between gap-3">
							<div>
								<CardTitle>Google sign-in</CardTitle>
								<CardDescription>
									Non-sensitive Google OAuth scopes for account login only.
								</CardDescription>
							</div>
							<StatusBadge enabled={readiness.google.enabled} />
						</div>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="flex flex-wrap gap-2">
							<Button
								disabled={!readiness.google.enabled}
								onClick={signInWithGoogle}
								variant="outline"
							>
								<KeyRound data-icon="inline-start" />
								Continue with Google
							</Button>
						</div>
						<ScopeList scopes={readiness.google.scopes} />
						<UrlRow
							label="Authorized redirect URI"
							value={readiness.google.redirectUri}
						/>
						<UrlRow
							label="Authorized domain"
							value={readiness.google.authorizedDomains.join(", ")}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between gap-3">
							<div>
								<CardTitle>Facebook login</CardTitle>
								<CardDescription>
									Basic sign-in only. Instagram permissions are requested in the
									Meta connection flow.
								</CardDescription>
							</div>
							<StatusBadge enabled={readiness.meta.enabled} />
						</div>
					</CardHeader>
					<CardContent className="grid gap-4">
						<Button
							disabled={!readiness.meta.enabled}
							onClick={signInWithFacebook}
							variant="outline"
						>
							<KeyRound data-icon="inline-start" />
							Continue with Facebook
						</Button>
						<ScopeList
							scopes={[
								{
									name: "email",
									reason:
										"Create and match the CommentVia user account by email.",
									required: true,
								},
								{
									name: "public_profile",
									reason: "Display the user's Facebook name and avatar.",
									required: true,
								},
							]}
						/>
						<UrlRow
							label="Facebook Login callback"
							value={readiness.meta.authRedirectUri}
						/>
					</CardContent>
				</Card>
			</section>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
						<div>
							<CardTitle>Meta Instagram connection</CardTitle>
							<CardDescription>
								Connect an Instagram professional account to power comment
								matching and private reply automation.
							</CardDescription>
						</div>
						<StatusBadge enabled={readiness.meta.enabled} />
					</div>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="flex flex-wrap gap-2">
						<Button
							disabled={!readiness.meta.enabled || metaLoading}
							onClick={connectMeta}
						>
							<LinkIcon data-icon="inline-start" />
							Connect Instagram/Facebook
						</Button>
						<Button asChild variant="outline">
							<a
								href={readiness.dataDeletionUrl}
								rel="noreferrer"
								target="_blank"
							>
								<ExternalLink data-icon="inline-start" />
								Data deletion
							</a>
						</Button>
					</div>
					<div className="grid gap-3 md:grid-cols-2">
						<UrlRow
							label="Meta OAuth callback"
							value={readiness.meta.connectionRedirectUri}
						/>
						<UrlRow
							label="Graph API version"
							value={readiness.meta.graphApiVersion}
						/>
						<UrlRow label="Privacy policy" value={readiness.privacyUrl} />
						<UrlRow label="Terms of service" value={readiness.termsUrl} />
					</div>
					<ScopeList scopes={readiness.meta.requestedPermissions} />
				</CardContent>
			</Card>

			<section className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Google verification checklist</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="grid gap-2 text-sm text-muted-foreground">
							{readiness.google.verificationChecklist.map((item) => (
								<li className="flex gap-2" key={item}>
									<CheckCircle2
										className="mt-0.5 text-primary"
										data-icon="inline-start"
									/>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Meta review checklist</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="grid gap-2 text-sm text-muted-foreground">
							{readiness.meta.reviewChecklist.map((item) => (
								<li className="flex gap-2" key={item}>
									<CheckCircle2
										className="mt-0.5 text-primary"
										data-icon="inline-start"
									/>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</section>
		</>
	);
}
