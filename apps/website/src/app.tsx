import { commentViaUrls } from "@commentvia/client/urls";
import { getDefaultWebsiteBaseUrl, trimTrailingSlash } from "@commentvia/util";
import {
	ArrowRight,
	Check,
	Menu,
	Monitor,
	Moon,
	Sparkles,
	Sun,
	X,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import authorAvatarUrl from "./assets/author-account-avatar.png";
import logoMarkUrl from "./assets/commentvia-mark.png";
import heroPreviewUrl from "./assets/hero-preview-board.png";
import {
	type Language,
	languageDirections,
	languageFlags,
	languageLabels,
	resources,
	supportedLanguages,
	type WebsiteTranslation,
} from "./i18n";

const { signIn: signInUrl, signUp: signUpUrl } = commentViaUrls;
const siteUrl = trimTrailingSlash(getDefaultWebsiteBaseUrl());
const ogImageUrl = `${siteUrl}/og-image.png`;
const defaultDescription =
	"CommentVia sends Instagram product links by DM when viewers comment a keyword on a post or Reel.";

const openGraphLocales: Record<Language, string> = {
	ar: "ar_SA",
	de: "de_DE",
	en: "en_US",
	es: "es_ES",
	fr: "fr_FR",
	hi: "hi_IN",
	ja: "ja_JP",
	pt: "pt_PT",
	vi: "vi_VN",
	zh: "zh_CN",
};

type Theme = "system" | "light" | "dark";
type LegalPage = "privacy" | "terms" | "data-deletion";

type LegalSection = {
	title: string;
	body?: string[];
	items?: string[];
};

type LegalDocument = {
	title: string;
	description: string;
	lastUpdated: string;
	intro: string[];
	sections: LegalSection[];
};

const themeOrder: Theme[] = ["system", "light", "dark"];

const legalDocuments: Record<LegalPage, LegalDocument> = {
	privacy: {
		title: "Privacy Policy",
		description:
			"How CommentVia collects, uses, shares, retains, and protects information for the CommentVia website and app.",
		lastUpdated: "June 28, 2026",
		intro: [
			"This Privacy Policy explains how CommentVia collects and uses information when you visit our website, create an account, connect creator-commerce workflows, or use our comment-to-DM automation tools.",
			"We wrote this notice to be clear about the categories of information we handle, the reasons we use it, the services we rely on, and the choices available to you.",
		],
		sections: [
			{
				title: "Information We Collect",
				items: [
					"Account information, such as your name, email address, password authentication data, profile image, and workspace preferences.",
					"Connected account information, such as Google, Facebook, and Instagram account identifiers, profile details, access tokens, granted scopes, token expiry, and connection status.",
					"Creator workflow information, such as Instagram account identifiers you connect, post or Reel URLs, keywords, public reply text, DM link destinations, rule status, and delivery analytics.",
					"Usage and device information, such as log data, browser type, approximate region, pages viewed, feature interactions, diagnostic events, and cookie or similar technology identifiers.",
					"Payment and subscription information, if paid plans are enabled, such as plan, billing status, invoices, and payment processor references. We do not store full card numbers.",
					"Support communications, such as messages you send us, attachments you choose to provide, and related troubleshooting context.",
				],
			},
			{
				title: "How We Use Information",
				items: [
					"Provide, secure, and maintain the CommentVia service.",
					"Create and manage accounts, sessions, workspaces, rules, integrations, and support requests.",
					"Authenticate users with Google or Facebook when you choose social sign-in.",
					"Send requested links, show previews, measure rule performance, and improve creator workflows.",
					"Prevent abuse, troubleshoot errors, enforce our Terms, and protect users and the service.",
					"Send service, security, billing, and product communications.",
					"Comply with legal, tax, accounting, platform, and regulatory obligations.",
				],
			},
			{
				title: "How We Share Information",
				body: [
					"We do not sell personal information. We share information only when needed to operate CommentVia, follow your instructions, comply with law, or protect rights and safety.",
				],
				items: [
					"Service providers that host infrastructure, process authentication, analytics, billing, support, email, logs, and security operations.",
					"Integration providers, including Google, Meta, Facebook, and Instagram, when you connect accounts, sign in, or configure workflows that depend on those platform services.",
					"Professional advisors, authorities, or counterparties when reasonably necessary for legal compliance, security, business transfers, or dispute resolution.",
				],
			},
			{
				title: "Cookies and Similar Technologies",
				body: [
					"We use cookies and similar technologies for authentication, security, preferences, analytics, and product diagnostics. You can control cookies through your browser, but disabling some cookies may prevent the app from working correctly.",
				],
			},
			{
				title: "Retention",
				body: [
					"We keep information for as long as needed to provide the service, comply with legal obligations, resolve disputes, maintain security, and enforce agreements. When information is no longer needed, we delete, de-identify, or aggregate it where practical.",
				],
			},
			{
				title: "Security",
				body: [
					"We use administrative, technical, and organizational safeguards designed to protect information. No internet service can guarantee perfect security, so please use a strong password, protect your devices, and contact us if you believe your account is at risk.",
				],
			},
			{
				title: "Your Choices and Rights",
				items: [
					"You may access, update, export, or delete certain account information through the app or by contacting us.",
					"Depending on your location, you may have rights to know, access, correct, delete, restrict, object, port, or opt out of certain processing.",
					"California residents may request information about categories of personal information collected, sources, purposes, disclosures, and may request correction or deletion where applicable.",
					"European Economic Area, United Kingdom, and similar-region users may also have rights related to legal bases, supervisory authority complaints, and international transfers.",
				],
			},
			{
				title: "International Transfers",
				body: [
					"CommentVia may process information in countries other than where you live. When required, we use appropriate safeguards for international transfers.",
				],
			},
			{
				title: "Children",
				body: [
					"CommentVia is not directed to children under 13, and we do not knowingly collect personal information from children. If you believe a child provided information, contact us so we can take appropriate action.",
				],
			},
			{
				title: "Changes and Contact",
				body: [
					"We may update this Privacy Policy as the service changes. If changes are material, we will take reasonable steps to notify users. Contact khanhduyvt0101@gmail.com with privacy requests or questions.",
				],
			},
		],
	},
	terms: {
		title: "Terms of Service",
		description:
			"The rules for using CommentVia, including accounts, acceptable use, subscriptions, integrations, content, and liability.",
		lastUpdated: "June 28, 2026",
		intro: [
			"These Terms of Service govern your access to and use of CommentVia. By creating an account, connecting integrations, or using the service, you agree to these Terms.",
			"If you use CommentVia for a company or client, you confirm that you have authority to accept these Terms for that organization.",
		],
		sections: [
			{
				title: "The Service",
				body: [
					"CommentVia provides tools for creators and businesses to configure Instagram comment-to-DM workflows, manage keyword rules, preview replies, and review performance analytics. Features may change as we improve the service or respond to platform requirements.",
				],
			},
			{
				title: "Accounts and Security",
				items: [
					"You must provide accurate account information and keep it current.",
					"You are responsible for activity under your account and for protecting passwords, sessions, and connected accounts.",
					"You must notify us promptly if you suspect unauthorized access or misuse.",
				],
			},
			{
				title: "Your Content and Data",
				body: [
					"You retain ownership of content and data you submit to CommentVia, including rule text, links, keywords, account configuration, and connected workflow data. You grant CommentVia the rights needed to host, process, transmit, display, and use that content to provide and improve the service.",
				],
			},
			{
				title: "Acceptable Use",
				items: [
					"Do not use CommentVia for spam, deceptive messaging, unlawful promotions, harassment, or content that violates platform rules.",
					"Do not reverse engineer, overload, scrape, disrupt, or bypass security controls of the service.",
					"Do not upload malicious code or use CommentVia to transmit harmful, infringing, or illegal material.",
					"Do not misrepresent your identity, permissions, products, prices, or affiliations.",
				],
			},
			{
				title: "Instagram and Third-Party Platforms",
				body: [
					"CommentVia depends on third-party services such as Meta and Instagram. Your use of those services is subject to their terms, policies, permissions, review processes, rate limits, and availability. We are not responsible for third-party platform changes, outages, account actions, or permission decisions.",
				],
			},
			{
				title: "Subscriptions and Payment",
				body: [
					"If paid plans are offered, fees, billing periods, renewal terms, and included usage will be shown at checkout or in the app. Unless stated otherwise, subscriptions renew until canceled. Taxes may apply. Payments may be processed by third-party providers.",
				],
			},
			{
				title: "Beta Features",
				body: [
					"We may offer previews, beta features, templates, or experimental integrations. These may be changed, limited, or discontinued at any time and may be less reliable than generally available features.",
				],
			},
			{
				title: "Suspension and Termination",
				body: [
					"You may stop using CommentVia at any time. We may suspend or terminate access if you violate these Terms, create security or legal risk, fail to pay amounts owed, or use the service in a way that may harm users, platforms, or CommentVia.",
				],
			},
			{
				title: "Disclaimers",
				body: [
					"CommentVia is provided on an “as is” and “as available” basis. We do not guarantee uninterrupted availability, specific sales outcomes, platform approval, message delivery, or error-free operation.",
				],
			},
			{
				title: "Limitation of Liability",
				body: [
					"To the maximum extent permitted by law, CommentVia will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, revenue, goodwill, data, or business opportunities. Our aggregate liability for claims relating to the service is limited to the amounts you paid to CommentVia for the service in the 12 months before the claim.",
				],
			},
			{
				title: "Changes and Contact",
				body: [
					"We may update these Terms as the service changes. Continued use after updates means you accept the revised Terms. Contact khanhduyvt0101@gmail.com with questions about these Terms.",
				],
			},
		],
	},
	"data-deletion": {
		title: "Data Deletion Instructions",
		description:
			"How to request deletion of CommentVia account, Meta, Instagram, Facebook, and Google connection data.",
		lastUpdated: "June 28, 2026",
		intro: [
			"You can request deletion of your CommentVia account data and connected platform data at any time.",
			"This page is provided for Meta App Review, Google OAuth verification, and users who want to remove data associated with connected Instagram, Facebook, or Google accounts.",
		],
		sections: [
			{
				title: "How to Request Deletion",
				items: [
					"Email khanhduyvt0101@gmail.com from the email address associated with your CommentVia account.",
					"Use the subject line: CommentVia data deletion request.",
					"Tell us whether you want to delete only connected platform data or your full CommentVia account.",
				],
			},
			{
				title: "What We Delete",
				items: [
					"Account profile information, workspace preferences, sessions, and authentication records where legally permitted.",
					"Connected Instagram, Facebook, and Google account identifiers and tokens stored by CommentVia.",
					"Automation rules, post URLs, keywords, public replies, DM link destinations, and related analytics associated with your workspace.",
				],
			},
			{
				title: "Meta Data Deletion Callback",
				body: [
					"When Meta sends a signed data deletion request, CommentVia verifies the request and returns a confirmation code with a status URL. We then remove data associated with the Meta user or connected business account where it exists in our systems.",
				],
			},
			{
				title: "Retention Exceptions",
				body: [
					"We may retain limited records when required for security, fraud prevention, legal compliance, accounting, dispute resolution, or backup recovery. Retained records are deleted or de-identified when no longer needed.",
				],
			},
			{
				title: "Timing",
				body: [
					"We aim to complete deletion requests within 30 days unless a longer period is required by law, security review, or platform verification.",
				],
			},
		],
	},
};

const legalDocumentsByLanguage: Partial<
	Record<Language, Record<LegalPage, LegalDocument>>
> = {
	en: legalDocuments,
	vi: {
		privacy: {
			title: "Chính sách quyền riêng tư",
			description:
				"Cách CommentVia thu thập, sử dụng, chia sẻ, lưu giữ và bảo vệ thông tin cho website và ứng dụng CommentVia.",
			lastUpdated: "Ngày 28 tháng 6 năm 2026",
			intro: [
				"Chính sách quyền riêng tư này giải thích cách CommentVia thu thập và sử dụng thông tin khi bạn truy cập website của chúng tôi, tạo tài khoản, kết nối các quy trình creator-commerce hoặc sử dụng công cụ tự động hóa từ bình luận đến DM của chúng tôi.",
				"Chúng tôi soạn thông báo này để nêu rõ các danh mục thông tin chúng tôi xử lý, lý do chúng tôi sử dụng thông tin đó, các dịch vụ chúng tôi dựa vào và những lựa chọn dành cho bạn.",
			],
			sections: [
				{
					title: "Thông tin chúng tôi thu thập",
					items: [
						"Thông tin tài khoản, chẳng hạn như tên, địa chỉ email, dữ liệu xác thực mật khẩu, ảnh hồ sơ và tùy chọn workspace của bạn.",
						"Thông tin tài khoản đã kết nối, chẳng hạn như mã định danh tài khoản Google, Facebook và Instagram, thông tin hồ sơ, access token, phạm vi quyền đã cấp, thời hạn token và trạng thái kết nối.",
						"Thông tin quy trình của creator, chẳng hạn như mã định danh tài khoản Instagram mà bạn kết nối, URL bài đăng hoặc Reel, từ khóa, nội dung trả lời công khai, đích liên kết DM, trạng thái quy tắc và phân tích hiệu quả gửi.",
						"Thông tin sử dụng và thiết bị, chẳng hạn như dữ liệu nhật ký, loại trình duyệt, khu vực gần đúng, các trang đã xem, tương tác với tính năng, sự kiện chẩn đoán và cookie hoặc mã định danh công nghệ tương tự.",
						"Thông tin thanh toán và gói đăng ký, nếu các gói trả phí được bật, chẳng hạn như gói, trạng thái thanh toán, hóa đơn và tham chiếu từ đơn vị xử lý thanh toán. Chúng tôi không lưu trữ đầy đủ số thẻ.",
						"Trao đổi hỗ trợ, chẳng hạn như tin nhắn bạn gửi cho chúng tôi, tệp đính kèm bạn chọn cung cấp và ngữ cảnh khắc phục sự cố liên quan.",
					],
				},
				{
					title: "Cách chúng tôi sử dụng thông tin",
					items: [
						"Cung cấp, bảo mật và duy trì dịch vụ CommentVia.",
						"Tạo và quản lý tài khoản, phiên đăng nhập, workspace, quy tắc, tích hợp và yêu cầu hỗ trợ.",
						"Xác thực người dùng bằng Google hoặc Facebook khi bạn chọn đăng nhập qua mạng xã hội.",
						"Gửi các liên kết được yêu cầu, hiển thị bản xem trước, đo lường hiệu suất quy tắc và cải thiện quy trình của creator.",
						"Ngăn chặn hành vi lạm dụng, khắc phục lỗi, thực thi Điều khoản của chúng tôi và bảo vệ người dùng cũng như dịch vụ.",
						"Gửi thông tin liên lạc về dịch vụ, bảo mật, thanh toán và sản phẩm.",
						"Tuân thủ các nghĩa vụ pháp lý, thuế, kế toán, nền tảng và quy định.",
					],
				},
				{
					title: "Cách chúng tôi chia sẻ thông tin",
					body: [
						"Chúng tôi không bán thông tin cá nhân. Chúng tôi chỉ chia sẻ thông tin khi cần để vận hành CommentVia, thực hiện theo hướng dẫn của bạn, tuân thủ pháp luật hoặc bảo vệ quyền lợi và sự an toàn.",
					],
					items: [
						"Các nhà cung cấp dịch vụ lưu trữ hạ tầng, xử lý xác thực, phân tích, thanh toán, hỗ trợ, email, nhật ký và hoạt động bảo mật.",
						"Các nhà cung cấp tích hợp, bao gồm Google, Meta, Facebook và Instagram, khi bạn kết nối tài khoản, đăng nhập hoặc cấu hình các quy trình phụ thuộc vào dịch vụ của các nền tảng đó.",
						"Cố vấn chuyên môn, cơ quan có thẩm quyền hoặc các bên liên quan khi thực sự cần thiết cho việc tuân thủ pháp luật, bảo mật, chuyển giao kinh doanh hoặc giải quyết tranh chấp.",
					],
				},
				{
					title: "Cookie và các công nghệ tương tự",
					body: [
						"Chúng tôi sử dụng cookie và các công nghệ tương tự cho mục đích xác thực, bảo mật, tùy chọn, phân tích và chẩn đoán sản phẩm. Bạn có thể kiểm soát cookie thông qua trình duyệt, nhưng việc tắt một số cookie có thể khiến ứng dụng không hoạt động đúng cách.",
					],
				},
				{
					title: "Lưu giữ",
					body: [
						"Chúng tôi lưu giữ thông tin trong thời gian cần thiết để cung cấp dịch vụ, tuân thủ nghĩa vụ pháp lý, giải quyết tranh chấp, duy trì bảo mật và thực thi thỏa thuận. Khi thông tin không còn cần thiết, chúng tôi sẽ xóa, khử định danh hoặc tổng hợp thông tin đó khi có thể thực hiện được.",
					],
				},
				{
					title: "Bảo mật",
					body: [
						"Chúng tôi sử dụng các biện pháp bảo vệ về hành chính, kỹ thuật và tổ chức được thiết kế để bảo vệ thông tin. Không dịch vụ internet nào có thể đảm bảo bảo mật tuyệt đối, vì vậy vui lòng sử dụng mật khẩu mạnh, bảo vệ thiết bị của bạn và liên hệ với chúng tôi nếu bạn cho rằng tài khoản của mình có nguy cơ bị xâm phạm.",
					],
				},
				{
					title: "Lựa chọn và quyền của bạn",
					items: [
						"Bạn có thể truy cập, cập nhật, xuất hoặc xóa một số thông tin tài khoản nhất định thông qua ứng dụng hoặc bằng cách liên hệ với chúng tôi.",
						"Tùy thuộc vào nơi bạn sinh sống, bạn có thể có quyền được biết, truy cập, chỉnh sửa, xóa, hạn chế, phản đối, chuyển dữ liệu hoặc từ chối một số hoạt động xử lý nhất định.",
						"Cư dân California có thể yêu cầu thông tin về các danh mục thông tin cá nhân được thu thập, nguồn thu thập, mục đích, các tiết lộ và có thể yêu cầu chỉnh sửa hoặc xóa khi áp dụng.",
						"Người dùng tại Khu vực Kinh tế Châu Âu, Vương quốc Anh và các khu vực tương tự cũng có thể có các quyền liên quan đến cơ sở pháp lý, khiếu nại tới cơ quan giám sát và chuyển dữ liệu quốc tế.",
					],
				},
				{
					title: "Chuyển dữ liệu quốc tế",
					body: [
						"CommentVia có thể xử lý thông tin tại các quốc gia khác với nơi bạn sinh sống. Khi được yêu cầu, chúng tôi sử dụng các biện pháp bảo vệ phù hợp cho việc chuyển dữ liệu quốc tế.",
					],
				},
				{
					title: "Trẻ em",
					body: [
						"CommentVia không hướng đến trẻ em dưới 13 tuổi và chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em. Nếu bạn tin rằng một trẻ em đã cung cấp thông tin, hãy liên hệ với chúng tôi để chúng tôi có thể thực hiện hành động phù hợp.",
					],
				},
				{
					title: "Thay đổi và liên hệ",
					body: [
						"Chúng tôi có thể cập nhật Chính sách quyền riêng tư này khi dịch vụ thay đổi. Nếu các thay đổi là quan trọng, chúng tôi sẽ thực hiện các bước hợp lý để thông báo cho người dùng. Liên hệ khanhduyvt0101@gmail.com nếu bạn có yêu cầu hoặc câu hỏi về quyền riêng tư.",
					],
				},
			],
		},
		terms: {
			title: "Điều khoản dịch vụ",
			description:
				"Các quy định về việc sử dụng CommentVia, bao gồm tài khoản, sử dụng được chấp nhận, gói đăng ký, tích hợp, nội dung và trách nhiệm pháp lý.",
			lastUpdated: "Ngày 28 tháng 6 năm 2026",
			intro: [
				"Các Điều khoản dịch vụ này điều chỉnh quyền truy cập và việc sử dụng CommentVia của bạn. Bằng việc tạo tài khoản, kết nối tích hợp hoặc sử dụng dịch vụ, bạn đồng ý với các Điều khoản này.",
				"Nếu bạn sử dụng CommentVia cho một công ty hoặc khách hàng, bạn xác nhận rằng bạn có thẩm quyền chấp nhận các Điều khoản này thay mặt cho tổ chức đó.",
			],
			sections: [
				{
					title: "Dịch vụ",
					body: [
						"CommentVia cung cấp các công cụ để nhà sáng tạo nội dung và doanh nghiệp cấu hình quy trình từ bình luận Instagram đến DM, quản lý quy tắc từ khóa, xem trước phản hồi và xem xét phân tích hiệu suất. Các tính năng có thể thay đổi khi chúng tôi cải thiện dịch vụ hoặc đáp ứng các yêu cầu của nền tảng.",
					],
				},
				{
					title: "Tài khoản và Bảo mật",
					items: [
						"Bạn phải cung cấp thông tin tài khoản chính xác và luôn cập nhật thông tin đó.",
						"Bạn chịu trách nhiệm về hoạt động trong tài khoản của mình và việc bảo vệ mật khẩu, phiên đăng nhập cũng như các tài khoản đã kết nối.",
						"Bạn phải thông báo cho chúng tôi kịp thời nếu nghi ngờ có truy cập trái phép hoặc hành vi sử dụng sai mục đích.",
					],
				},
				{
					title: "Nội dung và Dữ liệu của bạn",
					body: [
						"Bạn giữ quyền sở hữu đối với nội dung và dữ liệu bạn gửi đến CommentVia, bao gồm văn bản quy tắc, liên kết, từ khóa, cấu hình tài khoản và dữ liệu quy trình đã kết nối. Bạn cấp cho CommentVia các quyền cần thiết để lưu trữ, xử lý, truyền tải, hiển thị và sử dụng nội dung đó nhằm cung cấp và cải thiện dịch vụ.",
					],
				},
				{
					title: "Sử dụng được chấp nhận",
					items: [
						"Không sử dụng CommentVia cho spam, tin nhắn lừa đảo, quảng bá trái pháp luật, quấy rối hoặc nội dung vi phạm quy tắc của nền tảng.",
						"Không đảo ngược kỹ thuật, gây quá tải, thu thập dữ liệu, làm gián đoạn hoặc vượt qua các biện pháp kiểm soát bảo mật của dịch vụ.",
						"Không tải lên mã độc hoặc sử dụng CommentVia để truyền tải tài liệu gây hại, vi phạm quyền hoặc bất hợp pháp.",
						"Không trình bày sai lệch về danh tính, quyền hạn, sản phẩm, giá cả hoặc mối liên kết của bạn.",
					],
				},
				{
					title: "Instagram và Nền tảng của bên thứ ba",
					body: [
						"CommentVia phụ thuộc vào các dịch vụ của bên thứ ba như Meta và Instagram. Việc bạn sử dụng các dịch vụ đó chịu sự điều chỉnh của các điều khoản, chính sách, quyền, quy trình xét duyệt, giới hạn tần suất và tính khả dụng của họ. Chúng tôi không chịu trách nhiệm về các thay đổi, sự cố ngừng hoạt động, hành động đối với tài khoản hoặc quyết định cấp quyền của nền tảng bên thứ ba.",
					],
				},
				{
					title: "Gói đăng ký và Thanh toán",
					body: [
						"Nếu có cung cấp các gói trả phí, phí, kỳ thanh toán, điều khoản gia hạn và mức sử dụng bao gồm sẽ được hiển thị khi thanh toán hoặc trong ứng dụng. Trừ khi có quy định khác, gói đăng ký sẽ tự động gia hạn cho đến khi bị hủy. Có thể áp dụng thuế. Các khoản thanh toán có thể được xử lý bởi nhà cung cấp bên thứ ba.",
					],
				},
				{
					title: "Tính năng Beta",
					body: [
						"Chúng tôi có thể cung cấp bản xem trước, tính năng beta, mẫu hoặc tích hợp thử nghiệm. Những nội dung này có thể được thay đổi, giới hạn hoặc ngừng cung cấp bất kỳ lúc nào và có thể kém ổn định hơn các tính năng được cung cấp rộng rãi.",
					],
				},
				{
					title: "Tạm ngừng và Chấm dứt",
					body: [
						"Bạn có thể ngừng sử dụng CommentVia bất cứ lúc nào. Chúng tôi có thể tạm ngừng hoặc chấm dứt quyền truy cập nếu bạn vi phạm các Điều khoản này, tạo ra rủi ro bảo mật hoặc pháp lý, không thanh toán các khoản nợ, hoặc sử dụng dịch vụ theo cách có thể gây hại cho người dùng, nền tảng hoặc CommentVia.",
					],
				},
				{
					title: "Tuyên bố miễn trừ trách nhiệm",
					body: [
						"CommentVia được cung cấp trên cơ sở “nguyên trạng” và “tùy theo khả năng cung cấp”. Chúng tôi không đảm bảo tính khả dụng không gián đoạn, kết quả bán hàng cụ thể, phê duyệt của nền tảng, việc gửi tin nhắn hoặc hoạt động không có lỗi.",
					],
				},
				{
					title: "Giới hạn trách nhiệm",
					body: [
						"Trong phạm vi tối đa được pháp luật cho phép, CommentVia sẽ không chịu trách nhiệm đối với các thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, mang tính hệ quả, mang tính răn đe hoặc trừng phạt, hoặc đối với lợi nhuận, doanh thu, uy tín, dữ liệu hoặc cơ hội kinh doanh bị mất. Tổng trách nhiệm của chúng tôi đối với các khiếu nại liên quan đến dịch vụ được giới hạn ở số tiền bạn đã thanh toán cho CommentVia cho dịch vụ trong 12 tháng trước khi phát sinh khiếu nại.",
					],
				},
				{
					title: "Thay đổi và Liên hệ",
					body: [
						"Chúng tôi có thể cập nhật các Điều khoản này khi dịch vụ thay đổi. Việc tiếp tục sử dụng sau khi cập nhật đồng nghĩa với việc bạn chấp nhận các Điều khoản đã sửa đổi. Liên hệ khanhduyvt0101@gmail.com nếu bạn có câu hỏi về các Điều khoản này.",
					],
				},
			],
		},
		"data-deletion": {
			title: "Hướng dẫn xóa dữ liệu",
			description:
				"Cách yêu cầu xóa tài khoản CommentVia và dữ liệu kết nối Meta, Instagram, Facebook và Google.",
			lastUpdated: "28 tháng 6, 2026",
			intro: [
				"Bạn có thể yêu cầu xóa dữ liệu tài khoản CommentVia và dữ liệu nền tảng đã kết nối của mình bất kỳ lúc nào.",
				"Trang này được cung cấp cho Meta App Review, xác minh Google OAuth và người dùng muốn xóa dữ liệu liên quan đến các tài khoản Instagram, Facebook hoặc Google đã kết nối.",
			],
			sections: [
				{
					title: "Cách yêu cầu xóa",
					items: [
						"Gửi email đến khanhduyvt0101@gmail.com từ địa chỉ email liên kết với tài khoản CommentVia của bạn.",
						"Sử dụng dòng tiêu đề: CommentVia data deletion request.",
						"Cho chúng tôi biết bạn muốn chỉ xóa dữ liệu nền tảng đã kết nối hay xóa toàn bộ tài khoản CommentVia của mình.",
					],
				},
				{
					title: "Những gì chúng tôi xóa",
					items: [
						"Thông tin hồ sơ tài khoản, tùy chọn workspace, phiên đăng nhập và hồ sơ xác thực trong phạm vi pháp luật cho phép.",
						"Mã định danh và token của tài khoản Instagram, Facebook và Google đã kết nối được CommentVia lưu trữ.",
						"Quy tắc tự động hóa, URL bài đăng, từ khóa, phản hồi công khai, đích liên kết DM và phân tích liên quan gắn với workspace của bạn.",
					],
				},
				{
					title: "Callback xóa dữ liệu của Meta",
					body: [
						"Khi Meta gửi yêu cầu xóa dữ liệu đã ký, CommentVia xác minh yêu cầu và trả về mã xác nhận kèm URL trạng thái. Sau đó, chúng tôi xóa dữ liệu liên quan đến người dùng Meta hoặc tài khoản doanh nghiệp đã kết nối nếu dữ liệu đó tồn tại trong hệ thống của chúng tôi.",
					],
				},
				{
					title: "Ngoại lệ về lưu giữ",
					body: [
						"Chúng tôi có thể lưu giữ một số hồ sơ giới hạn khi cần thiết cho mục đích bảo mật, phòng chống gian lận, tuân thủ pháp luật, kế toán, giải quyết tranh chấp hoặc khôi phục sao lưu. Các hồ sơ được lưu giữ sẽ bị xóa hoặc khử định danh khi không còn cần thiết.",
					],
				},
				{
					title: "Thời gian xử lý",
					body: [
						"Chúng tôi đặt mục tiêu hoàn tất các yêu cầu xóa trong vòng 30 ngày, trừ khi pháp luật, việc rà soát bảo mật hoặc xác minh của nền tảng yêu cầu thời gian dài hơn.",
					],
				},
			],
		},
	},
	es: {
		privacy: {
			title: "Política de privacidad",
			description:
				"Cómo CommentVia recopila, usa, comparte, conserva y protege la información del sitio web y la app de CommentVia.",
			lastUpdated: "28 de junio de 2026",
			intro: [
				"Esta Política de privacidad explica cómo CommentVia recopila y usa información cuando visitas nuestro sitio web, creas una cuenta, conectas flujos de trabajo de comercio para creadores o usas nuestras herramientas de automatización de comentarios a DM.",
				"Redactamos este aviso para explicar con claridad las categorías de información que tratamos, los motivos por los que la usamos, los servicios en los que nos apoyamos y las opciones disponibles para ti.",
			],
			sections: [
				{
					title: "Información que recopilamos",
					items: [
						"Información de la cuenta, como tu nombre, dirección de correo electrónico, datos de autenticación de contraseña, imagen de perfil y preferencias del espacio de trabajo.",
						"Información de cuentas conectadas, como identificadores de cuentas de Google, Facebook e Instagram, datos del perfil, tokens de acceso, permisos concedidos, vencimiento de tokens y estado de conexión.",
						"Información de flujos de trabajo de creadores, como identificadores de cuentas de Instagram que conectas, URLs de publicaciones o Reel, palabras clave, texto de respuesta pública, destinos de enlaces de DM, estado de reglas y analíticas de entrega.",
						"Información de uso y del dispositivo, como datos de registro, tipo de navegador, región aproximada, páginas vistas, interacciones con funciones, eventos de diagnóstico e identificadores de cookies o tecnologías similares.",
						"Información de pagos y suscripciones, si los planes de pago están habilitados, como plan, estado de facturación, facturas y referencias del procesador de pagos. No almacenamos números completos de tarjetas.",
						"Comunicaciones de soporte, como los mensajes que nos envías, los archivos adjuntos que decides proporcionar y el contexto relacionado para la resolución de problemas.",
					],
				},
				{
					title: "Cómo usamos la información",
					items: [
						"Proporcionar, proteger y mantener el servicio de CommentVia.",
						"Crear y gestionar cuentas, sesiones, espacios de trabajo, reglas, integraciones y solicitudes de soporte.",
						"Autenticar usuarios con Google o Facebook cuando eliges iniciar sesión con redes sociales.",
						"Enviar enlaces solicitados, mostrar vistas previas, medir el rendimiento de las reglas y mejorar los flujos de trabajo de creadores.",
						"Prevenir abusos, solucionar errores, aplicar nuestros Términos y proteger a los usuarios y el servicio.",
						"Enviar comunicaciones de servicio, seguridad, facturación y producto.",
						"Cumplir obligaciones legales, fiscales, contables, de plataformas y regulatorias.",
					],
				},
				{
					title: "Cómo compartimos la información",
					body: [
						"No vendemos información personal. Compartimos información solo cuando es necesario para operar CommentVia, seguir tus instrucciones, cumplir la ley o proteger derechos y la seguridad.",
					],
					items: [
						"Proveedores de servicios que alojan infraestructura, procesan autenticación, analíticas, facturación, soporte, correo electrónico, registros y operaciones de seguridad.",
						"Proveedores de integraciones, incluidos Google, Meta, Facebook e Instagram, cuando conectas cuentas, inicias sesión o configuras flujos de trabajo que dependen de los servicios de esas plataformas.",
						"Asesores profesionales, autoridades o contrapartes cuando sea razonablemente necesario para el cumplimiento legal, la seguridad, transferencias empresariales o la resolución de disputas.",
					],
				},
				{
					title: "Cookies y tecnologías similares",
					body: [
						"Usamos cookies y tecnologías similares para autenticación, seguridad, preferencias, analíticas y diagnósticos del producto. Puedes controlar las cookies desde tu navegador, pero desactivar algunas cookies puede impedir que la app funcione correctamente.",
					],
				},
				{
					title: "Conservación",
					body: [
						"Conservamos la información durante el tiempo necesario para proporcionar el servicio, cumplir obligaciones legales, resolver disputas, mantener la seguridad y hacer cumplir acuerdos. Cuando la información deja de ser necesaria, la eliminamos, la desidentificamos o la agregamos cuando sea práctico.",
					],
				},
				{
					title: "Seguridad",
					body: [
						"Usamos medidas de protección administrativas, técnicas y organizativas diseñadas para proteger la información. Ningún servicio de internet puede garantizar una seguridad perfecta, así que usa una contraseña segura, protege tus dispositivos y contáctanos si crees que tu cuenta está en riesgo.",
					],
				},
				{
					title: "Tus opciones y derechos",
					items: [
						"Puedes acceder, actualizar, exportar o eliminar determinada información de la cuenta a través de la app o contactándonos.",
						"Según tu ubicación, puedes tener derechos a conocer, acceder, corregir, eliminar, restringir, oponerte, portar o excluirte de determinados tratamientos.",
						"Los residentes de California pueden solicitar información sobre las categorías de información personal recopilada, las fuentes, los fines y las divulgaciones, y pueden solicitar la corrección o eliminación cuando corresponda.",
						"Los usuarios del Espacio Económico Europeo, Reino Unido y regiones similares también pueden tener derechos relacionados con las bases legales, reclamaciones ante autoridades supervisoras y transferencias internacionales.",
					],
				},
				{
					title: "Transferencias internacionales",
					body: [
						"CommentVia puede tratar información en países distintos al país donde vives. Cuando sea necesario, usamos salvaguardas adecuadas para las transferencias internacionales.",
					],
				},
				{
					title: "Menores",
					body: [
						"CommentVia no está dirigido a menores de 13 años y no recopilamos de forma consciente información personal de menores. Si crees que un menor proporcionó información, contáctanos para que podamos tomar las medidas adecuadas.",
					],
				},
				{
					title: "Cambios y contacto",
					body: [
						"Podemos actualizar esta Política de privacidad a medida que el servicio cambie. Si los cambios son sustanciales, tomaremos medidas razonables para notificar a los usuarios. Contacta con khanhduyvt0101@gmail.com si tienes solicitudes o preguntas sobre privacidad.",
					],
				},
			],
		},
		terms: {
			title: "Términos del servicio",
			description:
				"Las reglas para usar CommentVia, incluidas cuentas, uso aceptable, suscripciones, integraciones, contenido y responsabilidad.",
			lastUpdated: "28 de junio de 2026",
			intro: [
				"Estos Términos del servicio rigen tu acceso y uso de CommentVia. Al crear una cuenta, conectar integraciones o usar el servicio, aceptas estos Términos.",
				"Si usas CommentVia para una empresa o cliente, confirmas que tienes autoridad para aceptar estos Términos en nombre de esa organización.",
			],
			sections: [
				{
					title: "El servicio",
					body: [
						"CommentVia proporciona herramientas para que creadores y empresas configuren flujos de trabajo de comentarios de Instagram a DM, gestionen reglas de palabras clave, previsualicen respuestas y revisen analíticas de rendimiento. Las funciones pueden cambiar a medida que mejoramos el servicio o respondemos a requisitos de la plataforma.",
					],
				},
				{
					title: "Cuentas y seguridad",
					items: [
						"Debes proporcionar información de cuenta precisa y mantenerla actualizada.",
						"Eres responsable de la actividad realizada en tu cuenta y de proteger contraseñas, sesiones y cuentas conectadas.",
						"Debes notificarnos de inmediato si sospechas de acceso no autorizado o uso indebido.",
					],
				},
				{
					title: "Tu contenido y datos",
					body: [
						"Conservas la propiedad del contenido y los datos que envías a CommentVia, incluido el texto de reglas, enlaces, palabras clave, configuración de cuenta y datos de flujos de trabajo conectados. Concedes a CommentVia los derechos necesarios para alojar, procesar, transmitir, mostrar y usar ese contenido con el fin de prestar y mejorar el servicio.",
					],
				},
				{
					title: "Uso aceptable",
					items: [
						"No uses CommentVia para spam, mensajes engañosos, promociones ilícitas, acoso o contenido que infrinja las normas de la plataforma.",
						"No realices ingeniería inversa, sobrecargues, extraigas datos, interrumpas ni eludas los controles de seguridad del servicio.",
						"No subas código malicioso ni uses CommentVia para transmitir material dañino, infractor o ilegal.",
						"No tergiverses tu identidad, permisos, productos, precios o afiliaciones.",
					],
				},
				{
					title: "Instagram y plataformas de terceros",
					body: [
						"CommentVia depende de servicios de terceros como Meta e Instagram. Tu uso de esos servicios está sujeto a sus términos, políticas, permisos, procesos de revisión, límites de tasa y disponibilidad. No somos responsables de cambios en plataformas de terceros, interrupciones, acciones sobre cuentas ni decisiones de permisos.",
					],
				},
				{
					title: "Suscripciones y pago",
					body: [
						"Si se ofrecen planes de pago, las tarifas, periodos de facturación, términos de renovación y uso incluido se mostrarán al finalizar la compra o en la app. Salvo que se indique lo contrario, las suscripciones se renuevan hasta que se cancelen. Pueden aplicarse impuestos. Los pagos pueden ser procesados por proveedores externos.",
					],
				},
				{
					title: "Funciones beta",
					body: [
						"Podemos ofrecer vistas previas, funciones beta, plantillas o integraciones experimentales. Estas pueden modificarse, limitarse o descontinuarse en cualquier momento y pueden ser menos fiables que las funciones disponibles de forma general.",
					],
				},
				{
					title: "Suspensión y terminación",
					body: [
						"Puedes dejar de usar CommentVia en cualquier momento. Podemos suspender o terminar el acceso si infringes estos Términos, generas riesgos de seguridad o legales, no pagas los importes adeudados o usas el servicio de una forma que pueda perjudicar a usuarios, plataformas o CommentVia.",
					],
				},
				{
					title: "Descargos de responsabilidad",
					body: [
						"CommentVia se proporciona “tal cual” y “según disponibilidad”. No garantizamos disponibilidad ininterrumpida, resultados de ventas específicos, aprobación de la plataforma, entrega de mensajes ni funcionamiento libre de errores.",
					],
				},
				{
					title: "Limitación de responsabilidad",
					body: [
						"En la máxima medida permitida por la ley, CommentVia no será responsable de daños indirectos, incidentales, especiales, consecuentes, ejemplares o punitivos, ni de pérdida de beneficios, ingresos, fondo de comercio, datos u oportunidades de negocio. Nuestra responsabilidad total por reclamaciones relacionadas con el servicio se limita a los importes que pagaste a CommentVia por el servicio en los 12 meses anteriores a la reclamación.",
					],
				},
				{
					title: "Cambios y contacto",
					body: [
						"Podemos actualizar estos Términos a medida que cambie el servicio. El uso continuado después de las actualizaciones significa que aceptas los Términos revisados. Contacta con khanhduyvt0101@gmail.com si tienes preguntas sobre estos Términos.",
					],
				},
			],
		},
		"data-deletion": {
			title: "Instrucciones para la eliminación de datos",
			description:
				"Cómo solicitar la eliminación de datos de cuenta de CommentVia y datos de conexión de Meta, Instagram, Facebook y Google.",
			lastUpdated: "28 de junio de 2026",
			intro: [
				"Puedes solicitar la eliminación de los datos de tu cuenta de CommentVia y de los datos de plataformas conectadas en cualquier momento.",
				"Esta página se proporciona para la revisión de aplicaciones de Meta, la verificación OAuth de Google y los usuarios que quieran eliminar datos asociados con cuentas conectadas de Instagram, Facebook o Google.",
			],
			sections: [
				{
					title: "Cómo solicitar la eliminación",
					items: [
						"Envía un correo a khanhduyvt0101@gmail.com desde la dirección de correo electrónico asociada con tu cuenta de CommentVia.",
						"Usa el asunto: Solicitud de eliminación de datos de CommentVia.",
						"Indícanos si quieres eliminar solo los datos de plataformas conectadas o tu cuenta de CommentVia completa.",
					],
				},
				{
					title: "Qué eliminamos",
					items: [
						"Información del perfil de cuenta, preferencias del espacio de trabajo, sesiones y registros de autenticación cuando la ley lo permita.",
						"Identificadores y tokens de cuentas conectadas de Instagram, Facebook y Google almacenados por CommentVia.",
						"Reglas de automatización, URL de publicaciones, palabras clave, respuestas públicas, destinos de enlaces de DM y analíticas relacionadas asociadas con tu espacio de trabajo.",
					],
				},
				{
					title: "Callback de eliminación de datos de Meta",
					body: [
						"Cuando Meta envía una solicitud firmada de eliminación de datos, CommentVia verifica la solicitud y devuelve un código de confirmación con una URL de estado. Luego eliminamos los datos asociados con el usuario de Meta o la cuenta empresarial conectada cuando existan en nuestros sistemas.",
					],
				},
				{
					title: "Excepciones de retención",
					body: [
						"Podemos conservar registros limitados cuando sea necesario por seguridad, prevención de fraude, cumplimiento legal, contabilidad, resolución de disputas o recuperación de copias de seguridad. Los registros conservados se eliminan o se desidentifican cuando ya no son necesarios.",
					],
				},
				{
					title: "Plazos",
					body: [
						"Nuestro objetivo es completar las solicitudes de eliminación en un plazo de 30 días, salvo que la ley, una revisión de seguridad o la verificación de la plataforma requieran un periodo más largo.",
					],
				},
			],
		},
	},
	zh: {
		privacy: {
			title: "隐私政策",
			description:
				"CommentVia 如何为 CommentVia 网站和应用收集、使用、共享、保留和保护信息。",
			lastUpdated: "2026年6月28日",
			intro: [
				"本隐私政策说明当您访问我们的网站、创建账户、连接创作者电商工作流，或使用我们的评论转 DM 自动化工具时，CommentVia 如何收集和使用信息。",
				"我们撰写本声明，旨在清晰说明我们处理的信息类别、使用信息的原因、所依赖的服务，以及您可作出的选择。",
			],
			sections: [
				{
					title: "我们收集的信息",
					items: [
						"账户信息，例如您的姓名、电子邮件地址、密码认证数据、个人资料图片和工作区偏好设置。",
						"已连接账户信息，例如 Google、Facebook 和 Instagram 账户标识符、个人资料详情、访问令牌、已授予的权限范围、令牌到期时间和连接状态。",
						"创作者工作流信息，例如您连接的 Instagram 账户标识符、帖子或 Reel URL、关键词、公开回复文本、DM 链接目标、规则状态和投递分析数据。",
						"使用情况和设备信息，例如日志数据、浏览器类型、大致地区、浏览过的页面、功能交互、诊断事件，以及 Cookie 或类似技术标识符。",
						"支付和订阅信息（如果已启用付费计划），例如计划、账单状态、发票和支付处理方引用信息。我们不会存储完整的银行卡号。",
						"支持沟通信息，例如您发送给我们的消息、您选择提供的附件，以及相关的故障排查上下文。",
					],
				},
				{
					title: "我们如何使用信息",
					items: [
						"提供、保障并维护 CommentVia 服务。",
						"创建和管理账户、会话、工作区、规则、集成和支持请求。",
						"当您选择社交登录时，通过 Google 或 Facebook 对用户进行身份验证。",
						"发送所请求的链接、显示预览、衡量规则表现，并改进创作者工作流。",
						"防止滥用、排查错误、执行我们的条款，并保护用户和服务。",
						"发送服务、安全、账单和产品相关通信。",
						"遵守法律、税务、会计、平台和监管义务。",
					],
				},
				{
					title: "我们如何共享信息",
					body: [
						"我们不会出售个人信息。我们仅在运营 CommentVia、遵循您的指示、遵守法律，或保护权利与安全所需时共享信息。",
					],
					items: [
						"为基础设施托管、身份验证处理、分析、账单、支持、电子邮件、日志和安全运营提供服务的服务提供商。",
						"集成提供商，包括 Google、Meta、Facebook 和 Instagram；当您连接账户、登录，或配置依赖这些平台服务的工作流时，我们会与其共享相关信息。",
						"在为法律合规、安全、业务转让或争议解决而有合理必要时，与专业顾问、主管机关或交易相对方共享。",
					],
				},
				{
					title: "Cookie 和类似技术",
					body: [
						"我们使用 Cookie 和类似技术用于身份验证、安全、偏好设置、分析和产品诊断。您可以通过浏览器控制 Cookie，但禁用某些 Cookie 可能会导致应用无法正常运行。",
					],
				},
				{
					title: "保留",
					body: [
						"我们会在提供服务、遵守法律义务、解决争议、维护安全和执行协议所需的期间保留信息。当信息不再需要时，我们会在可行情况下将其删除、去标识化或汇总处理。",
					],
				},
				{
					title: "安全",
					body: [
						"我们采用旨在保护信息的管理、技术和组织保障措施。任何互联网服务都无法保证绝对安全，因此请使用强密码、保护好您的设备；如果您认为账户存在风险，请联系我们。",
					],
				},
				{
					title: "您的选择和权利",
					items: [
						"您可以通过应用或联系我们来访问、更新、导出或删除某些账户信息。",
						"根据您所在地区，您可能享有了解、访问、更正、删除、限制、反对、移植或选择退出某些处理活动的权利。",
						"加利福尼亚州居民可以请求获取关于所收集个人信息类别、来源、目的和披露情况的信息，并可在适用情况下请求更正或删除。",
						"欧洲经济区、英国及类似地区的用户还可能享有与法律依据、向监管机构投诉以及国际传输相关的权利。",
					],
				},
				{
					title: "国际传输",
					body: [
						"CommentVia 可能会在您居住地以外的国家/地区处理信息。在有要求时，我们会为国际传输采用适当的保障措施。",
					],
				},
				{
					title: "儿童",
					body: [
						"CommentVia 并非面向 13 岁以下儿童，我们不会故意收集儿童的个人信息。如果您认为有儿童提供了信息，请联系我们，以便我们采取适当措施。",
					],
				},
				{
					title: "变更与联系",
					body: [
						"随着服务变化，我们可能会更新本隐私政策。如果变更属于重大变更，我们将采取合理措施通知用户。如有隐私请求或疑问，请联系 khanhduyvt0101@gmail.com。",
					],
				},
			],
		},
		terms: {
			title: "服务条款",
			description:
				"使用 CommentVia 的规则，包括账户、可接受使用、订阅、集成、内容和责任。",
			lastUpdated: "2026年6月28日",
			intro: [
				"本服务条款约束您对 CommentVia 的访问和使用。创建账户、连接集成或使用本服务，即表示您同意本条款。",
				"如果您代表公司或客户使用 CommentVia，则您确认您有权代表该组织接受本条款。",
			],
			sections: [
				{
					title: "服务",
					body: [
						"CommentVia 为创作者和企业提供工具，用于配置 Instagram 评论转 DM 工作流、管理关键词规则、预览回复并查看效果分析。随着我们改进服务或响应平台要求，功能可能会发生变化。",
					],
				},
				{
					title: "账户与安全",
					items: [
						"你必须提供准确的账户信息，并保持信息最新。",
						"你需对你账户下的活动负责，并负责保护密码、会话和已连接账户的安全。",
						"如果你怀疑存在未经授权的访问或滥用行为，必须及时通知我们。",
					],
				},
				{
					title: "你的内容和数据",
					body: [
						"你保留提交至 CommentVia 的内容和数据的所有权，包括规则文本、链接、关键词、账户配置以及已连接的工作流数据。你授予 CommentVia 为提供和改进服务所需的权利，以托管、处理、传输、展示和使用该等内容。",
					],
				},
				{
					title: "可接受的使用方式",
					items: [
						"不得将 CommentVia 用于垃圾信息、欺骗性消息、违法推广、骚扰，或违反平台规则的内容。",
						"不得对服务进行逆向工程、过载、抓取、干扰，或绕过安全控制。",
						"不得上传恶意代码，或使用 CommentVia 传输有害、侵权或非法材料。",
						"不得歪曲你的身份、权限、产品、价格或关联关系。",
					],
				},
				{
					title: "Instagram 和第三方平台",
					body: [
						"CommentVia 依赖 Meta 和 Instagram 等第三方服务。你对这些服务的使用受其条款、政策、权限、审核流程、速率限制和可用性约束。我们不对第三方平台变更、故障、账户操作或权限决策负责。",
					],
				},
				{
					title: "订阅与付款",
					body: [
						"如果提供付费方案，费用、计费周期、续订条款和包含的使用量将在结账时或应用内显示。除非另有说明，订阅会持续续订，直至取消。可能适用税费。付款可能由第三方提供商处理。",
					],
				},
				{
					title: "Beta 功能",
					body: [
						"我们可能提供预览版、Beta 功能、模板或实验性集成。这些内容可能随时被更改、限制或停止提供，并且可靠性可能低于正式可用功能。",
					],
				},
				{
					title: "暂停与终止",
					body: [
						"你可以随时停止使用 CommentVia。如果你违反本条款、造成安全或法律风险、未支付应付款项，或以可能损害用户、平台或 CommentVia 的方式使用服务，我们可能会暂停或终止你的访问权限。",
					],
				},
				{
					title: "免责声明",
					body: [
						"CommentVia 按“现状”和“可用状态”提供。我们不保证服务不间断可用、实现特定销售结果、获得平台批准、消息成功送达或无错误运行。",
					],
				},
				{
					title: "责任限制",
					body: [
						"在法律允许的最大范围内，CommentVia 不对间接、附带、特殊、后果性、惩戒性或惩罚性损害承担责任，也不对利润、收入、商誉、数据或商业机会的损失承担责任。我们对与服务相关的索赔所承担的总责任，以你在索赔发生前 12 个月内为该服务向 CommentVia 支付的金额为限。",
					],
				},
				{
					title: "变更与联系",
					body: [
						"随着服务变化，我们可能会更新本条款。更新后继续使用即表示你接受修订后的条款。如对本条款有疑问，请联系 khanhduyvt0101@gmail.com。",
					],
				},
			],
		},
		"data-deletion": {
			title: "数据删除说明",
			description:
				"如何请求删除 CommentVia 账户、Meta、Instagram、Facebook 和 Google 连接数据。",
			lastUpdated: "2026年6月28日",
			intro: [
				"你可以随时请求删除你的 CommentVia 账户数据和已连接平台数据。",
				"本页面用于 Meta App Review、Google OAuth 验证，以及希望移除与已连接 Instagram、Facebook 或 Google 账户相关数据的用户。",
			],
			sections: [
				{
					title: "如何请求删除",
					items: [
						"请使用与你的 CommentVia 账户关联的电子邮件地址发送邮件至 khanhduyvt0101@gmail.com。",
						"邮件主题请使用：CommentVia data deletion request。",
						"请告知我们你是只想删除已连接平台数据，还是要删除完整的 CommentVia 账户。",
					],
				},
				{
					title: "我们会删除的内容",
					items: [
						"在法律允许的情况下，删除账户资料信息、工作区偏好设置、会话和身份验证记录。",
						"CommentVia 存储的已连接 Instagram、Facebook 和 Google 账户标识符与令牌。",
						"与你的工作区相关的自动化规则、帖子 URL、关键词、公开回复、DM 链接目标地址以及相关分析数据。",
					],
				},
				{
					title: "Meta 数据删除回调",
					body: [
						"当 Meta 发送已签名的数据删除请求时，CommentVia 会验证该请求，并返回包含状态 URL 的确认代码。随后，我们会移除我们系统中存在的、与该 Meta 用户或已连接企业账户相关的数据。",
					],
				},
				{
					title: "保留例外",
					body: [
						"在安全、欺诈预防、法律合规、会计、争议解决或备份恢复需要时，我们可能会保留有限记录。当不再需要时，保留记录会被删除或去标识化。",
					],
				},
				{
					title: "处理时间",
					body: [
						"除非法律、安全审查或平台验证要求更长时间，我们力争在 30 天内完成删除请求。",
					],
				},
			],
		},
	},
	hi: {
		privacy: {
			title: "गोपनीयता नीति",
			description:
				"CommentVia वेबसाइट और ऐप के लिए CommentVia जानकारी कैसे एकत्र करता है, उसका उपयोग, साझा, संग्रहण और सुरक्षा कैसे करता है।",
			lastUpdated: "28 जून, 2026",
			intro: [
				"यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट पर जाते हैं, खाता बनाते हैं, creator-commerce workflows कनेक्ट करते हैं, या हमारे comment-to-DM automation tools का उपयोग करते हैं, तो CommentVia जानकारी कैसे एकत्र करता है और उसका उपयोग कैसे करता है।",
				"हमने यह सूचना इसलिए लिखी है ताकि हम जिन जानकारी श्रेणियों को संभालते हैं, उनका उपयोग करने के कारण, जिन सेवाओं पर हम निर्भर करते हैं, और आपके लिए उपलब्ध विकल्पों के बारे में स्पष्ट रहें।",
			],
			sections: [
				{
					title: "हम कौन-सी जानकारी एकत्र करते हैं",
					items: [
						"खाता जानकारी, जैसे आपका नाम, ईमेल पता, पासवर्ड प्रमाणीकरण डेटा, प्रोफ़ाइल इमेज, और workspace प्राथमिकताएँ।",
						"कनेक्टेड खाता जानकारी, जैसे Google, Facebook, और Instagram खाता पहचानकर्ता, प्रोफ़ाइल विवरण, access tokens, granted scopes, token expiry, और connection status।",
						"क्रिएटर workflow जानकारी, जैसे आपके द्वारा कनेक्ट किए गए Instagram खाता पहचानकर्ता, पोस्ट या Reel URLs, keywords, public reply text, DM link destinations, rule status, और delivery analytics।",
						"उपयोग और डिवाइस जानकारी, जैसे log data, browser type, approximate region, देखे गए पेज, feature interactions, diagnostic events, और cookie या समान technology identifiers।",
						"भुगतान और सदस्यता जानकारी, यदि paid plans सक्षम हैं, जैसे plan, billing status, invoices, और payment processor references। हम पूरे कार्ड नंबर संग्रहीत नहीं करते।",
						"सहायता संचार, जैसे वे संदेश जो आप हमें भेजते हैं, वे attachments जिन्हें आप उपलब्ध कराना चुनते हैं, और संबंधित troubleshooting context।",
					],
				},
				{
					title: "हम जानकारी का उपयोग कैसे करते हैं",
					items: [
						"CommentVia सेवा प्रदान करना, सुरक्षित रखना और बनाए रखना।",
						"खाते, sessions, workspaces, rules, integrations, और support requests बनाना और प्रबंधित करना।",
						"जब आप social sign-in चुनते हैं, तो Google या Facebook के साथ users को authenticate करना।",
						"अनुरोधित links भेजना, previews दिखाना, rule performance मापना, और creator workflows को बेहतर बनाना।",
						"दुरुपयोग रोकना, त्रुटियों का समाधान करना, हमारी शर्तों को लागू करना, और users तथा सेवा की सुरक्षा करना।",
						"सेवा, सुरक्षा, billing, और product communications भेजना।",
						"कानूनी, कर, accounting, platform, और regulatory obligations का पालन करना।",
					],
				},
				{
					title: "हम जानकारी कैसे साझा करते हैं",
					body: [
						"हम व्यक्तिगत जानकारी नहीं बेचते। हम जानकारी केवल तब साझा करते हैं जब CommentVia चलाने, आपके निर्देशों का पालन करने, कानून का अनुपालन करने, या अधिकारों और सुरक्षा की रक्षा करने के लिए आवश्यक हो।",
					],
					items: [
						"Service providers जो infrastructure host करते हैं, authentication, analytics, billing, support, email, logs, और security operations process करते हैं।",
						"Integration providers, जिनमें Google, Meta, Facebook, और Instagram शामिल हैं, जब आप खाते कनेक्ट करते हैं, sign in करते हैं, या उन platform services पर निर्भर workflows configure करते हैं।",
						"Professional advisors, authorities, या counterparties जब कानूनी अनुपालन, सुरक्षा, business transfers, या dispute resolution के लिए उचित रूप से आवश्यक हो।",
					],
				},
				{
					title: "Cookies और समान Technologies",
					body: [
						"हम authentication, security, preferences, analytics, और product diagnostics के लिए cookies और समान technologies का उपयोग करते हैं। आप अपने browser के माध्यम से cookies नियंत्रित कर सकते हैं, लेकिन कुछ cookies को disable करने से app सही ढंग से काम नहीं कर सकता।",
					],
				},
				{
					title: "संग्रहण अवधि",
					body: [
						"हम जानकारी को सेवा प्रदान करने, कानूनी obligations का पालन करने, disputes हल करने, सुरक्षा बनाए रखने, और agreements लागू करने के लिए जितनी देर आवश्यक हो उतनी देर रखते हैं। जब जानकारी की आवश्यकता नहीं रहती, तो जहाँ व्यावहारिक हो हम उसे delete, de-identify, या aggregate कर देते हैं।",
					],
				},
				{
					title: "सुरक्षा",
					body: [
						"हम जानकारी की सुरक्षा के लिए बनाए गए administrative, technical, और organizational safeguards का उपयोग करते हैं। कोई भी internet service पूर्ण सुरक्षा की guarantee नहीं दे सकती, इसलिए कृपया मजबूत password का उपयोग करें, अपने devices की सुरक्षा करें, और यदि आपको लगता है कि आपका account जोखिम में है तो हमसे संपर्क करें।",
					],
				},
				{
					title: "आपके विकल्प और अधिकार",
					items: [
						"आप app के माध्यम से या हमसे संपर्क करके कुछ account information access, update, export, या delete कर सकते हैं।",
						"आपके location के आधार पर, आपको कुछ processing के बारे में जानने, access करने, correct करने, delete करने, restrict करने, object करने, port करने, या opt out करने के अधिकार हो सकते हैं।",
						"California निवासी एकत्र की गई personal information की categories, sources, purposes, disclosures के बारे में जानकारी का अनुरोध कर सकते हैं, और जहाँ लागू हो correction या deletion का अनुरोध कर सकते हैं।",
						"European Economic Area, United Kingdom, और समान क्षेत्रों के users के पास legal bases, supervisory authority complaints, और international transfers से संबंधित अधिकार भी हो सकते हैं।",
					],
				},
				{
					title: "अंतरराष्ट्रीय Transfers",
					body: [
						"CommentVia आपकी रहने की जगह के अलावा अन्य देशों में जानकारी process कर सकता है। जहाँ आवश्यक हो, हम international transfers के लिए उपयुक्त safeguards का उपयोग करते हैं।",
					],
				},
				{
					title: "बच्चे",
					body: [
						"CommentVia 13 वर्ष से कम उम्र के बच्चों के लिए निर्देशित नहीं है, और हम जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि आपको लगता है कि किसी बच्चे ने जानकारी प्रदान की है, तो हमसे संपर्क करें ताकि हम उचित कार्रवाई कर सकें।",
					],
				},
				{
					title: "बदलाव और संपर्क",
					body: [
						"सेवा में बदलाव होने पर हम इस गोपनीयता नीति को update कर सकते हैं। यदि बदलाव महत्वपूर्ण हैं, तो हम users को notify करने के लिए उचित कदम उठाएँगे। गोपनीयता requests या questions के लिए khanhduyvt0101@gmail.com पर संपर्क करें।",
					],
				},
			],
		},
		terms: {
			title: "सेवा की शर्तें",
			description:
				"CommentVia का उपयोग करने के नियम, जिनमें accounts, acceptable use, subscriptions, integrations, content, और liability शामिल हैं।",
			lastUpdated: "28 जून, 2026",
			intro: [
				"ये सेवा की शर्तें CommentVia तक आपकी access और उसके उपयोग को नियंत्रित करती हैं। खाता बनाकर, integrations कनेक्ट करके, या सेवा का उपयोग करके, आप इन शर्तों से सहमत होते हैं।",
				"यदि आप किसी company या client के लिए CommentVia का उपयोग करते हैं, तो आप पुष्टि करते हैं कि आपके पास उस organization के लिए इन शर्तों को स्वीकार करने का अधिकार है।",
			],
			sections: [
				{
					title: "सेवा",
					body: [
						"CommentVia क्रिएटर्स और व्यवसायों को Instagram comment-to-DM वर्कफ़्लो कॉन्फ़िगर करने, कीवर्ड नियम प्रबंधित करने, जवाबों का प्रीव्यू देखने और प्रदर्शन एनालिटिक्स की समीक्षा करने के टूल प्रदान करता है। जैसे-जैसे हम सेवा को बेहतर बनाते हैं या प्लेटफ़ॉर्म आवश्यकताओं का पालन करते हैं, फीचर्स बदल सकते हैं।",
					],
				},
				{
					title: "अकाउंट और सुरक्षा",
					items: [
						"आपको सटीक अकाउंट जानकारी देनी होगी और उसे अपडेट रखना होगा।",
						"आपके अकाउंट के अंतर्गत होने वाली गतिविधि और पासवर्ड, सेशन तथा कनेक्टेड अकाउंट की सुरक्षा के लिए आप जिम्मेदार हैं।",
						"यदि आपको अनधिकृत एक्सेस या दुरुपयोग का संदेह हो, तो आपको हमें तुरंत सूचित करना होगा।",
					],
				},
				{
					title: "आपका कंटेंट और डेटा",
					body: [
						"CommentVia में आपके द्वारा सबमिट किए गए कंटेंट और डेटा का स्वामित्व आपके पास रहता है, जिसमें नियमों का टेक्स्ट, लिंक, कीवर्ड, अकाउंट कॉन्फ़िगरेशन और कनेक्टेड वर्कफ़्लो डेटा शामिल हैं। आप CommentVia को सेवा प्रदान करने और उसे बेहतर बनाने के लिए उस कंटेंट को होस्ट, प्रोसेस, ट्रांसमिट, प्रदर्शित और उपयोग करने हेतु आवश्यक अधिकार देते हैं।",
					],
				},
				{
					title: "स्वीकार्य उपयोग",
					items: [
						"CommentVia का उपयोग स्पैम, भ्रामक संदेश, गैरकानूनी प्रमोशन, उत्पीड़न या प्लेटफ़ॉर्म नियमों का उल्लंघन करने वाले कंटेंट के लिए न करें।",
						"सेवा के सुरक्षा नियंत्रणों को रिवर्स इंजीनियर, ओवरलोड, स्क्रैप, बाधित या बायपास न करें।",
						"दुर्भावनापूर्ण कोड अपलोड न करें या CommentVia का उपयोग हानिकारक, उल्लंघनकारी या अवैध सामग्री भेजने के लिए न करें।",
						"अपनी पहचान, अनुमतियों, उत्पादों, कीमतों या संबद्धताओं के बारे में गलत जानकारी न दें।",
					],
				},
				{
					title: "Instagram और तृतीय-पक्ष प्लेटफ़ॉर्म",
					body: [
						"CommentVia Meta और Instagram जैसी तृतीय-पक्ष सेवाओं पर निर्भर करता है। उन सेवाओं का आपका उपयोग उनकी शर्तों, नीतियों, अनुमतियों, समीक्षा प्रक्रियाओं, रेट लिमिट और उपलब्धता के अधीन है। हम तृतीय-पक्ष प्लेटफ़ॉर्म में बदलाव, आउटेज, अकाउंट कार्रवाइयों या अनुमति संबंधी निर्णयों के लिए जिम्मेदार नहीं हैं।",
					],
				},
				{
					title: "सब्सक्रिप्शन और भुगतान",
					body: [
						"यदि पेड प्लान ऑफ़र किए जाते हैं, तो शुल्क, बिलिंग अवधि, नवीनीकरण की शर्तें और शामिल उपयोग चेकआउट पर या ऐप में दिखाए जाएंगे। जब तक अन्यथा न बताया जाए, सब्सक्रिप्शन रद्द किए जाने तक नवीनीकृत होते रहते हैं। टैक्स लागू हो सकते हैं। भुगतान तृतीय-पक्ष प्रदाताओं द्वारा प्रोसेस किए जा सकते हैं।",
					],
				},
				{
					title: "बीटा फीचर्स",
					body: [
						"हम प्रीव्यू, बीटा फीचर्स, टेम्पलेट या प्रयोगात्मक इंटीग्रेशन ऑफ़र कर सकते हैं। इन्हें किसी भी समय बदला, सीमित या बंद किया जा सकता है और ये सामान्य रूप से उपलब्ध फीचर्स की तुलना में कम विश्वसनीय हो सकते हैं।",
					],
				},
				{
					title: "निलंबन और समाप्ति",
					body: [
						"आप किसी भी समय CommentVia का उपयोग बंद कर सकते हैं। यदि आप इन शर्तों का उल्लंघन करते हैं, सुरक्षा या कानूनी जोखिम पैदा करते हैं, बकाया राशि का भुगतान नहीं करते, या सेवा का उपयोग ऐसे तरीके से करते हैं जिससे यूज़र्स, प्लेटफ़ॉर्म या CommentVia को नुकसान हो सकता है, तो हम एक्सेस को निलंबित या समाप्त कर सकते हैं।",
					],
				},
				{
					title: "अस्वीकरण",
					body: [
						"CommentVia “जैसा है” और “जैसा उपलब्ध है” के आधार पर प्रदान किया जाता है। हम निर्बाध उपलब्धता, विशिष्ट बिक्री परिणाम, प्लेटफ़ॉर्म स्वीकृति, संदेश डिलीवरी या त्रुटिरहित संचालन की गारंटी नहीं देते।",
					],
				},
				{
					title: "दायित्व की सीमा",
					body: [
						"कानून द्वारा अनुमत अधिकतम सीमा तक, CommentVia अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी, उदाहरणात्मक या दंडात्मक नुकसान, या खोए हुए लाभ, राजस्व, सद्भावना, डेटा या व्यावसायिक अवसरों के लिए उत्तरदायी नहीं होगा। सेवा से संबंधित दावों के लिए हमारी कुल देयता उस राशि तक सीमित है जो आपने दावे से पहले के 12 महीनों में सेवा के लिए CommentVia को भुगतान की थी।",
					],
				},
				{
					title: "बदलाव और संपर्क",
					body: [
						"सेवा में बदलाव के साथ हम इन शर्तों को अपडेट कर सकते हैं। अपडेट के बाद सेवा का उपयोग जारी रखने का अर्थ है कि आप संशोधित शर्तों को स्वीकार करते हैं। इन शर्तों के बारे में प्रश्नों के लिए khanhduyvt0101@gmail.com पर संपर्क करें।",
					],
				},
			],
		},
		"data-deletion": {
			title: "डेटा हटाने के निर्देश",
			description:
				"CommentVia अकाउंट, Meta, Instagram, Facebook और Google कनेक्शन डेटा हटाने का अनुरोध कैसे करें।",
			lastUpdated: "28 जून, 2026",
			intro: [
				"आप किसी भी समय अपने CommentVia अकाउंट डेटा और कनेक्टेड प्लेटफ़ॉर्म डेटा को हटाने का अनुरोध कर सकते हैं।",
				"यह पेज Meta App Review, Google OAuth सत्यापन और उन यूज़र्स के लिए प्रदान किया गया है जो कनेक्टेड Instagram, Facebook या Google अकाउंट से जुड़े डेटा को हटाना चाहते हैं।",
			],
			sections: [
				{
					title: "हटाने का अनुरोध कैसे करें",
					items: [
						"अपने CommentVia अकाउंट से जुड़े ईमेल पते से khanhduyvt0101@gmail.com पर ईमेल भेजें।",
						"सब्जेक्ट लाइन का उपयोग करें: CommentVia data deletion request.",
						"हमें बताएं कि आप केवल कनेक्टेड प्लेटफ़ॉर्म डेटा हटाना चाहते हैं या अपना पूरा CommentVia अकाउंट।",
					],
				},
				{
					title: "हम क्या हटाते हैं",
					items: [
						"जहां कानूनी रूप से अनुमति हो, अकाउंट प्रोफ़ाइल जानकारी, वर्कस्पेस प्राथमिकताएं, सेशन और प्रमाणीकरण रिकॉर्ड।",
						"CommentVia द्वारा स्टोर किए गए कनेक्टेड Instagram, Facebook और Google अकाउंट आइडेंटिफ़ायर और टोकन।",
						"आपके वर्कस्पेस से जुड़े ऑटोमेशन नियम, पोस्ट URL, कीवर्ड, सार्वजनिक जवाब, DM लिंक डेस्टिनेशन और संबंधित एनालिटिक्स।",
					],
				},
				{
					title: "Meta डेटा हटाने का कॉलबैक",
					body: [
						"जब Meta हस्ताक्षरित डेटा हटाने का अनुरोध भेजता है, तो CommentVia अनुरोध को सत्यापित करता है और स्टेटस URL के साथ एक पुष्टिकरण कोड लौटाता है। इसके बाद हम Meta यूज़र या कनेक्टेड बिज़नेस अकाउंट से जुड़े डेटा को, जहां वह हमारे सिस्टम में मौजूद हो, हटा देते हैं।",
					],
				},
				{
					title: "रिटेंशन अपवाद",
					body: [
						"सुरक्षा, धोखाधड़ी की रोकथाम, कानूनी अनुपालन, लेखांकन, विवाद समाधान या बैकअप रिकवरी के लिए आवश्यक होने पर हम सीमित रिकॉर्ड रख सकते हैं। रखे गए रिकॉर्ड की आवश्यकता समाप्त होने पर उन्हें हटा दिया जाता है या पहचान-रहित कर दिया जाता है।",
					],
				},
				{
					title: "समय-सीमा",
					body: [
						"हम हटाने के अनुरोधों को 30 दिनों के भीतर पूरा करने का लक्ष्य रखते हैं, जब तक कि कानून, सुरक्षा समीक्षा या प्लेटफ़ॉर्म सत्यापन के कारण अधिक समय की आवश्यकता न हो।",
					],
				},
			],
		},
	},
	ar: {
		privacy: {
			title: "سياسة الخصوصية",
			description:
				"كيف يجمع CommentVia المعلومات ويستخدمها ويشاركها ويحتفظ بها ويحميها لموقع CommentVia وتطبيقه.",
			lastUpdated: "28 يونيو 2026",
			intro: [
				"توضح سياسة الخصوصية هذه كيف يجمع CommentVia المعلومات ويستخدمها عند زيارتك لموقعنا الإلكتروني، أو إنشاء حساب، أو ربط سير عمل تجارة صنّاع المحتوى، أو استخدام أدوات الأتمتة من التعليقات إلى DM.",
				"كتبنا هذا الإشعار لنوضّح فئات المعلومات التي نتعامل معها، والأسباب التي نستخدمها من أجلها، والخدمات التي نعتمد عليها، والخيارات المتاحة لك.",
			],
			sections: [
				{
					title: "المعلومات التي نجمعها",
					items: [
						"معلومات الحساب، مثل اسمك، وعنوان بريدك الإلكتروني، وبيانات مصادقة كلمة المرور، وصورة الملف الشخصي، وتفضيلات مساحة العمل.",
						"معلومات الحسابات المتصلة، مثل معرّفات حسابات Google وFacebook وInstagram، وتفاصيل الملف الشخصي، ورموز الوصول، والنطاقات الممنوحة، وانتهاء صلاحية الرمز، وحالة الاتصال.",
						"معلومات سير عمل صنّاع المحتوى، مثل معرّفات حسابات Instagram التي تربطها، وعناوين URL للمنشورات أو Reel، والكلمات المفتاحية، ونص الرد العلني، ووجهات روابط DM، وحالة القواعد، وتحليلات التسليم.",
						"معلومات الاستخدام والجهاز، مثل بيانات السجلات، ونوع المتصفح، والمنطقة التقريبية، والصفحات المعروضة، والتفاعلات مع الميزات، وأحداث التشخيص، ومعرّفات ملفات تعريف الارتباط أو التقنيات المماثلة.",
						"معلومات الدفع والاشتراك، إذا كانت الخطط المدفوعة مفعّلة، مثل الخطة، وحالة الفوترة، والفواتير، ومراجع معالج الدفع. لا نخزّن أرقام البطاقات الكاملة.",
						"مراسلات الدعم، مثل الرسائل التي ترسلها إلينا، والمرفقات التي تختار تقديمها، وسياق استكشاف الأخطاء وإصلاحها ذي الصلة.",
					],
				},
				{
					title: "كيف نستخدم المعلومات",
					items: [
						"تقديم خدمة CommentVia وتأمينها وصيانتها.",
						"إنشاء وإدارة الحسابات، والجلسات، ومساحات العمل، والقواعد، والتكاملات، وطلبات الدعم.",
						"مصادقة المستخدمين باستخدام Google أو Facebook عندما تختار تسجيل الدخول عبر الشبكات الاجتماعية.",
						"إرسال الروابط المطلوبة، وعرض المعاينات، وقياس أداء القواعد، وتحسين سير عمل صنّاع المحتوى.",
						"منع إساءة الاستخدام، واستكشاف الأخطاء وإصلاحها، وإنفاذ شروطنا، وحماية المستخدمين والخدمة.",
						"إرسال مراسلات الخدمة، والأمان، والفوترة، والمنتج.",
						"الامتثال للالتزامات القانونية والضريبية والمحاسبية والتزامات المنصات والتنظيمية.",
					],
				},
				{
					title: "كيف نشارك المعلومات",
					body: [
						"لا نبيع المعلومات الشخصية. نشارك المعلومات فقط عند الحاجة لتشغيل CommentVia، أو اتباع تعليماتك، أو الامتثال للقانون، أو حماية الحقوق والسلامة.",
					],
					items: [
						"مزودو الخدمات الذين يستضيفون البنية التحتية، ويعالجون المصادقة، والتحليلات، والفوترة، والدعم، والبريد الإلكتروني، والسجلات، وعمليات الأمان.",
						"مزودو التكامل، بما في ذلك Google وMeta وFacebook وInstagram، عندما تربط الحسابات، أو تسجل الدخول، أو تضبط سير عمل يعتمد على خدمات تلك المنصات.",
						"المستشارون المهنيون، أو السلطات، أو الأطراف المقابلة عندما يكون ذلك ضروريًا بشكل معقول للامتثال القانوني، أو الأمان، أو عمليات نقل الأعمال، أو حل النزاعات.",
					],
				},
				{
					title: "ملفات تعريف الارتباط والتقنيات المماثلة",
					body: [
						"نستخدم ملفات تعريف الارتباط والتقنيات المماثلة للمصادقة، والأمان، والتفضيلات، والتحليلات، وتشخيصات المنتج. يمكنك التحكم في ملفات تعريف الارتباط من خلال متصفحك، لكن تعطيل بعض ملفات تعريف الارتباط قد يمنع التطبيق من العمل بشكل صحيح.",
					],
				},
				{
					title: "الاحتفاظ",
					body: [
						"نحتفظ بالمعلومات طالما كان ذلك ضروريًا لتقديم الخدمة، والامتثال للالتزامات القانونية، وحل النزاعات، والحفاظ على الأمان، وإنفاذ الاتفاقيات. عندما لا تعود المعلومات مطلوبة، نحذفها أو نزيل ما يعرّف بها أو نجمعها بشكل إجمالي حيثما كان ذلك عمليًا.",
					],
				},
				{
					title: "الأمان",
					body: [
						"نستخدم تدابير حماية إدارية وتقنية وتنظيمية مصممة لحماية المعلومات. لا يمكن لأي خدمة عبر الإنترنت أن تضمن أمانًا مثاليًا، لذا يُرجى استخدام كلمة مرور قوية، وحماية أجهزتك، والتواصل معنا إذا كنت تعتقد أن حسابك معرّض للخطر.",
					],
				},
				{
					title: "خياراتك وحقوقك",
					items: [
						"يمكنك الوصول إلى بعض معلومات الحساب أو تحديثها أو تصديرها أو حذفها من خلال التطبيق أو عبر التواصل معنا.",
						"اعتمادًا على موقعك، قد تكون لديك حقوق في المعرفة، أو الوصول، أو التصحيح، أو الحذف، أو التقييد، أو الاعتراض، أو النقل، أو إلغاء الاشتراك في بعض عمليات المعالجة.",
						"يجوز للمقيمين في كاليفورنيا طلب معلومات حول فئات المعلومات الشخصية التي تم جمعها، ومصادرها، وأغراضها، والإفصاحات عنها، كما يجوز لهم طلب التصحيح أو الحذف حيثما ينطبق ذلك.",
						"قد تكون لدى مستخدمي المنطقة الاقتصادية الأوروبية والمملكة المتحدة والمناطق المماثلة أيضًا حقوق تتعلق بالأسس القانونية، وشكاوى السلطات الإشرافية، وعمليات النقل الدولية.",
					],
				},
				{
					title: "عمليات النقل الدولية",
					body: [
						"قد يعالج CommentVia المعلومات في بلدان غير البلد الذي تعيش فيه. عند الاقتضاء، نستخدم تدابير حماية مناسبة لعمليات النقل الدولية.",
					],
				},
				{
					title: "الأطفال",
					body: [
						"CommentVia غير موجّه إلى الأطفال دون سن 13 عامًا، ولا نجمع عن علم معلومات شخصية من الأطفال. إذا كنت تعتقد أن طفلًا قدّم معلومات، فتواصل معنا حتى نتمكن من اتخاذ الإجراء المناسب.",
					],
				},
				{
					title: "التغييرات والتواصل",
					body: [
						"قد نحدّث سياسة الخصوصية هذه مع تغيّر الخدمة. إذا كانت التغييرات جوهرية، فسنتخذ خطوات معقولة لإخطار المستخدمين. تواصل عبر khanhduyvt0101@gmail.com بشأن طلبات أو أسئلة الخصوصية.",
					],
				},
			],
		},
		terms: {
			title: "شروط الخدمة",
			description:
				"قواعد استخدام CommentVia، بما في ذلك الحسابات، والاستخدام المقبول، والاشتراكات، والتكاملات، والمحتوى، والمسؤولية.",
			lastUpdated: "28 يونيو 2026",
			intro: [
				"تحكم شروط الخدمة هذه وصولك إلى CommentVia واستخدامك له. بإنشائك حسابًا، أو ربط التكاملات، أو استخدام الخدمة، فإنك توافق على هذه الشروط.",
				"إذا كنت تستخدم CommentVia لصالح شركة أو عميل، فأنت تؤكد أن لديك الصلاحية لقبول هذه الشروط نيابةً عن تلك المؤسسة.",
			],
			sections: [
				{
					title: "الخدمة",
					body: [
						"يوفّر CommentVia أدوات للمبدعين والشركات لإعداد مسارات عمل تحويل تعليقات Instagram إلى DM، وإدارة قواعد الكلمات المفتاحية، ومعاينة الردود، ومراجعة تحليلات الأداء. قد تتغير الميزات مع تحسيننا للخدمة أو استجابتنا لمتطلبات المنصات.",
					],
				},
				{
					title: "الحسابات والأمان",
					items: [
						"يجب عليك تقديم معلومات حساب دقيقة والحفاظ على تحديثها.",
						"أنت مسؤول عن النشاط الذي يتم عبر حسابك وعن حماية كلمات المرور والجلسات والحسابات المتصلة.",
						"يجب عليك إخطارنا فورًا إذا اشتبهت في وجود وصول غير مصرح به أو إساءة استخدام.",
					],
				},
				{
					title: "المحتوى والبيانات الخاصة بك",
					body: [
						"تحتفظ بملكية المحتوى والبيانات التي ترسلها إلى CommentVia، بما في ذلك نصوص القواعد والروابط والكلمات المفتاحية وإعدادات الحساب وبيانات مسارات العمل المتصلة. وتمنح CommentVia الحقوق اللازمة لاستضافة هذا المحتوى ومعالجته ونقله وعرضه واستخدامه لتقديم الخدمة وتحسينها.",
					],
				},
				{
					title: "الاستخدام المقبول",
					items: [
						"لا تستخدم CommentVia لإرسال الرسائل المزعجة، أو الرسائل الخادعة، أو العروض الترويجية غير القانونية، أو المضايقة، أو المحتوى الذي ينتهك قواعد المنصات.",
						"لا تقم بإجراء هندسة عكسية للخدمة أو تحميلها فوق طاقتها أو استخراج بياناتها آليًا أو تعطيلها أو تجاوز ضوابط الأمان الخاصة بها.",
						"لا تقم بتحميل تعليمات برمجية ضارة أو استخدام CommentVia لنقل مواد مؤذية أو منتهِكة أو غير قانونية.",
						"لا تقدم معلومات مضللة عن هويتك أو أذوناتك أو منتجاتك أو أسعارك أو ارتباطاتك.",
					],
				},
				{
					title: "Instagram ومنصات الجهات الخارجية",
					body: [
						"يعتمد CommentVia على خدمات جهات خارجية مثل Meta وInstagram. يخضع استخدامك لهذه الخدمات لشروطها وسياساتها وأذوناتها وعمليات المراجعة وحدود معدلات الاستخدام والتوافر الخاصة بها. ولسنا مسؤولين عن تغييرات منصات الجهات الخارجية أو انقطاعاتها أو الإجراءات المتعلقة بالحسابات أو قرارات الأذونات.",
					],
				},
				{
					title: "الاشتراكات والدفع",
					body: [
						"إذا تم تقديم خطط مدفوعة، فسيتم عرض الرسوم وفترات الفوترة وشروط التجديد والاستخدام المشمول عند إتمام الشراء أو داخل التطبيق. ما لم يُذكر خلاف ذلك، تتجدد الاشتراكات إلى أن يتم إلغاؤها. قد تُطبق الضرائب. وقد تتم معالجة المدفوعات بواسطة مزودي خدمات تابعين لجهات خارجية.",
					],
				},
				{
					title: "الميزات التجريبية",
					body: [
						"قد نقدّم معاينات أو ميزات تجريبية أو قوالب أو تكاملات تجريبية. قد يتم تغيير هذه العناصر أو تقييدها أو إيقافها في أي وقت، وقد تكون أقل موثوقية من الميزات المتاحة عمومًا.",
					],
				},
				{
					title: "التعليق والإنهاء",
					body: [
						"يمكنك التوقف عن استخدام CommentVia في أي وقت. يجوز لنا تعليق الوصول أو إنهاؤه إذا انتهكت هذه الشروط، أو تسببت في مخاطر أمنية أو قانونية، أو أخفقت في دفع المبالغ المستحقة، أو استخدمت الخدمة بطريقة قد تضر بالمستخدمين أو المنصات أو CommentVia.",
					],
				},
				{
					title: "إخلاءات المسؤولية",
					body: [
						"يتم توفير CommentVia على أساس «كما هو» و«حسب التوفر». ولا نضمن التوافر دون انقطاع، أو نتائج مبيعات محددة، أو موافقة المنصات، أو تسليم الرسائل، أو التشغيل الخالي من الأخطاء.",
					],
				},
				{
					title: "تحديد المسؤولية",
					body: [
						"إلى أقصى حد يسمح به القانون، لن يكون CommentVia مسؤولًا عن الأضرار غير المباشرة أو العرضية أو الخاصة أو التبعية أو النموذجية أو العقابية، أو عن فقدان الأرباح أو الإيرادات أو السمعة التجارية أو البيانات أو فرص الأعمال. تقتصر مسؤوليتنا الإجمالية عن المطالبات المتعلقة بالخدمة على المبالغ التي دفعتها إلى CommentVia مقابل الخدمة خلال 12 شهرًا السابقة للمطالبة.",
					],
				},
				{
					title: "التغييرات والتواصل",
					body: [
						"قد نقوم بتحديث هذه الشروط مع تغيّر الخدمة. ويعني استمرار الاستخدام بعد التحديثات أنك تقبل الشروط المعدلة. تواصل عبر khanhduyvt0101@gmail.com إذا كانت لديك أسئلة حول هذه الشروط.",
					],
				},
			],
		},
		"data-deletion": {
			title: "تعليمات حذف البيانات",
			description:
				"كيفية طلب حذف بيانات حساب CommentVia وبيانات الاتصال الخاصة بـ Meta وInstagram وFacebook وGoogle.",
			lastUpdated: "28 يونيو 2026",
			intro: [
				"يمكنك طلب حذف بيانات حسابك في CommentVia وبيانات المنصات المتصلة في أي وقت.",
				"تُقدَّم هذه الصفحة لأغراض Meta App Review والتحقق من Google OAuth وللمستخدمين الذين يرغبون في إزالة البيانات المرتبطة بحسابات Instagram أو Facebook أو Google المتصلة.",
			],
			sections: [
				{
					title: "كيفية طلب الحذف",
					items: [
						"أرسل بريدًا إلكترونيًا إلى khanhduyvt0101@gmail.com من عنوان البريد الإلكتروني المرتبط بحسابك في CommentVia.",
						"استخدم سطر الموضوع: CommentVia data deletion request.",
						"أخبرنا ما إذا كنت تريد حذف بيانات المنصات المتصلة فقط أم حساب CommentVia بالكامل.",
					],
				},
				{
					title: "ما الذي نحذفه",
					items: [
						"معلومات الملف الشخصي للحساب، وتفضيلات مساحة العمل، والجلسات، وسجلات المصادقة حيثما يسمح القانون بذلك.",
						"معرّفات ورموز حسابات Instagram وFacebook وGoogle المتصلة والمخزنة بواسطة CommentVia.",
						"قواعد الأتمتة، وعناوين URL للمنشورات، والكلمات المفتاحية، والردود العامة، ووجهات روابط DM، والتحليلات ذات الصلة المرتبطة بمساحة العمل الخاصة بك.",
					],
				},
				{
					title: "استدعاء حذف بيانات Meta",
					body: [
						"عندما ترسل Meta طلب حذف بيانات موقّعًا، يتحقق CommentVia من الطلب ويعيد رمز تأكيد مع URL للحالة. ثم نزيل البيانات المرتبطة بمستخدم Meta أو حساب الأعمال المتصل حيثما وُجدت في أنظمتنا.",
					],
				},
				{
					title: "استثناءات الاحتفاظ",
					body: [
						"قد نحتفظ بسجلات محدودة عندما يكون ذلك مطلوبًا للأمان أو منع الاحتيال أو الامتثال القانوني أو المحاسبة أو حل النزاعات أو استعادة النسخ الاحتياطية. ويتم حذف السجلات المحتفظ بها أو إخفاء هويتها عندما لا تعود هناك حاجة إليها.",
					],
				},
				{
					title: "الإطار الزمني",
					body: [
						"نسعى إلى إكمال طلبات الحذف خلال 30 يومًا ما لم يتطلب القانون أو مراجعة الأمان أو التحقق من المنصة فترة أطول.",
					],
				},
			],
		},
	},
	pt: {
		privacy: {
			title: "Política de Privacidade",
			description:
				"Como o CommentVia coleta, usa, compartilha, retém e protege informações no site e no app do CommentVia.",
			lastUpdated: "28 de junho de 2026",
			intro: [
				"Esta Política de Privacidade explica como o CommentVia coleta e usa informações quando você visita nosso site, cria uma conta, conecta fluxos de trabalho de creator-commerce ou usa nossas ferramentas de automação de comentários para DM.",
				"Escrevemos este aviso para explicar com clareza as categorias de informações que tratamos, os motivos pelos quais as usamos, os serviços dos quais dependemos e as opções disponíveis para você.",
			],
			sections: [
				{
					title: "Informações que coletamos",
					items: [
						"Informações da conta, como seu nome, endereço de email, dados de autenticação por senha, imagem de perfil e preferências do workspace.",
						"Informações de contas conectadas, como identificadores de contas Google, Facebook e Instagram, detalhes de perfil, tokens de acesso, escopos concedidos, expiração de tokens e status da conexão.",
						"Informações de fluxos de trabalho de criadores, como identificadores de contas Instagram que você conecta, URLs de posts ou Reel, palavras-chave, texto de resposta pública, destinos de links por DM, status de regras e análises de entrega.",
						"Informações de uso e dispositivo, como dados de log, tipo de navegador, região aproximada, páginas visualizadas, interações com recursos, eventos de diagnóstico e identificadores de cookies ou tecnologias semelhantes.",
						"Informações de pagamento e assinatura, se planos pagos estiverem habilitados, como plano, status de cobrança, faturas e referências do processador de pagamentos. Não armazenamos números completos de cartão.",
						"Comunicações de suporte, como mensagens que você nos envia, anexos que decide fornecer e contexto relacionado à solução de problemas.",
					],
				},
				{
					title: "Como usamos as informações",
					items: [
						"Fornecer, proteger e manter o serviço CommentVia.",
						"Criar e gerenciar contas, sessões, workspaces, regras, integrações e solicitações de suporte.",
						"Autenticar usuários com Google ou Facebook quando você escolher o login social.",
						"Enviar links solicitados, exibir prévias, medir o desempenho das regras e melhorar os fluxos de trabalho dos criadores.",
						"Prevenir abusos, solucionar erros, aplicar nossos Termos e proteger os usuários e o serviço.",
						"Enviar comunicações de serviço, segurança, cobrança e produto.",
						"Cumprir obrigações legais, fiscais, contábeis, de plataforma e regulatórias.",
					],
				},
				{
					title: "Como compartilhamos informações",
					body: [
						"Não vendemos informações pessoais. Compartilhamos informações apenas quando necessário para operar o CommentVia, seguir suas instruções, cumprir a lei ou proteger direitos e a segurança.",
					],
					items: [
						"Prestadores de serviços que hospedam infraestrutura, processam autenticação, analytics, cobrança, suporte, email, logs e operações de segurança.",
						"Provedores de integração, incluindo Google, Meta, Facebook e Instagram, quando você conecta contas, faz login ou configura fluxos de trabalho que dependem dos serviços dessas plataformas.",
						"Consultores profissionais, autoridades ou contrapartes quando razoavelmente necessário para conformidade legal, segurança, transferências comerciais ou resolução de disputas.",
					],
				},
				{
					title: "Cookies e tecnologias semelhantes",
					body: [
						"Usamos cookies e tecnologias semelhantes para autenticação, segurança, preferências, analytics e diagnósticos de produto. Você pode controlar cookies pelo seu navegador, mas desativar alguns cookies pode impedir que o app funcione corretamente.",
					],
				},
				{
					title: "Retenção",
					body: [
						"Mantemos informações pelo tempo necessário para fornecer o serviço, cumprir obrigações legais, resolver disputas, manter a segurança e aplicar acordos. Quando as informações não são mais necessárias, nós as excluímos, desidentificamos ou agregamos quando viável.",
					],
				},
				{
					title: "Segurança",
					body: [
						"Usamos salvaguardas administrativas, técnicas e organizacionais projetadas para proteger as informações. Nenhum serviço de internet pode garantir segurança perfeita; portanto, use uma senha forte, proteja seus dispositivos e entre em contato conosco se acreditar que sua conta está em risco.",
					],
				},
				{
					title: "Suas escolhas e direitos",
					items: [
						"Você pode acessar, atualizar, exportar ou excluir determinadas informações da conta pelo app ou entrando em contato conosco.",
						"Dependendo da sua localização, você pode ter direitos de saber, acessar, corrigir, excluir, restringir, se opor, portar ou optar por não participar de determinados tratamentos.",
						"Residentes da Califórnia podem solicitar informações sobre categorias de informações pessoais coletadas, fontes, finalidades, divulgações, e podem solicitar correção ou exclusão quando aplicável.",
						"Usuários do Espaço Econômico Europeu, do Reino Unido e de regiões semelhantes também podem ter direitos relacionados a bases legais, reclamações a autoridades supervisoras e transferências internacionais.",
					],
				},
				{
					title: "Transferências internacionais",
					body: [
						"O CommentVia pode processar informações em países diferentes daquele em que você mora. Quando exigido, usamos salvaguardas adequadas para transferências internacionais.",
					],
				},
				{
					title: "Crianças",
					body: [
						"O CommentVia não é direcionado a crianças menores de 13 anos, e não coletamos intencionalmente informações pessoais de crianças. Se você acredita que uma criança forneceu informações, entre em contato conosco para que possamos tomar as medidas apropriadas.",
					],
				},
				{
					title: "Alterações e contato",
					body: [
						"Podemos atualizar esta Política de Privacidade conforme o serviço muda. Se as alterações forem relevantes, tomaremos medidas razoáveis para notificar os usuários. Entre em contato pelo email khanhduyvt0101@gmail.com para solicitações ou dúvidas sobre privacidade.",
					],
				},
			],
		},
		terms: {
			title: "Termos de Serviço",
			description:
				"As regras para usar o CommentVia, incluindo contas, uso aceitável, assinaturas, integrações, conteúdo e responsabilidade.",
			lastUpdated: "28 de junho de 2026",
			intro: [
				"Estes Termos de Serviço regem seu acesso e uso do CommentVia. Ao criar uma conta, conectar integrações ou usar o serviço, você concorda com estes Termos.",
				"Se você usa o CommentVia para uma empresa ou cliente, confirma que tem autoridade para aceitar estes Termos em nome dessa organização.",
			],
			sections: [
				{
					title: "O Serviço",
					body: [
						"CommentVia oferece ferramentas para criadores e empresas configurarem fluxos de comentários para DM no Instagram, gerenciarem regras de palavras-chave, pré-visualizarem respostas e analisarem métricas de desempenho. Os recursos podem mudar conforme aprimoramos o serviço ou respondemos a requisitos da plataforma.",
					],
				},
				{
					title: "Contas e segurança",
					items: [
						"Você deve fornecer informações de conta precisas e mantê-las atualizadas.",
						"Você é responsável pela atividade em sua conta e por proteger senhas, sessões e contas conectadas.",
						"Você deve nos notificar imediatamente se suspeitar de acesso não autorizado ou uso indevido.",
					],
				},
				{
					title: "Seu conteúdo e dados",
					body: [
						"Você mantém a propriedade do conteúdo e dos dados que envia ao CommentVia, incluindo texto de regras, links, palavras-chave, configuração de conta e dados de fluxos conectados. Você concede ao CommentVia os direitos necessários para hospedar, processar, transmitir, exibir e usar esse conteúdo para fornecer e melhorar o serviço.",
					],
				},
				{
					title: "Uso aceitável",
					items: [
						"Não use o CommentVia para spam, mensagens enganosas, promoções ilegais, assédio ou conteúdo que viole regras da plataforma.",
						"Não faça engenharia reversa, sobrecarregue, extraia dados, interrompa ou contorne os controles de segurança do serviço.",
						"Não envie código malicioso nem use o CommentVia para transmitir material prejudicial, infrator ou ilegal.",
						"Não deturpe sua identidade, permissões, produtos, preços ou afiliações.",
					],
				},
				{
					title: "Instagram e plataformas de terceiros",
					body: [
						"CommentVia depende de serviços de terceiros, como Meta e Instagram. Seu uso desses serviços está sujeito aos termos, políticas, permissões, processos de revisão, limites de taxa e disponibilidade deles. Não somos responsáveis por mudanças em plataformas de terceiros, interrupções, ações em contas ou decisões de permissão.",
					],
				},
				{
					title: "Assinaturas e pagamento",
					body: [
						"Se planos pagos forem oferecidos, taxas, períodos de cobrança, termos de renovação e uso incluído serão exibidos no checkout ou no aplicativo. Salvo indicação em contrário, as assinaturas são renovadas até serem canceladas. Impostos podem ser aplicados. Os pagamentos podem ser processados por provedores de terceiros.",
					],
				},
				{
					title: "Recursos beta",
					body: [
						"Podemos oferecer prévias, recursos beta, modelos ou integrações experimentais. Eles podem ser alterados, limitados ou descontinuados a qualquer momento e podem ser menos confiáveis do que recursos geralmente disponíveis.",
					],
				},
				{
					title: "Suspensão e encerramento",
					body: [
						"Você pode parar de usar o CommentVia a qualquer momento. Podemos suspender ou encerrar o acesso se você violar estes Termos, criar risco de segurança ou jurídico, deixar de pagar valores devidos ou usar o serviço de uma forma que possa prejudicar usuários, plataformas ou o CommentVia.",
					],
				},
				{
					title: "Isenções de responsabilidade",
					body: [
						"CommentVia é fornecido “no estado em que se encontra” e “conforme disponível”. Não garantimos disponibilidade ininterrupta, resultados específicos de vendas, aprovação da plataforma, entrega de mensagens ou operação sem erros.",
					],
				},
				{
					title: "Limitação de responsabilidade",
					body: [
						"Na máxima extensão permitida por lei, o CommentVia não será responsável por danos indiretos, incidentais, especiais, consequenciais, exemplares ou punitivos, nem por lucros cessantes, perda de receita, reputação, dados ou oportunidades de negócio. Nossa responsabilidade agregada por reivindicações relacionadas ao serviço é limitada aos valores que você pagou ao CommentVia pelo serviço nos 12 meses anteriores à reivindicação.",
					],
				},
				{
					title: "Alterações e contato",
					body: [
						"Podemos atualizar estes Termos conforme o serviço muda. O uso contínuo após as atualizações significa que você aceita os Termos revisados. Entre em contato pelo e-mail khanhduyvt0101@gmail.com em caso de dúvidas sobre estes Termos.",
					],
				},
			],
		},
		"data-deletion": {
			title: "Instruções para exclusão de dados",
			description:
				"Como solicitar a exclusão da conta do CommentVia e dos dados de conexão da Meta, Instagram, Facebook e Google.",
			lastUpdated: "28 de junho de 2026",
			intro: [
				"Você pode solicitar a exclusão dos dados da sua conta do CommentVia e dos dados de plataformas conectadas a qualquer momento.",
				"Esta página é fornecida para a Análise do App da Meta, a verificação do Google OAuth e usuários que desejam remover dados associados a contas conectadas do Instagram, Facebook ou Google.",
			],
			sections: [
				{
					title: "Como solicitar a exclusão",
					items: [
						"Envie um e-mail para khanhduyvt0101@gmail.com a partir do endereço de e-mail associado à sua conta do CommentVia.",
						"Use o assunto: solicitação de exclusão de dados do CommentVia.",
						"Informe se você deseja excluir apenas os dados de plataformas conectadas ou sua conta completa do CommentVia.",
					],
				},
				{
					title: "O que excluímos",
					items: [
						"Informações de perfil da conta, preferências do workspace, sessões e registros de autenticação quando permitido por lei.",
						"Identificadores e tokens de contas conectadas do Instagram, Facebook e Google armazenados pelo CommentVia.",
						"Regras de automação, URLs de posts, palavras-chave, respostas públicas, destinos de links de DM e análises relacionadas associadas ao seu workspace.",
					],
				},
				{
					title: "Callback de exclusão de dados da Meta",
					body: [
						"Quando a Meta envia uma solicitação assinada de exclusão de dados, o CommentVia verifica a solicitação e retorna um código de confirmação com uma URL de status. Em seguida, removemos os dados associados ao usuário da Meta ou à conta empresarial conectada quando eles existem em nossos sistemas.",
					],
				},
				{
					title: "Exceções de retenção",
					body: [
						"Podemos reter registros limitados quando necessário para segurança, prevenção de fraude, conformidade legal, contabilidade, resolução de disputas ou recuperação de backups. Os registros retidos são excluídos ou desidentificados quando não forem mais necessários.",
					],
				},
				{
					title: "Prazo",
					body: [
						"Nosso objetivo é concluir solicitações de exclusão em até 30 dias, a menos que um período mais longo seja exigido por lei, revisão de segurança ou verificação da plataforma.",
					],
				},
			],
		},
	},
	fr: {
		privacy: {
			title: "Politique de confidentialité",
			description:
				"Comment CommentVia collecte, utilise, partage, conserve et protège les informations pour le site web et l’application CommentVia.",
			lastUpdated: "28 juin 2026",
			intro: [
				"Cette Politique de confidentialité explique comment CommentVia collecte et utilise les informations lorsque vous visitez notre site web, créez un compte, connectez des workflows de creator-commerce ou utilisez nos outils d’automatisation du commentaire au DM.",
				"Nous avons rédigé cet avis afin d’expliquer clairement les catégories d’informations que nous traitons, les raisons pour lesquelles nous les utilisons, les services sur lesquels nous nous appuyons et les choix qui s’offrent à vous.",
			],
			sections: [
				{
					title: "Informations que nous collectons",
					items: [
						"Informations de compte, telles que votre nom, votre adresse e-mail, les données d’authentification par mot de passe, votre image de profil et vos préférences d’espace de travail.",
						"Informations de comptes connectés, telles que les identifiants de comptes Google, Facebook et Instagram, les détails de profil, les jetons d’accès, les portées accordées, l’expiration des jetons et l’état de connexion.",
						"Informations relatives aux workflows de créateur, telles que les identifiants de comptes Instagram que vous connectez, les URL de publications ou de Reel, les mots-clés, le texte des réponses publiques, les destinations de liens DM, l’état des règles et les analyses de diffusion.",
						"Informations d’utilisation et d’appareil, telles que les données de journal, le type de navigateur, la région approximative, les pages consultées, les interactions avec les fonctionnalités, les événements de diagnostic et les identifiants de cookies ou de technologies similaires.",
						"Informations de paiement et d’abonnement, si des offres payantes sont activées, telles que l’offre, le statut de facturation, les factures et les références du prestataire de paiement. Nous ne stockons pas les numéros de carte complets.",
						"Communications avec le support, telles que les messages que vous nous envoyez, les pièces jointes que vous choisissez de fournir et le contexte de dépannage associé.",
					],
				},
				{
					title: "Comment nous utilisons les informations",
					items: [
						"Fournir, sécuriser et maintenir le service CommentVia.",
						"Créer et gérer les comptes, les sessions, les espaces de travail, les règles, les intégrations et les demandes de support.",
						"Authentifier les utilisateurs avec Google ou Facebook lorsque vous choisissez la connexion via un réseau social.",
						"Envoyer les liens demandés, afficher des aperçus, mesurer les performances des règles et améliorer les workflows de créateur.",
						"Prévenir les abus, résoudre les erreurs, faire respecter nos Conditions et protéger les utilisateurs ainsi que le service.",
						"Envoyer des communications relatives au service, à la sécurité, à la facturation et au produit.",
						"Respecter les obligations légales, fiscales, comptables, de plateforme et réglementaires.",
					],
				},
				{
					title: "Comment nous partageons les informations",
					body: [
						"Nous ne vendons pas d’informations personnelles. Nous partageons les informations uniquement lorsque cela est nécessaire pour exploiter CommentVia, suivre vos instructions, respecter la loi ou protéger les droits et la sécurité.",
					],
					items: [
						"Prestataires de services qui hébergent l’infrastructure, traitent l’authentification, l’analytique, la facturation, le support, les e-mails, les journaux et les opérations de sécurité.",
						"Fournisseurs d’intégrations, notamment Google, Meta, Facebook et Instagram, lorsque vous connectez des comptes, vous connectez ou configurez des workflows qui dépendent des services de ces plateformes.",
						"Conseillers professionnels, autorités ou cocontractants lorsque cela est raisonnablement nécessaire pour la conformité légale, la sécurité, les transferts d’entreprise ou la résolution de litiges.",
					],
				},
				{
					title: "Cookies et technologies similaires",
					body: [
						"Nous utilisons des cookies et des technologies similaires pour l’authentification, la sécurité, les préférences, l’analytique et les diagnostics produit. Vous pouvez contrôler les cookies depuis votre navigateur, mais la désactivation de certains cookies peut empêcher l’application de fonctionner correctement.",
					],
				},
				{
					title: "Conservation",
					body: [
						"Nous conservons les informations aussi longtemps que nécessaire pour fournir le service, respecter les obligations légales, résoudre les litiges, maintenir la sécurité et faire appliquer les accords. Lorsque les informations ne sont plus nécessaires, nous les supprimons, les anonymisons ou les agrégeons lorsque cela est possible.",
					],
				},
				{
					title: "Sécurité",
					body: [
						"Nous utilisons des mesures de protection administratives, techniques et organisationnelles conçues pour protéger les informations. Aucun service internet ne peut garantir une sécurité parfaite ; veuillez donc utiliser un mot de passe robuste, protéger vos appareils et nous contacter si vous pensez que votre compte est exposé à un risque.",
					],
				},
				{
					title: "Vos choix et vos droits",
					items: [
						"Vous pouvez accéder à certaines informations de compte, les mettre à jour, les exporter ou les supprimer via l’application ou en nous contactant.",
						"Selon votre lieu de résidence, vous pouvez disposer de droits vous permettant de connaître, d’accéder, de corriger, de supprimer, de limiter, de vous opposer, de transférer ou de refuser certains traitements.",
						"Les résidents de Californie peuvent demander des informations sur les catégories d’informations personnelles collectées, les sources, les finalités, les divulgations, et peuvent demander une correction ou une suppression lorsque cela s’applique.",
						"Les utilisateurs de l’Espace économique européen, du Royaume-Uni et de régions similaires peuvent également disposer de droits liés aux bases légales, aux réclamations auprès d’une autorité de contrôle et aux transferts internationaux.",
					],
				},
				{
					title: "Transferts internationaux",
					body: [
						"CommentVia peut traiter des informations dans des pays autres que celui où vous vivez. Lorsque cela est requis, nous utilisons des garanties appropriées pour les transferts internationaux.",
					],
				},
				{
					title: "Enfants",
					body: [
						"CommentVia ne s’adresse pas aux enfants de moins de 13 ans, et nous ne collectons pas sciemment d’informations personnelles auprès d’enfants. Si vous pensez qu’un enfant a fourni des informations, contactez-nous afin que nous puissions prendre les mesures appropriées.",
					],
				},
				{
					title: "Modifications et contact",
					body: [
						"Nous pouvons mettre à jour cette Politique de confidentialité à mesure que le service évolue. Si les modifications sont importantes, nous prendrons des mesures raisonnables pour en informer les utilisateurs. Contactez khanhduyvt0101@gmail.com pour toute demande ou question relative à la confidentialité.",
					],
				},
			],
		},
		terms: {
			title: "Conditions d’utilisation",
			description:
				"Les règles d’utilisation de CommentVia, notamment les comptes, l’utilisation acceptable, les abonnements, les intégrations, le contenu et la responsabilité.",
			lastUpdated: "28 juin 2026",
			intro: [
				"Ces Conditions d’utilisation régissent votre accès à CommentVia et votre utilisation de celui-ci. En créant un compte, en connectant des intégrations ou en utilisant le service, vous acceptez ces Conditions.",
				"Si vous utilisez CommentVia pour une entreprise ou un client, vous confirmez disposer de l’autorité nécessaire pour accepter ces Conditions au nom de cette organisation.",
			],
			sections: [
				{
					title: "Le Service",
					body: [
						"CommentVia fournit aux créateurs et aux entreprises des outils pour configurer des workflows de commentaires Instagram vers DM, gérer des règles de mots-clés, prévisualiser les réponses et consulter les analyses de performance. Les fonctionnalités peuvent évoluer à mesure que nous améliorons le service ou répondons aux exigences des plateformes.",
					],
				},
				{
					title: "Comptes et sécurité",
					items: [
						"Vous devez fournir des informations de compte exactes et les tenir à jour.",
						"Vous êtes responsable de l’activité effectuée depuis votre compte, ainsi que de la protection des mots de passe, des sessions et des comptes connectés.",
						"Vous devez nous informer rapidement si vous soupçonnez un accès non autorisé ou une utilisation abusive.",
					],
				},
				{
					title: "Votre contenu et vos données",
					body: [
						"Vous conservez la propriété du contenu et des données que vous soumettez à CommentVia, y compris le texte des règles, les liens, les mots-clés, la configuration du compte et les données des workflows connectés. Vous accordez à CommentVia les droits nécessaires pour héberger, traiter, transmettre, afficher et utiliser ce contenu afin de fournir et d’améliorer le service.",
					],
				},
				{
					title: "Utilisation acceptable",
					items: [
						"N’utilisez pas CommentVia pour du spam, des messages trompeurs, des promotions illégales, du harcèlement ou du contenu qui enfreint les règles des plateformes.",
						"Ne procédez pas à l’ingénierie inverse du service, ne le surchargez pas, ne l’explorez pas par scraping, ne le perturbez pas et ne contournez pas ses contrôles de sécurité.",
						"Ne téléversez pas de code malveillant et n’utilisez pas CommentVia pour transmettre du contenu nuisible, contrefaisant ou illégal.",
						"Ne donnez pas une fausse représentation de votre identité, de vos autorisations, de vos produits, de vos prix ou de vos affiliations.",
					],
				},
				{
					title: "Instagram et plateformes tierces",
					body: [
						"CommentVia dépend de services tiers tels que Meta et Instagram. Votre utilisation de ces services est soumise à leurs conditions, politiques, autorisations, processus de vérification, limites de débit et disponibilité. Nous ne sommes pas responsables des changements de plateformes tierces, des interruptions, des mesures prises à l’égard des comptes ni des décisions relatives aux autorisations.",
					],
				},
				{
					title: "Abonnements et paiement",
					body: [
						"Si des offres payantes sont proposées, les frais, périodes de facturation, modalités de renouvellement et l’utilisation incluse seront indiqués au moment du paiement ou dans l’application. Sauf indication contraire, les abonnements se renouvellent jusqu’à leur annulation. Des taxes peuvent s’appliquer. Les paiements peuvent être traités par des prestataires tiers.",
					],
				},
				{
					title: "Fonctionnalités bêta",
					body: [
						"Nous pouvons proposer des aperçus, des fonctionnalités bêta, des modèles ou des intégrations expérimentales. Ceux-ci peuvent être modifiés, limités ou interrompus à tout moment et peuvent être moins fiables que les fonctionnalités généralement disponibles.",
					],
				},
				{
					title: "Suspension et résiliation",
					body: [
						"Vous pouvez cesser d’utiliser CommentVia à tout moment. Nous pouvons suspendre ou résilier l’accès si vous enfreignez les présentes Conditions, créez un risque de sécurité ou juridique, ne payez pas les montants dus ou utilisez le service d’une manière susceptible de nuire aux utilisateurs, aux plateformes ou à CommentVia.",
					],
				},
				{
					title: "Avis de non-responsabilité",
					body: [
						"CommentVia est fourni « en l’état » et « selon disponibilité ». Nous ne garantissons pas une disponibilité ininterrompue, des résultats de vente précis, l’approbation par une plateforme, la livraison des messages ni un fonctionnement sans erreur.",
					],
				},
				{
					title: "Limitation de responsabilité",
					body: [
						"Dans toute la mesure permise par la loi, CommentVia ne pourra être tenu responsable des dommages indirects, accessoires, spéciaux, consécutifs, exemplaires ou punitifs, ni des pertes de bénéfices, de revenus, de clientèle, de données ou d’opportunités commerciales. Notre responsabilité globale pour les réclamations liées au service est limitée aux montants que vous avez payés à CommentVia pour le service au cours des 12 mois précédant la réclamation.",
					],
				},
				{
					title: "Modifications et contact",
					body: [
						"Nous pouvons mettre à jour les présentes Conditions à mesure que le service évolue. La poursuite de l’utilisation après les mises à jour signifie que vous acceptez les Conditions révisées. Contactez khanhduyvt0101@gmail.com pour toute question concernant les présentes Conditions.",
					],
				},
			],
		},
		"data-deletion": {
			title: "Instructions de suppression des données",
			description:
				"Comment demander la suppression des données de votre compte CommentVia et des connexions Meta, Instagram, Facebook et Google.",
			lastUpdated: "28 juin 2026",
			intro: [
				"Vous pouvez demander la suppression des données de votre compte CommentVia et des données de plateformes connectées à tout moment.",
				"Cette page est fournie pour l’examen de l’application par Meta, la vérification Google OAuth et les utilisateurs qui souhaitent supprimer les données associées à des comptes Instagram, Facebook ou Google connectés.",
			],
			sections: [
				{
					title: "Comment demander la suppression",
					items: [
						"Envoyez un e-mail à khanhduyvt0101@gmail.com depuis l’adresse e-mail associée à votre compte CommentVia.",
						"Utilisez l’objet suivant : Demande de suppression des données CommentVia.",
						"Indiquez-nous si vous souhaitez supprimer uniquement les données de plateformes connectées ou l’intégralité de votre compte CommentVia.",
					],
				},
				{
					title: "Ce que nous supprimons",
					items: [
						"Les informations de profil du compte, les préférences de l’espace de travail, les sessions et les enregistrements d’authentification lorsque la loi le permet.",
						"Les identifiants et jetons des comptes Instagram, Facebook et Google connectés stockés par CommentVia.",
						"Les règles d’automatisation, les URL de publications, les mots-clés, les réponses publiques, les destinations de liens DM et les analyses associées à votre espace de travail.",
					],
				},
				{
					title: "Callback de suppression des données Meta",
					body: [
						"Lorsque Meta envoie une demande de suppression de données signée, CommentVia vérifie la demande et renvoie un code de confirmation avec une URL de statut. Nous supprimons ensuite les données associées à l’utilisateur Meta ou au compte professionnel connecté lorsqu’elles existent dans nos systèmes.",
					],
				},
				{
					title: "Exceptions de conservation",
					body: [
						"Nous pouvons conserver des enregistrements limités lorsque cela est requis pour la sécurité, la prévention de la fraude, la conformité légale, la comptabilité, la résolution des litiges ou la récupération de sauvegardes. Les enregistrements conservés sont supprimés ou anonymisés lorsqu’ils ne sont plus nécessaires.",
					],
				},
				{
					title: "Délais",
					body: [
						"Nous nous efforçons de traiter les demandes de suppression dans un délai de 30 jours, sauf si une période plus longue est requise par la loi, un examen de sécurité ou une vérification de plateforme.",
					],
				},
			],
		},
	},
	de: {
		privacy: {
			title: "Datenschutzerklärung",
			description:
				"Wie CommentVia Informationen für die CommentVia-Website und -App erhebt, verwendet, weitergibt, speichert und schützt.",
			lastUpdated: "28. Juni 2026",
			intro: [
				"Diese Datenschutzerklärung erläutert, wie CommentVia Informationen erhebt und verwendet, wenn du unsere Website besuchst, ein Konto erstellst, Creator-Commerce-Workflows verbindest oder unsere Comment-to-DM-Automatisierungstools nutzt.",
				"Wir haben diesen Hinweis verfasst, um transparent darzustellen, welche Kategorien von Informationen wir verarbeiten, aus welchen Gründen wir sie verwenden, auf welche Dienste wir uns stützen und welche Auswahlmöglichkeiten dir zur Verfügung stehen.",
			],
			sections: [
				{
					title: "Von uns erhobene Informationen",
					items: [
						"Kontoinformationen, wie dein Name, deine E-Mail-Adresse, Daten zur Passwortauthentifizierung, dein Profilbild und Workspace-Einstellungen.",
						"Informationen zu verbundenen Konten, wie Google-, Facebook- und Instagram-Konto-IDs, Profildetails, Zugriffstoken, gewährte Berechtigungsbereiche, Ablaufdatum von Tokens und Verbindungsstatus.",
						"Informationen zu Creator-Workflows, wie von dir verbundene Instagram-Konto-IDs, Beitrags- oder Reel-URLs, Keywords, öffentlicher Antworttext, DM-Linkziele, Regelstatus und Zustellungsanalysen.",
						"Nutzungs- und Geräteinformationen, wie Protokolldaten, Browsertyp, ungefähre Region, aufgerufene Seiten, Interaktionen mit Funktionen, Diagnoseereignisse sowie Cookie- oder ähnliche Technologiekennungen.",
						"Zahlungs- und Abonnementinformationen, sofern kostenpflichtige Tarife aktiviert sind, wie Tarif, Abrechnungsstatus, Rechnungen und Referenzen des Zahlungsdienstleisters. Wir speichern keine vollständigen Kartennummern.",
						"Support-Kommunikation, wie Nachrichten, die du uns sendest, Anhänge, die du bereitstellst, und zugehöriger Kontext zur Fehlerbehebung.",
					],
				},
				{
					title: "Wie wir Informationen verwenden",
					items: [
						"Den CommentVia-Service bereitstellen, absichern und warten.",
						"Konten, Sitzungen, Workspaces, Regeln, Integrationen und Support-Anfragen erstellen und verwalten.",
						"Nutzer über Google oder Facebook authentifizieren, wenn du Social Sign-in wählst.",
						"Angeforderte Links senden, Vorschauen anzeigen, die Leistung von Regeln messen und Creator-Workflows verbessern.",
						"Missbrauch verhindern, Fehler beheben, unsere Nutzungsbedingungen durchsetzen sowie Nutzer und den Service schützen.",
						"Service-, Sicherheits-, Abrechnungs- und Produktmitteilungen senden.",
						"Gesetzliche, steuerliche, buchhalterische, plattformbezogene und regulatorische Verpflichtungen erfüllen.",
					],
				},
				{
					title: "Wie wir Informationen weitergeben",
					body: [
						"Wir verkaufen keine personenbezogenen Informationen. Wir geben Informationen nur weiter, wenn dies erforderlich ist, um CommentVia zu betreiben, deine Anweisungen zu befolgen, Gesetze einzuhalten oder Rechte und Sicherheit zu schützen.",
					],
					items: [
						"Dienstleister, die Infrastruktur hosten und Authentifizierung, Analytics, Abrechnung, Support, E-Mail, Protokolle und Sicherheitsprozesse verarbeiten.",
						"Integrationsanbieter, einschließlich Google, Meta, Facebook und Instagram, wenn du Konten verbindest, dich anmeldest oder Workflows konfigurierst, die von diesen Plattformdiensten abhängen.",
						"Professionelle Berater, Behörden oder Gegenparteien, wenn dies für die Einhaltung gesetzlicher Vorschriften, Sicherheit, Unternehmensübertragungen oder Streitbeilegung angemessen erforderlich ist.",
					],
				},
				{
					title: "Cookies und ähnliche Technologien",
					body: [
						"Wir verwenden Cookies und ähnliche Technologien für Authentifizierung, Sicherheit, Präferenzen, Analytics und Produktdiagnosen. Du kannst Cookies über deinen Browser steuern, aber das Deaktivieren bestimmter Cookies kann dazu führen, dass die App nicht korrekt funktioniert.",
					],
				},
				{
					title: "Aufbewahrung",
					body: [
						"Wir bewahren Informationen so lange auf, wie es erforderlich ist, um den Service bereitzustellen, gesetzlichen Verpflichtungen nachzukommen, Streitigkeiten beizulegen, die Sicherheit aufrechtzuerhalten und Vereinbarungen durchzusetzen. Wenn Informationen nicht mehr benötigt werden, löschen, anonymisieren oder aggregieren wir sie, soweit praktikabel.",
					],
				},
				{
					title: "Sicherheit",
					body: [
						"Wir verwenden administrative, technische und organisatorische Schutzmaßnahmen, die darauf ausgelegt sind, Informationen zu schützen. Kein Internetdienst kann perfekte Sicherheit garantieren. Verwende daher bitte ein starkes Passwort, schütze deine Geräte und kontaktiere uns, wenn du glaubst, dass dein Konto gefährdet ist.",
					],
				},
				{
					title: "Deine Auswahlmöglichkeiten und Rechte",
					items: [
						"Du kannst bestimmte Kontoinformationen über die App oder durch Kontaktaufnahme mit uns abrufen, aktualisieren, exportieren oder löschen.",
						"Je nach deinem Standort hast du möglicherweise Rechte auf Auskunft, Zugriff, Berichtigung, Löschung, Einschränkung, Widerspruch, Übertragbarkeit oder Opt-out bezüglich bestimmter Verarbeitungen.",
						"Einwohner Kaliforniens können Informationen zu den Kategorien der erhobenen personenbezogenen Informationen, Quellen, Zwecken und Offenlegungen anfordern und, sofern anwendbar, Berichtigung oder Löschung verlangen.",
						"Nutzer im Europäischen Wirtschaftsraum, im Vereinigten Königreich und in ähnlichen Regionen haben möglicherweise außerdem Rechte in Bezug auf Rechtsgrundlagen, Beschwerden bei Aufsichtsbehörden und internationale Übermittlungen.",
					],
				},
				{
					title: "Internationale Übermittlungen",
					body: [
						"CommentVia kann Informationen in anderen Ländern als deinem Wohnsitzland verarbeiten. Wenn erforderlich, verwenden wir geeignete Schutzmaßnahmen für internationale Übermittlungen.",
					],
				},
				{
					title: "Kinder",
					body: [
						"CommentVia richtet sich nicht an Kinder unter 13 Jahren, und wir erheben nicht wissentlich personenbezogene Informationen von Kindern. Wenn du glaubst, dass ein Kind Informationen bereitgestellt hat, kontaktiere uns, damit wir geeignete Maßnahmen ergreifen können.",
					],
				},
				{
					title: "Änderungen und Kontakt",
					body: [
						"Wir können diese Datenschutzerklärung aktualisieren, wenn sich der Service ändert. Bei wesentlichen Änderungen werden wir angemessene Schritte unternehmen, um Nutzer zu benachrichtigen. Kontaktiere khanhduyvt0101@gmail.com bei Datenschutzanfragen oder Fragen.",
					],
				},
			],
		},
		terms: {
			title: "Nutzungsbedingungen",
			description:
				"Die Regeln für die Nutzung von CommentVia, einschließlich Konten, zulässiger Nutzung, Abonnements, Integrationen, Inhalten und Haftung.",
			lastUpdated: "28. Juni 2026",
			intro: [
				"Diese Nutzungsbedingungen regeln deinen Zugriff auf und deine Nutzung von CommentVia. Indem du ein Konto erstellst, Integrationen verbindest oder den Service nutzt, stimmst du diesen Bedingungen zu.",
				"Wenn du CommentVia für ein Unternehmen oder einen Kunden nutzt, bestätigst du, dass du berechtigt bist, diese Bedingungen für diese Organisation zu akzeptieren.",
			],
			sections: [
				{
					title: "Der Service",
					body: [
						"CommentVia bietet Tools, mit denen Creator und Unternehmen Instagram-Workflows von Kommentaren zu DM konfigurieren, Keyword-Regeln verwalten, Antworten in der Vorschau anzeigen und Performance-Analysen prüfen können. Funktionen können sich ändern, wenn wir den Service verbessern oder auf Plattformanforderungen reagieren.",
					],
				},
				{
					title: "Konten und Sicherheit",
					items: [
						"Sie müssen korrekte Kontoinformationen angeben und diese aktuell halten.",
						"Sie sind für Aktivitäten unter Ihrem Konto sowie für den Schutz von Passwörtern, Sitzungen und verbundenen Konten verantwortlich.",
						"Sie müssen uns umgehend benachrichtigen, wenn Sie unbefugten Zugriff oder Missbrauch vermuten.",
					],
				},
				{
					title: "Ihre Inhalte und Daten",
					body: [
						"Sie behalten das Eigentum an Inhalten und Daten, die Sie an CommentVia übermitteln, einschließlich Regeltexten, Links, Keywords, Kontokonfigurationen und verbundenen Workflow-Daten. Sie gewähren CommentVia die Rechte, die erforderlich sind, um diese Inhalte zu hosten, zu verarbeiten, zu übertragen, anzuzeigen und zu nutzen, damit der Service bereitgestellt und verbessert werden kann.",
					],
				},
				{
					title: "Zulässige Nutzung",
					items: [
						"Verwenden Sie CommentVia nicht für Spam, irreführende Nachrichten, rechtswidrige Werbeaktionen, Belästigung oder Inhalte, die gegen Plattformregeln verstoßen.",
						"Sie dürfen den Service nicht zurückentwickeln, überlasten, scrapen, stören oder Sicherheitskontrollen umgehen.",
						"Laden Sie keinen schädlichen Code hoch und verwenden Sie CommentVia nicht, um schädliches, rechtsverletzendes oder illegales Material zu übertragen.",
						"Machen Sie keine falschen Angaben zu Ihrer Identität, Ihren Berechtigungen, Produkten, Preisen oder Zugehörigkeiten.",
					],
				},
				{
					title: "Instagram und Drittanbieterplattformen",
					body: [
						"CommentVia ist von Drittanbieterdiensten wie Meta und Instagram abhängig. Ihre Nutzung dieser Dienste unterliegt deren Bedingungen, Richtlinien, Berechtigungen, Prüfprozessen, Ratenlimits und Verfügbarkeit. Wir sind nicht verantwortlich für Änderungen an Drittanbieterplattformen, Ausfälle, Kontomaßnahmen oder Berechtigungsentscheidungen.",
					],
				},
				{
					title: "Abonnements und Zahlung",
					body: [
						"Wenn kostenpflichtige Tarife angeboten werden, werden Gebühren, Abrechnungszeiträume, Verlängerungsbedingungen und enthaltene Nutzung beim Checkout oder in der App angezeigt. Sofern nicht anders angegeben, verlängern sich Abonnements, bis sie gekündigt werden. Es können Steuern anfallen. Zahlungen können von Drittanbietern verarbeitet werden.",
					],
				},
				{
					title: "Beta-Funktionen",
					body: [
						"Wir können Vorschauen, Beta-Funktionen, Vorlagen oder experimentelle Integrationen anbieten. Diese können jederzeit geändert, eingeschränkt oder eingestellt werden und weniger zuverlässig sein als allgemein verfügbare Funktionen.",
					],
				},
				{
					title: "Aussetzung und Beendigung",
					body: [
						"Sie können die Nutzung von CommentVia jederzeit einstellen. Wir können den Zugriff aussetzen oder beenden, wenn Sie gegen diese Bedingungen verstoßen, ein Sicherheits- oder Rechtsrisiko schaffen, geschuldete Beträge nicht zahlen oder den Service in einer Weise nutzen, die Nutzern, Plattformen oder CommentVia schaden kann.",
					],
				},
				{
					title: "Haftungsausschlüsse",
					body: [
						"CommentVia wird „wie besehen“ und „wie verfügbar“ bereitgestellt. Wir garantieren keine ununterbrochene Verfügbarkeit, bestimmte Verkaufsergebnisse, Plattformfreigaben, Nachrichtenzustellung oder fehlerfreien Betrieb.",
					],
				},
				{
					title: "Haftungsbeschränkung",
					body: [
						"Soweit gesetzlich maximal zulässig, haftet CommentVia nicht für indirekte, beiläufige, besondere, Folge-, exemplarische oder punitive Schäden oder für entgangene Gewinne, Umsätze, Goodwill, Daten oder Geschäftschancen. Unsere Gesamthaftung für Ansprüche im Zusammenhang mit dem Service ist auf die Beträge beschränkt, die Sie in den 12 Monaten vor dem Anspruch für den Service an CommentVia gezahlt haben.",
					],
				},
				{
					title: "Änderungen und Kontakt",
					body: [
						"Wir können diese Bedingungen aktualisieren, wenn sich der Service ändert. Die fortgesetzte Nutzung nach Aktualisierungen bedeutet, dass Sie die überarbeiteten Bedingungen akzeptieren. Kontaktieren Sie khanhduyvt0101@gmail.com bei Fragen zu diesen Bedingungen.",
					],
				},
			],
		},
		"data-deletion": {
			title: "Anweisungen zur Datenlöschung",
			description:
				"So beantragen Sie die Löschung von CommentVia-Konto-, Meta-, Instagram-, Facebook- und Google-Verbindungsdaten.",
			lastUpdated: "28. Juni 2026",
			intro: [
				"Sie können jederzeit die Löschung Ihrer CommentVia-Kontodaten und verbundenen Plattformdaten beantragen.",
				"Diese Seite wird für die Meta App Review, die Google OAuth-Verifizierung und für Nutzer bereitgestellt, die Daten entfernen möchten, die mit verbundenen Instagram-, Facebook- oder Google-Konten verknüpft sind.",
			],
			sections: [
				{
					title: "So beantragen Sie die Löschung",
					items: [
						"Senden Sie eine E-Mail an khanhduyvt0101@gmail.com von der E-Mail-Adresse, die mit Ihrem CommentVia-Konto verknüpft ist.",
						"Verwenden Sie die Betreffzeile: CommentVia data deletion request.",
						"Teilen Sie uns mit, ob Sie nur verbundene Plattformdaten oder Ihr vollständiges CommentVia-Konto löschen möchten.",
					],
				},
				{
					title: "Was wir löschen",
					items: [
						"Kontoprofilinformationen, Workspace-Einstellungen, Sitzungen und Authentifizierungsdatensätze, soweit gesetzlich zulässig.",
						"Von CommentVia gespeicherte Kennungen und Tokens verbundener Instagram-, Facebook- und Google-Konten.",
						"Automatisierungsregeln, Beitrags-URLs, Keywords, öffentliche Antworten, DM-Linkziele und zugehörige Analysen, die mit Ihrem Workspace verknüpft sind.",
					],
				},
				{
					title: "Meta Data Deletion Callback",
					body: [
						"Wenn Meta eine signierte Datenlöschungsanfrage sendet, überprüft CommentVia die Anfrage und gibt einen Bestätigungscode mit einer Status-URL zurück. Anschließend entfernen wir Daten, die mit dem Meta-Nutzer oder dem verbundenen Geschäftskonto verknüpft sind, sofern sie in unseren Systemen vorhanden sind.",
					],
				},
				{
					title: "Ausnahmen bei der Aufbewahrung",
					body: [
						"Wir können begrenzte Datensätze aufbewahren, wenn dies für Sicherheit, Betrugsprävention, gesetzliche Compliance, Buchhaltung, Streitbeilegung oder Backup-Wiederherstellung erforderlich ist. Aufbewahrte Datensätze werden gelöscht oder anonymisiert, wenn sie nicht mehr benötigt werden.",
					],
				},
				{
					title: "Zeitplan",
					body: [
						"Wir bemühen uns, Löschungsanfragen innerhalb von 30 Tagen abzuschließen, sofern nicht gesetzlich, durch eine Sicherheitsprüfung oder durch Plattformverifizierung ein längerer Zeitraum erforderlich ist.",
					],
				},
			],
		},
	},
	ja: {
		privacy: {
			title: "プライバシーポリシー",
			description:
				"CommentVia のウェブサイトおよびアプリにおける情報の収集、利用、共有、保持、保護について説明します。",
			lastUpdated: "2026年6月28日",
			intro: [
				"本プライバシーポリシーは、お客様が当社のウェブサイトを訪問し、アカウントを作成し、クリエイターコマースのワークフローを連携し、またはコメントからDMへの自動化ツールを利用する際に、CommentVia が情報を収集および利用する方法を説明するものです。",
				"本通知は、当社が取り扱う情報のカテゴリ、その利用目的、当社が利用するサービス、お客様が選択できる事項について明確にお伝えするために作成されています。",
			],
			sections: [
				{
					title: "当社が収集する情報",
					items: [
						"アカウント情報（お客様の氏名、メールアドレス、パスワード認証データ、プロフィール画像、ワークスペース設定など）。",
						"連携アカウント情報（Google、Facebook、Instagram のアカウント識別子、プロフィール詳細、アクセストークン、許可されたスコープ、トークンの有効期限、連携ステータスなど）。",
						"クリエイターワークフロー情報（連携した Instagram アカウント識別子、投稿または Reel のURL、キーワード、公開返信テキスト、DMリンクの送信先、ルールのステータス、配信分析など）。",
						"利用状況およびデバイス情報（ログデータ、ブラウザの種類、おおよその地域、閲覧ページ、機能の操作、診断イベント、Cookieまたは類似技術の識別子など）。",
						"有料プランが有効な場合の支払いおよびサブスクリプション情報（プラン、請求ステータス、請求書、決済処理業者の参照情報など）。当社はカード番号全体を保存しません。",
						"サポートに関するやり取り（お客様が当社に送信するメッセージ、提供を選択した添付ファイル、関連するトラブルシューティングの状況など）。",
					],
				},
				{
					title: "情報の利用方法",
					items: [
						"CommentVia サービスの提供、保護、維持。",
						"アカウント、セッション、ワークスペース、ルール、連携、サポートリクエストの作成および管理。",
						"お客様がソーシャルサインインを選択した場合の、Google または Facebook によるユーザー認証。",
						"リクエストされたリンクの送信、プレビューの表示、ルールのパフォーマンス測定、クリエイターワークフローの改善。",
						"不正利用の防止、エラーのトラブルシューティング、当社規約の執行、ユーザーおよびサービスの保護。",
						"サービス、セキュリティ、請求、製品に関する連絡の送信。",
						"法務、税務、会計、プラットフォーム、規制上の義務の遵守。",
					],
				},
				{
					title: "情報の共有方法",
					body: [
						"当社は個人情報を販売しません。当社は、CommentVia の運営、お客様の指示の実行、法令遵守、または権利と安全の保護に必要な場合にのみ情報を共有します。",
					],
					items: [
						"インフラのホスティング、認証、分析、請求、サポート、メール、ログ、セキュリティ運用を処理するサービスプロバイダー。",
						"お客様がアカウントを連携、サインイン、またはそれらのプラットフォームサービスに依存するワークフローを設定する場合の、Google、Meta、Facebook、Instagram を含む連携プロバイダー。",
						"法令遵守、セキュリティ、事業譲渡、紛争解決のために合理的に必要な場合の、専門アドバイザー、当局、または取引相手。",
					],
				},
				{
					title: "Cookieおよび類似技術",
					body: [
						"当社は、認証、セキュリティ、設定、分析、製品診断のためにCookieおよび類似技術を使用します。Cookieはブラウザで管理できますが、一部のCookieを無効にすると、アプリが正常に動作しない場合があります。",
					],
				},
				{
					title: "保持",
					body: [
						"当社は、サービスの提供、法的義務の遵守、紛争の解決、セキュリティの維持、契約の執行に必要な期間、情報を保持します。情報が不要になった場合、実務上可能な範囲で削除、非識別化、または集計します。",
					],
				},
				{
					title: "セキュリティ",
					body: [
						"当社は、情報を保護するために設計された管理上、技術上、組織上の安全対策を講じています。インターネットサービスに完全なセキュリティを保証できるものはないため、強力なパスワードを使用し、デバイスを保護し、アカウントにリスクがあると思われる場合は当社までご連絡ください。",
					],
				},
				{
					title: "お客様の選択肢と権利",
					items: [
						"お客様は、アプリ内または当社への連絡を通じて、特定のアカウント情報にアクセス、更新、エクスポート、または削除できる場合があります。",
						"お住まいの地域によっては、特定の処理について、知る権利、アクセス権、訂正権、削除権、制限権、異議申立権、データポータビリティ権、またはオプトアウトする権利を有する場合があります。",
						"カリフォルニア州居住者は、収集された個人情報のカテゴリ、情報源、目的、開示に関する情報を請求でき、該当する場合は訂正または削除を請求できます。",
						"欧州経済領域、英国、および類似地域のユーザーは、法的根拠、監督機関への苦情、国際移転に関連する権利も有する場合があります。",
					],
				},
				{
					title: "国際移転",
					body: [
						"CommentVia は、お客様の居住国以外の国で情報を処理する場合があります。必要な場合、当社は国際移転に対して適切な保護措置を講じます。",
					],
				},
				{
					title: "子ども",
					body: [
						"CommentVia は13歳未満の子どもを対象としておらず、当社は子どもから個人情報を knowingly に収集することはありません。子どもが情報を提供したと思われる場合は、適切な対応を取れるよう当社までご連絡ください。",
					],
				},
				{
					title: "変更およびお問い合わせ",
					body: [
						"サービスの変更に伴い、当社は本プライバシーポリシーを更新する場合があります。重要な変更がある場合、当社はユーザーに通知するため合理的な措置を講じます。プライバシーに関するリクエストやご質問は khanhduyvt0101@gmail.com までお問い合わせください。",
					],
				},
			],
		},
		terms: {
			title: "利用規約",
			description:
				"アカウント、許容される利用、サブスクリプション、連携、コンテンツ、責任を含む、CommentVia の利用に関するルール。",
			lastUpdated: "2026年6月28日",
			intro: [
				"本利用規約は、CommentVia へのアクセスおよび利用を規定します。アカウントを作成し、連携を接続し、またはサービスを利用することにより、お客様は本規約に同意したものとみなされます。",
				"会社またはクライアントのために CommentVia を利用する場合、お客様はその組織を代表して本規約に同意する権限を有していることを確認するものとします。",
			],
			sections: [
				{
					title: "本サービス",
					body: [
						"CommentViaは、クリエイターやビジネスがInstagramのコメントからDMへのワークフローを設定し、キーワードルールを管理し、返信をプレビューし、パフォーマンス分析を確認するためのツールを提供します。サービスの改善やプラットフォーム要件への対応に伴い、機能は変更される場合があります。",
					],
				},
				{
					title: "アカウントとセキュリティ",
					items: [
						"正確なアカウント情報を提供し、常に最新の状態に保つ必要があります。",
						"お客様は、ご自身のアカウントで行われるアクティビティ、およびパスワード、セッション、連携アカウントの保護について責任を負います。",
						"不正アクセスまたは不正利用の疑いがある場合は、速やかに当社へ通知する必要があります。",
					],
				},
				{
					title: "お客様のコンテンツとデータ",
					body: [
						"お客様は、ルール文面、リンク、キーワード、アカウント設定、連携ワークフローデータを含め、CommentViaに送信したコンテンツおよびデータの所有権を保持します。お客様は、サービスの提供および改善のために、そのコンテンツをホスト、処理、送信、表示、使用するために必要な権利をCommentViaに付与します。",
					],
				},
				{
					title: "許容される利用",
					items: [
						"スパム、欺瞞的なメッセージ配信、違法なプロモーション、嫌がらせ、またはプラットフォームルールに違反するコンテンツのためにCommentViaを使用しないでください。",
						"本サービスのリバースエンジニアリング、過負荷の発生、スクレイピング、妨害、またはセキュリティ制御の回避を行わないでください。",
						"悪意のあるコードをアップロードしたり、有害、権利侵害、または違法な素材を送信するためにCommentViaを使用したりしないでください。",
						"ご自身の身元、権限、製品、価格、または所属について虚偽の表示をしないでください。",
					],
				},
				{
					title: "Instagramおよび第三者プラットフォーム",
					body: [
						"CommentViaは、MetaやInstagramなどの第三者サービスに依存しています。これらのサービスの利用には、それぞれの規約、ポリシー、権限、審査プロセス、レート制限、可用性が適用されます。当社は、第三者プラットフォームの変更、障害、アカウント措置、または権限に関する判断について責任を負いません。",
					],
				},
				{
					title: "サブスクリプションと支払い",
					body: [
						"有料プランが提供される場合、料金、請求期間、更新条件、含まれる利用量は、チェックアウト時またはアプリ内で表示されます。別段の定めがない限り、サブスクリプションは解約されるまで更新されます。税金が適用される場合があります。支払いは第三者プロバイダーによって処理される場合があります。",
					],
				},
				{
					title: "ベータ機能",
					body: [
						"当社は、プレビュー、ベータ機能、テンプレート、または実験的な連携を提供する場合があります。これらはいつでも変更、制限、または終了される場合があり、一般提供されている機能よりも信頼性が低い場合があります。",
					],
				},
				{
					title: "利用停止と終了",
					body: [
						"お客様はいつでもCommentViaの利用を停止できます。当社は、お客様が本規約に違反した場合、セキュリティ上または法的リスクを生じさせた場合、支払期日の到来した金額を支払わない場合、またはユーザー、プラットフォーム、CommentViaに損害を与えるおそれのある方法でサービスを利用した場合、アクセスを一時停止または終了することがあります。",
					],
				},
				{
					title: "免責事項",
					body: [
						"CommentViaは「現状有姿」かつ「提供可能な範囲」で提供されます。当社は、中断のない可用性、特定の販売成果、プラットフォームの承認、メッセージ配信、またはエラーのない動作を保証しません。",
					],
				},
				{
					title: "責任の制限",
					body: [
						"法律で認められる最大限の範囲において、CommentViaは、間接的、偶発的、特別、結果的、懲罰的、または制裁的損害、ならびに利益、収益、信用、データ、またはビジネス機会の喪失について責任を負いません。本サービスに関連する請求に対する当社の責任総額は、当該請求の前12か月間にお客様が本サービスについてCommentViaに支払った金額を上限とします。",
					],
				},
				{
					title: "変更とお問い合わせ",
					body: [
						"当社は、サービスの変更に伴い、本規約を更新する場合があります。更新後も引き続き利用する場合、改定後の規約に同意したものとみなされます。本規約に関するご質問は、khanhduyvt0101@gmail.comまでお問い合わせください。",
					],
				},
			],
		},
		"data-deletion": {
			title: "データ削除手順",
			description:
				"CommentViaアカウント、Meta、Instagram、Facebook、Googleの連携データの削除をリクエストする方法。",
			lastUpdated: "2026年6月28日",
			intro: [
				"お客様はいつでも、CommentViaアカウントデータおよび連携プラットフォームデータの削除をリクエストできます。",
				"このページは、Meta App Review、Google OAuth検証、および連携済みのInstagram、Facebook、またはGoogleアカウントに関連するデータの削除を希望するユーザー向けに提供されています。",
			],
			sections: [
				{
					title: "削除をリクエストする方法",
					items: [
						"CommentViaアカウントに関連付けられているメールアドレスから、khanhduyvt0101@gmail.com宛にメールを送信してください。",
						"件名は「CommentVia data deletion request」としてください。",
						"連携プラットフォームデータのみを削除するのか、CommentViaアカウント全体を削除するのかをお知らせください。",
					],
				},
				{
					title: "削除する内容",
					items: [
						"法的に許可される範囲で、アカウントプロフィール情報、ワークスペース設定、セッション、認証記録を削除します。",
						"CommentViaが保存している、連携済みのInstagram、Facebook、Googleアカウント識別子およびトークン。",
						"お客様のワークスペースに関連する自動化ルール、投稿URL、キーワード、公開返信、DMリンクの遷移先、および関連分析データ。",
					],
				},
				{
					title: "Metaデータ削除コールバック",
					body: [
						"Metaから署名付きデータ削除リクエストが送信されると、CommentViaはそのリクエストを確認し、ステータスURL付きの確認コードを返します。その後、当社システム内に存在する場合、Metaユーザーまたは連携済みビジネスアカウントに関連するデータを削除します。",
					],
				},
				{
					title: "保持の例外",
					body: [
						"当社は、セキュリティ、不正防止、法令遵守、会計、紛争解決、またはバックアップ復旧のために必要な場合、限定的な記録を保持することがあります。保持された記録は、不要になった時点で削除または匿名化されます。",
					],
				},
				{
					title: "所要期間",
					body: [
						"法律、セキュリティ審査、またはプラットフォーム検証により、より長い期間が必要とされる場合を除き、当社は削除リクエストを30日以内に完了することを目指します。",
					],
				},
			],
		},
	},
};

function languageFromCode(value: string): Language | undefined {
	const language = value.toLowerCase();
	for (const option of supportedLanguages) {
		if (language === option || language.startsWith(`${option}-`)) {
			return option;
		}
	}
	return undefined;
}

function getPathLanguage(pathname: string): Language | undefined {
	const segment = pathname.split("/").filter(Boolean)[0];
	return segment ? languageFromCode(segment) : undefined;
}

function legalPageFromCode(value: string | undefined): LegalPage | undefined {
	return value === "privacy" || value === "terms" || value === "data-deletion"
		? value
		: undefined;
}

function getPathLegalPage(pathname: string): LegalPage | undefined {
	const segments = pathname.split("/").filter(Boolean);
	const pageSegment = getPathLanguage(pathname) ? segments[1] : segments[0];
	return legalPageFromCode(pageSegment);
}

function getBrowserLanguage(): Language {
	if (typeof navigator === "undefined") {
		return "en";
	}
	return languageFromCode(navigator.language) ?? "en";
}

function getInitialLanguage(): Language {
	if (typeof window !== "undefined") {
		return getPathLanguage(window.location.pathname) ?? getBrowserLanguage();
	}
	return "en";
}

function getInitialTheme(): Theme {
	if (typeof localStorage === "undefined") {
		return "system";
	}

	const savedTheme = localStorage.getItem("commentvia-theme");
	return savedTheme === "light" ||
		savedTheme === "dark" ||
		savedTheme === "system"
		? savedTheme
		: "system";
}

function getLanguagePath(language: Language, page?: LegalPage) {
	return page ? `/${language}/${page}` : `/${language}/`;
}

function getLanguageUrl(language: Language, page?: LegalPage) {
	return `${siteUrl}${getLanguagePath(language, page)}`;
}

function setHeadLink(
	selector: string,
	attributes: Record<string, string>,
): HTMLLinkElement {
	let link = document.head.querySelector<HTMLLinkElement>(selector);
	if (!link) {
		link = document.createElement("link");
		document.head.appendChild(link);
	}
	for (const [key, value] of Object.entries(attributes)) {
		link.setAttribute(key, value);
	}
	return link;
}

function setMetaTag(
	selector: string,
	attributes: Record<string, string>,
): HTMLMetaElement {
	let meta = document.head.querySelector<HTMLMetaElement>(selector);
	if (!meta) {
		meta = document.createElement("meta");
		document.head.appendChild(meta);
	}
	for (const [key, value] of Object.entries(attributes)) {
		meta.setAttribute(key, value);
	}
	return meta;
}

function LegalDocumentPage({ document }: { document: LegalDocument }) {
	return (
		<main className="legal-page" id="top">
			<header className="legal-hero">
				<h1>{document.title}</h1>
				{document.intro.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
			</header>
			<div className="legal-content">
				{document.sections.map((section) => (
					<section key={section.title}>
						<h2>{section.title}</h2>
						{section.body?.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
						{section.items ? (
							<ul>
								{section.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						) : null}
					</section>
				))}
			</div>
			<p className="legal-updated">Last updated {document.lastUpdated}</p>
		</main>
	);
}

export function App() {
	const { i18n } = useTranslation();
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const language =
		languageFromCode(i18n.resolvedLanguage ?? i18n.language) ??
		getInitialLanguage();
	const legalPage = getPathLegalPage(window.location.pathname);
	const englishLegalDocuments = legalDocumentsByLanguage.en ?? legalDocuments;
	const localizedLegalDocuments =
		legalDocumentsByLanguage[language] ?? englishLegalDocuments;
	const legalDocument = legalPage
		? (localizedLegalDocuments[legalPage] ?? englishLegalDocuments[legalPage])
		: undefined;
	const t =
		(i18n.getResourceBundle(language, "translation") as
			| WebsiteTranslation
			| undefined) ?? resources[language].translation;
	const languagePath = getLanguagePath(language);
	const pagePath = getLanguagePath(language, legalPage);
	const pageUrl = getLanguageUrl(language, legalPage);

	const changeLanguage = (nextLanguage: Language) => {
		const nextPath = getLanguagePath(nextLanguage, legalPage);
		window.history.pushState(null, "", nextPath);
		void i18n.changeLanguage(nextLanguage);
		setMobileMenuOpen(false);
	};

	const scrollToSection = (id: string) => {
		setMobileMenuOpen(false);
		if (legalPage) {
			window.location.href = `${languagePath}#${id}`;
			return;
		}
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
		window.history.replaceState(null, "", `${languagePath}#${id}`);
	};

	useEffect(() => {
		document.documentElement.lang = language;
		document.documentElement.dir = languageDirections[language];
		const title = legalDocument
			? `${legalDocument.title} | CommentVia`
			: language === "en"
				? "CommentVia - Instagram comment to DM automation"
				: `${t.hero.title} | CommentVia`;
		const description = legalDocument?.description ?? defaultDescription;

		document.title = title;
		setMetaTag('meta[http-equiv="content-language"]', {
			content: language,
			"http-equiv": "content-language",
		});
		setMetaTag('meta[name="description"]', {
			content: description,
			name: "description",
		});
		setMetaTag('meta[name="robots"]', {
			content: "index, follow, max-image-preview:large",
			name: "robots",
		});
		setMetaTag('meta[property="og:title"]', {
			content: title,
			property: "og:title",
		});
		setMetaTag('meta[property="og:description"]', {
			content: description,
			property: "og:description",
		});
		setMetaTag('meta[property="og:url"]', {
			content: pageUrl,
			property: "og:url",
		});
		setMetaTag('meta[property="og:image"]', {
			content: ogImageUrl,
			property: "og:image",
		});
		setMetaTag('meta[property="og:image:width"]', {
			content: "1200",
			property: "og:image:width",
		});
		setMetaTag('meta[property="og:image:height"]', {
			content: "630",
			property: "og:image:height",
		});
		setMetaTag('meta[property="og:locale"]', {
			content: openGraphLocales[language],
			property: "og:locale",
		});
		setMetaTag('meta[name="twitter:title"]', {
			content: title,
			name: "twitter:title",
		});
		setMetaTag('meta[name="twitter:description"]', {
			content: description,
			name: "twitter:description",
		});
		setMetaTag('meta[name="twitter:image"]', {
			content: ogImageUrl,
			name: "twitter:image",
		});

		setHeadLink('link[rel="canonical"]', {
			rel: "canonical",
			href: pageUrl,
		});

		for (const option of supportedLanguages) {
			setHeadLink(`link[rel="alternate"][hreflang="${option}"]`, {
				rel: "alternate",
				hreflang: option,
				href: getLanguageUrl(option, legalPage),
			});
		}

		setHeadLink('link[rel="alternate"][hreflang="x-default"]', {
			rel: "alternate",
			hreflang: "x-default",
			href: legalPage ? getLanguageUrl("en", legalPage) : `${siteUrl}/`,
		});
	}, [language, legalDocument, legalPage, pageUrl]);

	useEffect(() => {
		if (!getPathLanguage(window.location.pathname)) {
			window.history.replaceState(
				null,
				"",
				`${pagePath}${window.location.search}${window.location.hash}`,
			);
		}

		const syncLanguageFromPath = () => {
			void i18n.changeLanguage(
				getPathLanguage(window.location.pathname) ?? getBrowserLanguage(),
			);
		};

		window.addEventListener("popstate", syncLanguageFromPath);
		return () => window.removeEventListener("popstate", syncLanguageFromPath);
	}, [pagePath]);

	useEffect(() => {
		const root = document.documentElement;
		const applyTheme = () => {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			const resolvedTheme =
				theme === "system" ? (prefersDark ? "dark" : "light") : theme;
			root.classList.toggle("dark", resolvedTheme === "dark");
			root.dataset.theme = theme;
		};

		applyTheme();
		localStorage.setItem("commentvia-theme", theme);

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", applyTheme);
		return () => media.removeEventListener("change", applyTheme);
	}, [theme]);

	useEffect(() => {
		document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMobileMenuOpen(false);
			}
		};

		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [mobileMenuOpen]);

	return (
		<div className="site-shell">
			<header className="site-header">
				<a className="brand" href={languagePath} aria-label="CommentVia home">
					<img src={logoMarkUrl} alt="" />
					<span>CommentVia</span>
				</a>
				<nav className="site-nav" aria-label="Main navigation">
					<a href={`${languagePath}#how`}>{t.nav.how}</a>
					<a href={`${languagePath}#use-cases`}>{t.nav.useCases}</a>
					<a href={`${languagePath}#pricing`}>{t.nav.pricing}</a>
					<a href={`${languagePath}#faq`}>{t.nav.faq}</a>
				</nav>
				<div className="header-actions">
					<details className="language-menu">
						<summary aria-label={t.nav.language}>
							<span aria-hidden="true" className="language-flag">
								{languageFlags[language]}
							</span>
						</summary>
						<div className="language-popover">
							{supportedLanguages.map((option) => (
								<a
									key={option}
									href={getLanguagePath(option, legalPage)}
									hrefLang={option}
									lang={option}
									aria-current={language === option ? "page" : undefined}
									onClick={(event) => {
										event.preventDefault();
										changeLanguage(option);
										event.currentTarget
											.closest("details")
											?.removeAttribute("open");
									}}
								>
									<span aria-hidden="true" className="language-flag">
										{languageFlags[option]}
									</span>
									<span>{languageLabels[option]}</span>
								</a>
							))}
						</div>
					</details>
					<a className="button secondary-button" href={signInUrl}>
						{t.nav.signIn}
					</a>
					<a className="button primary-button" href={signUpUrl}>
						{t.nav.getStarted}
						<ArrowRight size={17} />
					</a>
				</div>
				<button
					className="mobile-menu-button"
					type="button"
					aria-label={t.nav.menu}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-menu-sheet"
					onClick={() => setMobileMenuOpen(true)}
				>
					<Menu size={20} />
				</button>
			</header>

			{mobileMenuOpen ? (
				<div className="mobile-menu-layer">
					<button
						className="mobile-menu-backdrop"
						type="button"
						aria-label={t.nav.closeMenu}
						onClick={() => setMobileMenuOpen(false)}
					/>
					<aside
						className="mobile-menu-sheet"
						id="mobile-menu-sheet"
						aria-label={t.nav.menu}
					>
						<div className="mobile-sheet-header">
							<button
								className="brand"
								type="button"
								aria-label="CommentVia home"
								onClick={() => scrollToSection("top")}
							>
								<img src={logoMarkUrl} alt="" />
								<span>CommentVia</span>
							</button>
							<button
								className="mobile-menu-close"
								type="button"
								aria-label={t.nav.closeMenu}
								onClick={() => setMobileMenuOpen(false)}
							>
								<X size={20} />
							</button>
						</div>
						<nav className="mobile-sheet-nav" aria-label="Mobile navigation">
							<button type="button" onClick={() => scrollToSection("how")}>
								{t.nav.how}
							</button>
							<button
								type="button"
								onClick={() => scrollToSection("use-cases")}
							>
								{t.nav.useCases}
							</button>
							<button type="button" onClick={() => scrollToSection("pricing")}>
								{t.nav.pricing}
							</button>
							<button type="button" onClick={() => scrollToSection("faq")}>
								{t.nav.faq}
							</button>
						</nav>
						<nav className="mobile-sheet-languages" aria-label={t.nav.language}>
							{supportedLanguages.map((option) => (
								<a
									key={option}
									href={getLanguagePath(option, legalPage)}
									hrefLang={option}
									lang={option}
									aria-current={language === option ? "page" : undefined}
									onClick={(event) => {
										event.preventDefault();
										changeLanguage(option);
									}}
								>
									<span aria-hidden="true" className="language-flag">
										{languageFlags[option]}
									</span>
									<span>{languageLabels[option]}</span>
								</a>
							))}
						</nav>
						<div className="mobile-sheet-actions">
							<a
								className="button secondary-button"
								href={signInUrl}
								onClick={() => setMobileMenuOpen(false)}
							>
								{t.nav.signIn}
							</a>
							<a
								className="button primary-button"
								href={signUpUrl}
								onClick={() => setMobileMenuOpen(false)}
							>
								{t.nav.getStarted}
								<ArrowRight size={17} />
							</a>
						</div>
					</aside>
				</div>
			) : null}

			{legalDocument ? (
				<LegalDocumentPage document={legalDocument} />
			) : (
				<main id="top">
					<section className="hero-section" aria-labelledby="hero-title">
						<div className="hero-copy">
							<h1 id="hero-title">{t.hero.title}</h1>
							<p>{t.hero.body}</p>
							<div className="hero-actions-inline">
								<a className="button primary-button" href={signUpUrl}>
									{t.nav.getStarted}
									<ArrowRight size={17} />
								</a>
								<a className="button secondary-button" href={signInUrl}>
									{t.nav.signIn}
								</a>
							</div>
							<ul className="proof-list" aria-label="CommentVia benefits">
								{t.hero.proofs.map((proof) => (
									<li key={proof}>
										<Check size={17} />
										{proof}
									</li>
								))}
							</ul>
						</div>

						<div className="hero-preview" id="rules">
							<img
								src={heroPreviewUrl}
								alt="CommentVia rule builder and live Instagram DM preview"
							/>
							<span className="author-reply-overlay">
								<img src={authorAvatarUrl} alt="" />
								<span>
									<strong>{t.hero.replyAccount}</strong>
									{t.hero.replyText}
								</span>
							</span>
						</div>
					</section>

					<section className="section-grid" id="how">
						<div className="section-copy">
							<span className="section-kicker">
								<Sparkles size={16} />
								{t.nav.how}
							</span>
							<h2>{t.workflow.title}</h2>
							<p>{t.workflow.body}</p>
						</div>
						<div className="step-stack">
							{t.workflow.steps.map(([title, text], index) => (
								<article className="workflow-step" key={title}>
									<span>{index + 1}</span>
									<div>
										<h3>{title}</h3>
										<p>{text}</p>
									</div>
								</article>
							))}
						</div>
					</section>

					<section className="feature-band" id="use-cases">
						<div className="section-heading">
							<h2>{t.useCases.title}</h2>
						</div>
						<div className="card-grid three">
							{t.useCases.items.map(([title, text]) => (
								<article className="feature-card" key={title}>
									<Sparkles size={21} />
									<h3>{title}</h3>
									<p>{text}</p>
								</article>
							))}
						</div>
					</section>

					<section className="pricing-section" id="pricing">
						<div className="section-heading">
							<h2>{t.pricing.title}</h2>
							<p>{t.pricing.body}</p>
						</div>
						<article className="pricing-card">
							<div>
								<h3>{t.pricing.plan}</h3>
								<p>
									<strong>{t.pricing.price}</strong>
									<span>{t.pricing.period}</span>
								</p>
							</div>
							<ul>
								{t.pricing.features.map((feature) => (
									<li key={feature}>
										<Check size={17} />
										{feature}
									</li>
								))}
							</ul>
							<a className="button primary-button" href={signUpUrl}>
								{t.nav.getStarted}
								<ArrowRight size={17} />
							</a>
						</article>
					</section>

					<section className="faq-section" id="faq">
						<h2>{t.faq.title}</h2>
						<div className="faq-list">
							{t.faq.items.map(([question, answer]) => (
								<details key={question}>
									<summary>{question}</summary>
									<p>{answer}</p>
								</details>
							))}
						</div>
					</section>

					<section className="cta-section" aria-labelledby="cta-title">
						<div>
							<h2 id="cta-title">{t.cta.title}</h2>
							<p>{t.cta.body}</p>
						</div>
						<a className="button primary-button" href={signUpUrl}>
							{t.nav.getStarted}
							<ArrowRight size={17} />
						</a>
					</section>
				</main>
			)}

			<footer className="site-footer">
				<div className="footer-brand">
					<img src={logoMarkUrl} alt="" />
					<div>
						<strong>CommentVia</strong>
						<p>{t.footer.tagline}</p>
					</div>
				</div>
				<nav className="footer-links" aria-label="Legal links">
					<a href={getLanguagePath(language, "privacy")}>
						{localizedLegalDocuments.privacy.title}
					</a>
					<a href={getLanguagePath(language, "terms")}>
						{localizedLegalDocuments.terms.title}
					</a>
					<a href={getLanguagePath(language, "data-deletion")}>
						{localizedLegalDocuments["data-deletion"].title}
					</a>
				</nav>
				<fieldset className="theme-switch">
					<legend className="sr-only">{t.footer.theme}</legend>
					<div
						className="theme-toggle"
						style={
							{
								"--theme-index": themeOrder.indexOf(theme),
							} as CSSProperties
						}
					>
						<span aria-hidden="true" className="theme-toggle-thumb" />
						<button
							type="button"
							aria-label={t.footer.system}
							aria-pressed={theme === "system"}
							onClick={() => setTheme("system")}
						>
							<Monitor size={15} />
							<span>{t.footer.system}</span>
						</button>
						<button
							type="button"
							aria-label={t.footer.light}
							aria-pressed={theme === "light"}
							onClick={() => setTheme("light")}
						>
							<Sun size={15} />
							<span>{t.footer.light}</span>
						</button>
						<button
							type="button"
							aria-label={t.footer.dark}
							aria-pressed={theme === "dark"}
							onClick={() => setTheme("dark")}
						>
							<Moon size={15} />
							<span>{t.footer.dark}</span>
						</button>
					</div>
				</fieldset>
			</footer>
		</div>
	);
}
