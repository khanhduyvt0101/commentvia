import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import ar from "../src/locales/ar/translation.json";
import de from "../src/locales/de/translation.json";
import en from "../src/locales/en/translation.json";
import es from "../src/locales/es/translation.json";
import fr from "../src/locales/fr/translation.json";
import hi from "../src/locales/hi/translation.json";
import ja from "../src/locales/ja/translation.json";
import pt from "../src/locales/pt/translation.json";
import vi from "../src/locales/vi/translation.json";
import zh from "../src/locales/zh/translation.json";

const siteUrl = "https://commentvia.com";
const siteRootUrl = `${siteUrl}/`;
const brandName = "CommentVia";
const distDir = new URL("../dist", import.meta.url).pathname;
const indexPath = join(distDir, "index.html");
const ogImageUrl = `${siteUrl}/og-image.png`;
const supportEmail = "khanhduyvt0101@gmail.com";

const supportedLanguages = [
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

type Language = (typeof supportedLanguages)[number];
type Translation = typeof en;
type LegalPage = "privacy" | "terms" | "data-deletion";
type PageSlug = "" | LegalPage;

const resources: Record<Language, Translation> = {
	en,
	vi,
	es,
	zh,
	hi,
	ar,
	pt,
	fr,
	de,
	ja,
};

const localeMap: Record<Language, string> = {
	en: "en_US",
	vi: "vi_VN",
	es: "es_ES",
	zh: "zh_CN",
	hi: "hi_IN",
	ar: "ar_SA",
	pt: "pt_PT",
	fr: "fr_FR",
	de: "de_DE",
	ja: "ja_JP",
};

const legalTitles: Record<Language, Record<LegalPage, string>> = {
	ar: {
		privacy: "سياسة الخصوصية",
		terms: "شروط الخدمة",
		"data-deletion": "تعليمات حذف البيانات",
	},
	de: {
		privacy: "Datenschutzrichtlinie",
		terms: "Nutzungsbedingungen",
		"data-deletion": "Anleitung zur Datenlöschung",
	},
	en: {
		privacy: "Privacy Policy",
		terms: "Terms of Service",
		"data-deletion": "Data Deletion Instructions",
	},
	es: {
		privacy: "Política de privacidad",
		terms: "Términos del servicio",
		"data-deletion": "Instrucciones para la eliminación de datos",
	},
	fr: {
		privacy: "Politique de confidentialité",
		terms: "Conditions d'utilisation",
		"data-deletion": "Instructions de suppression des données",
	},
	hi: {
		privacy: "गोपनीयता नीति",
		terms: "सेवा की शर्तें",
		"data-deletion": "डेटा हटाने के निर्देश",
	},
	ja: {
		privacy: "プライバシーポリシー",
		terms: "利用規約",
		"data-deletion": "データ削除手順",
	},
	pt: {
		privacy: "Política de privacidade",
		terms: "Termos de serviço",
		"data-deletion": "Instruções de eliminação de dados",
	},
	vi: {
		privacy: "Chính sách quyền riêng tư",
		terms: "Điều khoản dịch vụ",
		"data-deletion": "Hướng dẫn xóa dữ liệu",
	},
	zh: {
		privacy: "隐私政策",
		terms: "服务条款",
		"data-deletion": "数据删除说明",
	},
};

const legalDescriptions: Record<Language, Record<LegalPage, string>> = {
	ar: {
		privacy:
			"كيف تجمع CommentVia المعلومات وتستخدمها وتشاركها وتحميها عبر الموقع والتطبيق.",
		terms:
			"قواعد استخدام CommentVia، بما في ذلك الحسابات والتكاملات والمحتوى والمسؤولية.",
		"data-deletion":
			"كيفية طلب حذف بيانات حساب CommentVia وبيانات اتصال Meta وInstagram وFacebook وGoogle.",
	},
	de: {
		privacy:
			"Wie CommentVia Informationen fuer Website und App erhebt, nutzt, teilt, speichert und schuetzt.",
		terms:
			"Die Regeln fuer die Nutzung von CommentVia, inklusive Konten, Integrationen, Inhalte und Haftung.",
		"data-deletion":
			"So forderst du die Loeschung von CommentVia-Konto- und Verbindungsdaten fuer Meta, Instagram, Facebook und Google an.",
	},
	en: {
		privacy:
			"How CommentVia collects, uses, shares, retains, and protects information for the CommentVia website and app.",
		terms:
			"The rules for using CommentVia, including accounts, acceptable use, subscriptions, integrations, content, and liability.",
		"data-deletion":
			"How to request deletion of CommentVia account, Meta, Instagram, Facebook, and Google connection data.",
	},
	es: {
		privacy:
			"Cómo CommentVia recopila, usa, comparte, conserva y protege la información del sitio web y la app.",
		terms:
			"Las reglas para usar CommentVia, incluidas cuentas, integraciones, contenido y responsabilidad.",
		"data-deletion":
			"Cómo solicitar la eliminación de datos de CommentVia y conexiones de Meta, Instagram, Facebook y Google.",
	},
	fr: {
		privacy:
			"Comment CommentVia collecte, utilise, partage, conserve et protège les informations du site et de l'application.",
		terms:
			"Les règles d'utilisation de CommentVia, y compris les comptes, intégrations, contenus et responsabilités.",
		"data-deletion":
			"Comment demander la suppression des données CommentVia, Meta, Instagram, Facebook et Google.",
	},
	hi: {
		privacy:
			"CommentVia वेबसाइट और ऐप के लिए जानकारी कैसे एकत्र, उपयोग, साझा, संग्रहित और सुरक्षित करता है।",
		terms:
			"CommentVia उपयोग करने के नियम, जिनमें खाते, integrations, content और liability शामिल हैं।",
		"data-deletion":
			"CommentVia खाते और Meta, Instagram, Facebook, Google connection data हटाने का अनुरोध कैसे करें।",
	},
	ja: {
		privacy:
			"CommentViaのウェブサイトとアプリで情報を収集、利用、共有、保持、保護する方法。",
		terms: "アカウント、連携、コンテンツ、責任を含むCommentViaの利用ルール。",
		"data-deletion":
			"CommentViaアカウントとMeta、Instagram、Facebook、Google連携データの削除を依頼する方法。",
	},
	pt: {
		privacy:
			"Como a CommentVia recolhe, utiliza, partilha, conserva e protege informações no site e na app.",
		terms:
			"As regras de utilização da CommentVia, incluindo contas, integrações, conteúdo e responsabilidade.",
		"data-deletion":
			"Como pedir a eliminação de dados da conta CommentVia e ligações Meta, Instagram, Facebook e Google.",
	},
	vi: {
		privacy:
			"Cách CommentVia thu thập, sử dụng, chia sẻ, lưu giữ và bảo vệ thông tin cho website và ứng dụng.",
		terms:
			"Các quy định sử dụng CommentVia, bao gồm tài khoản, tích hợp, nội dung và trách nhiệm pháp lý.",
		"data-deletion":
			"Cách yêu cầu xóa tài khoản CommentVia và dữ liệu kết nối Meta, Instagram, Facebook, Google.",
	},
	zh: {
		privacy: "CommentVia 如何为网站和应用收集、使用、共享、保留和保护信息。",
		terms: "使用 CommentVia 的规则，包括账户、集成、内容和责任。",
		"data-deletion":
			"如何请求删除 CommentVia 账户以及 Meta、Instagram、Facebook 和 Google 连接数据。",
	},
};

const pages: PageSlug[] = ["", "privacy", "terms", "data-deletion"];

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function absoluteUrl(language: Language, page: PageSlug) {
	return `${siteUrl}/${language}/${page ? `${page}/` : ""}`;
}

function getTitle(language: Language, page: PageSlug) {
	if (page) {
		return `${legalTitles[language][page]} | ${brandName}`;
	}
	return `${resources[language].hero.title} | ${brandName}`;
}

function getDescription(language: Language, page: PageSlug) {
	if (page) {
		return legalDescriptions[language][page];
	}
	return resources[language].hero.body;
}

function alternates(page: PageSlug) {
	const links = supportedLanguages.map(
		(language) =>
			`<link rel="alternate" hreflang="${language}" href="${absoluteUrl(
				language,
				page,
			)}" />`,
	);
	links.push(
		`<link rel="alternate" hreflang="x-default" href="${
			page ? absoluteUrl("en", page) : siteRootUrl
		}" />`,
	);
	return links.join("\n\t\t");
}

function jsonLd(language: Language, page: PageSlug) {
	if (page) {
		return {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: getTitle(language, page),
			description: getDescription(language, page),
			url: absoluteUrl(language, page),
			inLanguage: language,
			isPartOf: {
				"@type": "WebSite",
				name: brandName,
				url: siteRootUrl,
			},
		};
	}

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				name: brandName,
				url: siteRootUrl,
				inLanguage: language,
				publisher: {
					"@id": `${siteUrl}/#organization`,
				},
			},
			{
				"@id": `${siteUrl}/#organization`,
				"@type": "Organization",
				name: brandName,
				url: siteUrl,
				logo: `${siteUrl}/favicon.png`,
				email: supportEmail,
			},
			{
				"@type": "SoftwareApplication",
				name: brandName,
				applicationCategory: "BusinessApplication",
				operatingSystem: "Web",
				description: getDescription(language, page),
				url: absoluteUrl(language, page),
				image: ogImageUrl,
				offers: {
					"@type": "Offer",
					price: "19",
					priceCurrency: "USD",
				},
			},
		],
	};
}

