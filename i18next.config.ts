import { defineConfig } from "i18next-cli";

const locales = ["en", "vi", "es", "zh", "hi", "ar", "pt", "fr", "de", "ja"];

export default defineConfig({
	locales,
	extract: {
		input: ["apps/spa/app/**/*.{ts,tsx}"],
		ignore: [
			"**/node_modules/**",
			"**/.react-router/**",
			"apps/spa/app/components/ui/**",
			"apps/spa/app/locales/**",
			"apps/spa/app/types/**",
		],
		output: "apps/spa/app/locales/{{language}}/{{namespace}}.json",
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
		preservePatterns: [
			"authUi.*",
			"days.*",
			"replies.*",
			"ruleNames.*",
			"status.*",
			"time.*",
		],
		warnOnConflicts: "warn",
	},
	lint: {
		checkInterpolationParams: true,
		ignoredAttributes: ["aria-label", "className", "data-slot"],
		ignoredTags: ["code", "pre"],
	},
	types: {
		input: "apps/spa/app/locales/en/*.json",
		basePath: "apps/spa/app/locales/en",
		output: "apps/spa/app/types/i18next.d.ts",
		resourcesFile: "apps/spa/app/types/resources.d.ts",
	},
});
