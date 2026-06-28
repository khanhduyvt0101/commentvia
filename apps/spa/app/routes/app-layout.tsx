import { authClient } from "@commentvia/client/auth";
import {
	BarChart3,
	ChevronDown,
	Home,
	LogOut,
	Menu,
	MessageSquareReply,
	Plug,
	Plus,
	Settings,
	ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, redirect, useNavigate } from "react-router";
import logoMarkUrl from "@/assets/commentvia-mark.png";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
	{ to: "/", labelKey: "nav.dashboard", icon: Home },
	{ to: "/rules", labelKey: "nav.rules", icon: MessageSquareReply },
	{ to: "/analytics", labelKey: "nav.analytics", icon: BarChart3 },
	{ to: "/connections", labelKey: "nav.connections", icon: Plug },
] as const;

export async function clientLoader({ request }: { request: Request }) {
	const session = await authClient.getSession();

	if (!session.data?.user) {
		const url = new URL(request.url);
		const next = `${url.pathname}${url.search}${url.hash}`;
		throw redirect(`/auth/sign-in?redirectTo=${encodeURIComponent(next)}`);
	}

	return { user: session.data.user };
}

function Logo() {
	return (
		<Link className="flex items-center gap-2" to="/">
			<img
				alt=""
				className="size-9 rounded-lg object-contain"
				src={logoMarkUrl}
			/>
			<span className="font-heading text-lg font-semibold tracking-tight">
				CommentVia
			</span>
		</Link>
	);
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
	const { t } = useTranslation();

	return (
		<nav
			className="flex flex-col gap-1"
			aria-label={t("layout.openNavigation")}
		>
			{navItems.map((item) => (
				<NavLink
					className={({ isActive }) =>
						cn(
							"flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
							isActive && "bg-accent text-accent-foreground",
						)
					}
					end={item.to === "/"}
					key={item.to}
					onClick={onNavigate}
					to={item.to}
				>
					<item.icon data-icon="inline-start" />
					{t(item.labelKey)}
				</NavLink>
			))}
		</nav>
	);
}

function Sidebar() {
	const { t } = useTranslation();

	return (
		<aside className="hidden min-h-screen w-64 shrink-0 border-e bg-sidebar px-4 py-4 text-sidebar-foreground lg:flex lg:flex-col">
			<Logo />
			<div className="mt-7">
				<SidebarNav />
			</div>
			<div className="mt-auto flex flex-col gap-3 rounded-lg border bg-background p-3">
				<div className="flex items-center gap-2">
					<ShieldCheck className="text-primary" data-icon="inline-start" />
					<p className="text-sm font-medium">{t("layout.metaTitle")}</p>
				</div>
				<p className="text-xs leading-5 text-muted-foreground">
					{t("layout.metaBody")}
				</p>
			</div>
		</aside>
	);
}

function AccountMenu() {
	const navigate = useNavigate();
	const session = authClient.useSession();
	const { t } = useTranslation();
	const user = session.data?.user;
	const initials = user?.name
		?.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	if (!user) {
		return (
			<Button asChild>
				<Link to="/auth/sign-in">{t("account.signIn")}</Link>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="h-10 gap-2 px-2" variant="outline">
					<Avatar size="sm">
						<AvatarImage alt={user.name ?? user.email} src={user.image ?? ""} />
						<AvatarFallback>{initials || "LR"}</AvatarFallback>
					</Avatar>
					<span className="hidden max-w-32 truncate sm:inline">
						{user.name ?? user.email}
					</span>
					<ChevronDown data-icon="inline-end" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<span className="block truncate">{user.email}</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Settings data-icon="inline-start" />
						{t("account.settings")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={async () => {
							await authClient.signOut();
							navigate("/auth/sign-in");
						}}
					>
						<LogOut data-icon="inline-start" />
						{t("account.signOut")}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function MobileNav() {
	const { t } = useTranslation();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label={t("layout.openNavigation")}
					size="icon"
					variant="outline"
				>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent className="w-80" side="left">
				<SheetHeader>
					<SheetTitle>
						<Logo />
					</SheetTitle>
					<SheetDescription>{t("layout.mobileDescription")}</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<SidebarNav />
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default function AppLayout() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen bg-muted/35">
			<div className="flex min-h-screen">
				<Sidebar />
				<div className="flex min-w-0 flex-1 flex-col">
					<header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:px-6">
						<div className="lg:hidden">
							<MobileNav />
						</div>
						<div className="flex min-w-0 flex-1 items-center gap-3">
							<Badge className="hidden sm:inline-flex" variant="secondary">
								{t("layout.liveWorkspace")}
							</Badge>
							<p className="truncate text-sm text-muted-foreground">
								{t("layout.headerSubtitle")}
							</p>
						</div>
						<LanguageSwitcher />
						<Button className="hidden sm:inline-flex">
							<Plus data-icon="inline-start" />
							{t("layout.newRule")}
						</Button>
						<AccountMenu />
					</header>
					<main className="flex-1 p-4 lg:p-6">
						<div className="mx-auto flex max-w-7xl flex-col gap-6">
							<Outlet />
						</div>
					</main>
					<Separator />
					<footer className="px-4 py-4 text-xs text-muted-foreground lg:px-6">
						{t("footer")}
					</footer>
				</div>
			</div>
		</div>
	);
}