function headHtml(language: Language, page: PageSlug) {
	const title = getTitle(language, page);
	const description = getDescription(language, page);
	const canonical = absoluteUrl(language, page);
	const ogLocaleAlternates = supportedLanguages
		.filter((option) => option !== language)
		.map(
			(option) =>
				`<meta property="og:locale:alternate" content="${localeMap[option]}" />`,
		)
		.join("\n\t\t");

	return `<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="content-language" content="${language}" />
		<meta name="theme-color" content="#f7f7f5" />
		<meta name="color-scheme" content="light dark" />
		<link rel="icon" type="image/png" href="/favicon.png" />
		<link rel="apple-touch-icon" href="/favicon.png" />
		<link rel="canonical" href="${canonical}" />
		${alternates(page)}
		<meta name="description" content="${escapeHtml(description)}" />
		<meta name="robots" content="index, follow, max-image-preview:large" />
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="${brandName}" />
		<meta property="og:locale" content="${localeMap[language]}" />
		${ogLocaleAlternates}
		<meta property="og:title" content="${escapeHtml(title)}" />
		<meta property="og:description" content="${escapeHtml(description)}" />
		<meta property="og:image" content="${ogImageUrl}" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:url" content="${canonical}" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="${escapeHtml(title)}" />
		<meta name="twitter:description" content="${escapeHtml(description)}" />
		<meta name="twitter:image" content="${ogImageUrl}" />
		<script type="application/ld+json">${JSON.stringify(jsonLd(language, page))}</script>
		<title>${escapeHtml(title)}</title>`;
}

