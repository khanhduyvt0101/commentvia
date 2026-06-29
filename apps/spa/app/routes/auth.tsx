import type { PlatformReadiness } from "@commentvia/client";
import { authClient } from "@commentvia/client/auth";
import { orpc } from "@commentvia/client/orpc";
import type { SocialProvider } from "better-auth/social-providers";
import {
	AuthUIProvider,
	AuthView,
	type AuthViewPath,
	type SocialOptions,
} from "better-auth-ui";
import { useTranslation } from "react-i18next";
import {
	Link,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
} from "react-router";
import { Toaster } from "sonner";
import logoMarkUrl from "@/assets/commentvia-mark.png";
import { authLocalizationByLanguage } from "@/auth-localization";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getResolvedLanguage } from "@/i18n";

const viewMap: Record<string, AuthViewPath> = {
	"forgot-password": "FORGOT_PASSWORD",
	"reset-password": "RESET_PASSWORD",
	"sign-in": "SIGN_IN",
	"sign-out": "SIGN_OUT",
	"sign-up": "SIGN_UP",
};

export async function clientLoader() {
	return orpc.platformReadiness();
}

export default function AuthRoute() {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const readiness = useLoaderData() as PlatformReadiness;
	const { t } = useTranslation();
	const view = viewMap[params.view ?? "sign-in"] ?? "SIGN_IN";
	const redirectTo =
		new URLSearchParams(location.search).get("redirectTo") ?? "/";
	const localization = authLocalizationByLanguage[getResolvedLanguage()];
	const authCallbackUrl = redirectTo.startsWith("/") ? redirectTo : "/";
	const socialProviders: SocialProvider[] = [
		...(readiness.google.enabled ? (["google"] as const) : []),
		...(readiness.meta.enabled ? (["facebook"] as const) : []),
	];
	const social: SocialOptions | undefined = socialProviders.length
		? {
				providers: socialProviders,
				signIn: (params) =>
					authClient.signIn.social({
						...params,
						callbackURL: params.callbackURL ?? authCallbackUrl,
						scopes:
							params.provider === "google"
								? readiness.google.scopes.map((scope) => scope.name)
								: ["email", "public_profile"],
					}),
			}
		: undefined;

	return (
		<AuthUIProvider
			authClient={authClient}
			basePath="/auth"
			credentials={{ forgotPassword: true }}
			Link={({ href, className, children }) => (
				<Link className={className} to={href}>
					{children}
				</Link>
			)}
			localization={localization}
			navigate={(href) => navigate(href)}
			redirectTo={redirectTo}
			replace={(href) => navigate(href, { replace: true })}
			signUp={{ fields: ["name"] }}
			social={social}
		>
			<main className="grid min-h-screen bg-muted/35 px-4 py-10">
				<div className="absolute end-4 top-4">
					<LanguageSwitcher />
				</div>
				<div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
					<section className="hidden flex-col gap-5 lg:flex">
						<div className="flex items-center gap-2">
							<img
								alt=""
								className="size-10 rounded-lg object-contain"
								src={logoMarkUrl}
							/>
							<span className="font-heading text-xl font-semibold">
								CommentVia
							</span>
						</div>
						<div>
							<h1 className="font-heading text-4xl font-semibold tracking-tight">
								{t("auth.title")}
							</h1>
							<p className="mt-4 text-sm leading-6 text-muted-foreground">
								{t("auth.body")}
							</p>
						</div>
					</section>
					<section className="mx-auto w-full max-w-md">
						<AuthView
							pathname={location.pathname}
							redirectTo={redirectTo}
							socialLayout="vertical"
							view={view}
							localization={localization}
						/>
					</section>
				</div>
				<Toaster />
			</main>
		</AuthUIProvider>
	);
}
