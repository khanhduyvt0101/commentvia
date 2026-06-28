import type { DashboardPayload } from "@commentvia/client";
import { orpc } from "@commentvia/client/orpc";
import {
	ArrowUpRight,
	CheckCircle2,
	MessageCircle,
	MousePointerClick,
	Send,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getResolvedLanguage } from "@/i18n";

export async function clientLoader() {
	return orpc.dashboard({ range: "30d" });
}

const metricIcons = [Send, MousePointerClick, MessageCircle, ArrowUpRight];

const replyKeys: Record<string, string> = {
	"Check DM. I shared the paint details.": "paintDetails",
	"Check your inbox. I sent the outfit link.": "outfitLink",
	"Sent it to your inbox.": "genericInbox",
};

const mapTranslatedValue = (values: Record<string, string>, value: string) =>
	values[value] ?? value;

const mapTranslatedReply = (values: Record<string, string>, value: string) => {
	const key = replyKeys[value];
	return key ? (values[key] ?? value) : value;
};

export default function DashboardRoute() {
	const data = useLoaderData() as DashboardPayload;
	const { t } = useTranslation();
	const locale = getResolvedLanguage();
	const numberFormatter = new Intl.NumberFormat(locale);
	const dayLabels = t("days", { returnObjects: true }) as Record<
		string,
		string
	>;
	const replies = t("replies", { returnObjects: true }) as Record<
		string,
		string
	>;
	const ruleNames = t("ruleNames", {
		returnObjects: true,
	}) as Record<string, string>;
	const statuses = t("status", {
		returnObjects: true,
	}) as Record<string, string>;
	const times = t("time", { returnObjects: true }) as Record<string, string>;
	const translateMetricLabel = (label: string) => {
		switch (label) {
			case "Active rules":
				return t("dashboard.metrics.activeRules");
			case "Avg click rate":
				return t("dashboard.metrics.avgClickRate");
			case "DMs sent":
				return t("dashboard.metrics.dmsSent");
			case "Link clicks":
				return t("dashboard.metrics.linkClicks");
			default:
				return label;
		}
	};
	const maxComments = Math.max(
		...data.activity.map((activity) => activity.comments),
	);

	return (
		<>
			<section className="flex flex-col gap-2">
				<Badge className="w-fit" variant="secondary">
					{t("dashboard.badge")}
				</Badge>
				<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 className="font-heading text-3xl font-semibold tracking-tight">
							{t("dashboard.title")}
						</h1>
						<p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
							{t("dashboard.description")}
						</p>
					</div>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{data.metrics.map((metric, index) => {
					const Icon = metricIcons[index] ?? ArrowUpRight;
					return (
						<Card key={metric.label}>
							<CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
								<CardDescription>
									{translateMetricLabel(metric.label)}
								</CardDescription>
								<Icon
									className="text-muted-foreground"
									data-icon="inline-start"
								/>
							</CardHeader>
							<CardContent>
								<div className="font-heading text-3xl font-semibold">
									{metric.label === "Avg click rate"
										? `${metric.value}%`
										: numberFormatter.format(metric.value)}
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									{metric.change} {t("dashboard.metricChangeSuffix")}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</section>

			<section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
				<Card>
					<CardHeader>
						<CardTitle>{t("dashboard.activity.title")}</CardTitle>
						<CardDescription>
							{t("dashboard.activity.description")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid h-72 grid-cols-7 items-end gap-3">
							{data.activity.map((point) => (
								<div
									className="flex h-full flex-col justify-end gap-2"
									key={point.day}
								>
									<div className="flex flex-1 items-end gap-1">
										<div
											className="w-full rounded-t-md bg-muted"
											style={{
												height: `${Math.max(12, (point.comments / maxComments) * 100)}%`,
											}}
										/>
										<div
											className="w-full rounded-t-md bg-primary/75"
											style={{
												height: `${Math.max(12, (point.dms / maxComments) * 100)}%`,
											}}
										/>
										<div
											className="w-full rounded-t-md bg-primary"
											style={{
												height: `${Math.max(12, (point.clicks / maxComments) * 100)}%`,
											}}
										/>
									</div>
									<span className="text-center text-xs text-muted-foreground">
										{mapTranslatedValue(dayLabels, point.day)}
									</span>
								</div>
							))}
						</div>
						<div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-sm bg-muted" />
								{t("dashboard.activity.comments")}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-sm bg-primary/75" />
								{t("dashboard.activity.dms")}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-sm bg-primary" />
								{t("dashboard.activity.clicks")}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("dashboard.queue.title")}</CardTitle>
						<CardDescription>
							{t("dashboard.queue.description")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						{data.queue.map((item) => (
							<div
								className="rounded-lg border bg-background p-3"
								key={item.id}
							>
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium">@{item.viewer}</p>
									<Badge
										variant={
											item.status === "delivered" ? "secondary" : "outline"
										}
									>
										{mapTranslatedValue(statuses, item.status)}
									</Badge>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">
									{t("dashboard.queue.comment")}: {item.comment}
								</p>
								<p className="mt-2 rounded-md bg-primary p-2 text-sm text-primary-foreground">
									{mapTranslatedReply(replies, item.reply)}
								</p>
								<p className="mt-2 text-xs text-muted-foreground">
									{mapTranslatedValue(times, item.time)}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</section>

			<Card>
				<CardHeader>
					<CardTitle>{t("dashboard.rules.title")}</CardTitle>
					<CardDescription>{t("dashboard.rules.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("dashboard.rules.rule")}</TableHead>
								<TableHead>{t("dashboard.rules.keyword")}</TableHead>
								<TableHead>{t("dashboard.rules.status")}</TableHead>
								<TableHead>{t("dashboard.rules.sent")}</TableHead>
								<TableHead className="text-end">
									{t("dashboard.rules.clickRate")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.rules.map((rule) => (
								<TableRow key={rule.id}>
									<TableCell>
										<div className="font-medium">
											{mapTranslatedValue(ruleNames, rule.name)}
										</div>
										<div className="max-w-60 truncate text-xs text-muted-foreground">
											{rule.dmLink}
										</div>
									</TableCell>
									<TableCell>{rule.keyword}</TableCell>
									<TableCell>
										<Badge
											variant={
												rule.status === "active" ? "secondary" : "outline"
											}
										>
											{mapTranslatedValue(statuses, rule.status)}
										</Badge>
									</TableCell>
									<TableCell>{numberFormatter.format(rule.sent)}</TableCell>
									<TableCell className="min-w-36 text-end">
										<div className="flex items-center justify-end gap-2">
											<Progress
												className="h-2 w-20"
												value={rule.conversionRate}
											/>
											<span>{rule.conversionRate}%</span>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
						<CheckCircle2 className="text-primary" data-icon="inline-start" />
						{t("dashboard.dataNote")}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