function preservedHeadAssets(template: string) {
	const head = template.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
	return head
		.split("\n")
		.map((line) => line.trim())
		.filter(
			(line) =>
				line.startsWith('<link rel="modulepreload"') ||
				line.startsWith('<link rel="stylesheet"') ||
				line.startsWith('<script type="module"'),
		)
		.join("\n\t\t");
}

function renderHtml(template: string, language: Language, page: PageSlug) {
	const assets = preservedHeadAssets(template);
	const head = [headHtml(language, page), assets]
		.filter(Boolean)
		.join("\n\t\t");

	return template
		.replace(
			/<html[^>]*>/,
			`<html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}">`,
		)
		.replace(/<head>[\s\S]*?<\/head>/, `<head>\n\t\t${head}\n\t</head>`);
}

function sitemapXml() {
	const urlEntries = pages.flatMap((page) =>
		supportedLanguages.map((language) => {
			const links = [
				...supportedLanguages.map(
					(option) =>
						`		<xhtml:link rel="alternate" hreflang="${option}" href="${absoluteUrl(
							option,
							page,
						)}" />`,
				),
				`		<xhtml:link rel="alternate" hreflang="x-default" href="${
					page ? absoluteUrl("en", page) : siteRootUrl
				}" />`,
			].join("\n");

			return `	<url>
		<loc>${absoluteUrl(language, page)}</loc>
${links}
		<changefreq>${page ? "monthly" : "weekly"}</changefreq>
		<priority>${page ? "0.7" : "1.0"}</priority>
	</url>`;
		}),
	);

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>
`;
}

async function writePage(pathname: string, html: string) {
	const filePath = join(distDir, pathname, "index.html");
	await mkdir(dirname(filePath), { recursive: true });
	await writeFile(filePath, html);
}

const template = await readFile(indexPath, "utf8");
await writeFile(indexPath, renderHtml(template, "en", ""));

for (const page of pages) {
	for (const language of supportedLanguages) {
		await writePage(
			`${language}/${page}`,
			renderHtml(template, language, page),
		);
	}
}

await writeFile(
	join(distDir, "robots.txt"),
	`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
);
await writeFile(join(distDir, "sitemap.xml"), sitemapXml());

console.log(
	`Generated SEO HTML, robots.txt, and sitemap.xml for ${supportedLanguages.length} languages.`,
);
