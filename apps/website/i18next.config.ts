import { defineConfig } from "i18next-cli";

const locales = ["en", "vi", "es", "zh", "hi", "ar", "pt", "fr", "de", "ja"];

export default defineConfig({
	locales,
	extract: {
		input: ["apps/website/src/**/*.{ts,tsx}"],
		ignore: [
			"**/node_modules/**",
			"apps/website/src/locales/**",
			"apps/website/src/types/**",
		],
		output: "apps/website/src/locales/{{language}}/{{namespace}}.json",
		defaultNS: "translation",
		keySeparator: ".",
		nsSeparator: ":",
		functions: ["t", "*.t", "i18n.t"],
		transComponents: ["Trans", "Translation"],
		useTranslationNames: ["useTranslation"],
		sort: true,
		indentation: "\t",
		primaryLanguage: "en",
		secondaryLanguages: locales.filter((locale) => locale !== "en"),
		defaultValue: "",
		removeUnusedKeys: false,
		outputFormat: "json",
		warnOnConflicts: "warn",
	},
	lint: {
		checkInterpolationParams: true,
		ignoredAttributes: ["aria-label", "className", "data-slot"],
		ignoredTags: ["code", "pre"],
	},
	types: {
		input: "apps/website/src/locales/en/*.json",
		basePath: "apps/website/src/locales/en",
		output: "apps/website/src/types/i18next.d.ts",
		resourcesFile: "apps/website/src/types/resources.d.ts",
	},
});
