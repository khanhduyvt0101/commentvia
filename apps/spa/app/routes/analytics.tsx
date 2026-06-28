import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsRoute() {
	const { t } = useTranslation();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("analytics.title")}</CardTitle>
			</CardHeader>
			<CardContent className="flex min-h-80 flex-col items-center justify-center gap-3 text-center">
				<BarChart3 className="text-primary" />
				<p className="max-w-sm text-sm text-muted-foreground">
					{t("analytics.body")}
				</p>
			</CardContent>
		</Card>
	);
}
