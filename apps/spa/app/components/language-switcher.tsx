import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	getResolvedLanguage,
	languageFlags,
	languageLabels,
	supportedLanguages,
} from "@/i18n";

export function LanguageSwitcher() {
	const { i18n, t } = useTranslation();
	const currentLanguage = getResolvedLanguage();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={t("common.language")}
					className="h-10 w-10 text-lg"
					size="icon"
					variant="outline"
				>
					<span aria-hidden>{languageFlags[currentLanguage]}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{supportedLanguages.map((language) => (
					<DropdownMenuItem
						key={language}
						onSelect={() => {
							void i18n.changeLanguage(language);
						}}
					>
						<span className="text-base" data-icon="inline-start">
							{languageFlags[language]}
						</span>
						<span>{languageLabels[language]}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
