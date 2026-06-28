import type { DashboardRule } from "@commentvia/client";
import { orpc } from "@commentvia/client/orpc";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export async function clientLoader() {
	return orpc.rules();
}

const mapTranslatedValue = (values: Record<string, string>, value: string) =>
	values[value] ?? value;

const replyKeys: Record<string, string> = {
	"Check DM. I shared the paint details.": "paintDetails",
	"Check your inbox. I sent the outfit link.": "outfitLink",
	"Sent it to your inbox.": "genericInbox",
};

const mapTranslatedReply = (values: Record<string, string>, value: string) => {
	const key = replyKeys[value];
	return key ? (values[key] ?? value) : value;
};

export default function RulesRoute() {
	const rules = useLoaderData() as DashboardRule[];
	const { t } = useTranslation();
	const publicReplies = t("replies", {
		returnObjects: true,
	}) as Record<string, string>;
	const ruleNames = t("ruleNames", {
		returnObjects: true,
	}) as Record<string, string>;
	const statuses = t("status", {
		returnObjects: true,
	}) as Record<string, string>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("rules.title")}</CardTitle>
				<CardDescription>{t("rules.description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("rules.name")}</TableHead>
							<TableHead>{t("rules.keyword")}</TableHead>
							<TableHead>{t("rules.publicReply")}</TableHead>
							<TableHead>{t("rules.status")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rules.map((rule) => (
							<TableRow key={rule.id}>
								<TableCell className="font-medium">
									{mapTranslatedValue(ruleNames, rule.name)}
								</TableCell>
								<TableCell>{rule.keyword}</TableCell>
								<TableCell>
									{mapTranslatedReply(publicReplies, rule.publicReply)}
								</TableCell>
								<TableCell>
									<Badge
										variant={rule.status === "active" ? "secondary" : "outline"}
									>
										{mapTranslatedValue(statuses, rule.status)}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
