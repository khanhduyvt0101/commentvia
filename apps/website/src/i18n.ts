import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar/translation.json";
import de from "./locales/de/translation.json";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import hi from "./locales/hi/translation.json";
import ja from "./locales/ja/translation.json";
import pt from "./locales/pt/translation.json";
import vi from "./locales/vi/translation.json";
import zh from "./locales/zh/translation.json";

export const supportedLanguages = [
	"en",
	"vi",
	"es",
	"zh",
	"hi",
	"ar",
	"pt",
	"fr",
	"de",
	"ja",
] as const;

export type Language = (typeof supportedLanguages)[number];
export type WebsiteTranslation = typeof en;

export const languageLabels: Record<Language, string> = {
	ar: "العربية",
	de: "Deutsch",
	en: "English",
	es: "Español",
	fr: "Français",
	hi: "हिन्दी",
	ja: "日本語",
	pt: "Português",
	vi: "Tiếng Việt",
	zh: "中文",
};

export const languageFlags: Record<Language, string> = {
	ar: "🇸🇦",
	de: "🇩🇪",
	en: "🇺🇸",
	es: "🇪🇸",
	fr: "🇫🇷",
	hi: "🇮🇳",
	ja: "🇯🇵",
	pt: "🇵🇹",
	vi: "🇻🇳",
	zh: "🇨🇳",
};

export const languageDirections: Record<Language, "ltr" | "rtl"> = {
	ar: "rtl",
	de: "ltr",
	en: "ltr",
	es: "ltr",
	fr: "ltr",
	hi: "ltr",
	ja: "ltr",
	pt: "ltr",
	vi: "ltr",
	zh: "ltr",
};

export const resources: Record<Language, { translation: WebsiteTranslation }> =
	{
		ar: { translation: ar },
		de: { translation: de },
		en: { translation: en },
		es: { translation: es },
		fr: { translation: fr },
		hi: { translation: hi },
		ja: { translation: ja },
		pt: { translation: pt },
		vi: { translation: vi },
		zh: { translation: zh },
	};

export const getSupportedLanguage = (value: string | undefined): Language => {
	const normalized = value?.toLowerCase();
	return (
		supportedLanguages.find(
			(language) =>
				normalized === language || normalized?.startsWith(`${language}-`),
		) ?? "en"
	);
};

export const getResolvedLanguage = (): Language =>
	getSupportedLanguage(i18n.resolvedLanguage ?? i18n.language);

if (!i18n.isInitialized) {
	void i18n
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			detection: {
				caches: ["localStorage"],
				lookupFromPathIndex: 0,
				lookupLocalStorage: "commentvia-website-language",
				order: ["path", "localStorage", "navigator", "htmlTag"],
			},
			fallbackLng: "en",
			interpolation: {
				escapeValue: false,
			},
			load: "languageOnly",
			react: {
				useSuspense: false,
			},
			resources,
			supportedLngs: [...supportedLanguages],
		});
}

export default i18n;
