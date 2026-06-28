import { authLocalization } from "better-auth-ui";
import { type Language, resources, supportedLanguages } from "@/i18n";

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Record<string, unknown>
		? DeepPartial<T[K]>
		: T[K];
};

export const authLocalizationByLanguage: Record<
	Language,
	typeof authLocalization
> = Object.fromEntries(
	supportedLanguages.map((language) => [
		language,
		{
			...authLocalization,
			...(resources[language].translation.authUi as DeepPartial<
				typeof authLocalization
			>),
		},
	]),
) as Record<Language, typeof authLocalization>;
