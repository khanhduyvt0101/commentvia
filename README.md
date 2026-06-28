# CommentVia

CommentVia is a simple creator tool for Instagram comment-to-DM automations.

The product focus is intentionally narrow:

1. Connect an Instagram Creator or Business account.
2. Paste a post or Reel URL.
3. Add a keyword like `outfit`.
4. Send a private DM with the matching shopping link when a viewer comments that keyword.

## Meta Approval

Local development can use simulated events and app tester accounts. A production SaaS that connects accounts outside the app's roles needs Meta App Review and Advanced Access for Instagram comment and messaging permissions.

Use the smallest permission set possible:

- Facebook Login for app sign-in: `email`, `public_profile`.
- Google sign-in: `openid`, `email`, `profile`.
- Meta Instagram connection: `instagram_business_basic`, `instagram_business_manage_comments`, `instagram_business_manage_messages`.

Required public URLs for review:

- Homepage: `https://commentvia.com/`
- Privacy policy: `https://commentvia.com/en/privacy`
- Terms: `https://commentvia.com/en/terms`
- Data deletion instructions: `https://commentvia.com/en/data-deletion`
- Meta data deletion callback: `https://api.commentvia.com/meta/data-deletion`
- Meta OAuth callback: `https://api.commentvia.com/meta/oauth/callback`
- Google OAuth callback: `https://api.commentvia.com/api/auth/callback/google`
- Facebook OAuth callback: `https://api.commentvia.com/api/auth/callback/facebook`

Reviewer-facing readiness metadata is available inside the app at `/connections` and through the API at `/rpc/platformReadiness`.

## OAuth Environment

```bash
API_ORIGIN=https://api.commentvia.com
APP_ORIGIN=https://app.commentvia.com
WEBSITE_ORIGIN=https://commentvia.com
SUPPORT_EMAIL=khanhduyvt0101@gmail.com
DATABASE_URL=
BETTER_AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

META_APP_ID=
META_APP_SECRET=
META_GRAPH_API_VERSION=v24.0
META_REDIRECT_URI=https://api.commentvia.com/meta/oauth/callback
META_WEBHOOK_VERIFY_TOKEN=
META_PAGE_ACCESS_TOKEN=
```

Keep Google OAuth to non-sensitive scopes unless a later feature truly needs a Google API. For Meta review, include a screen recording that starts at `/connections`, connects an Instagram professional account, creates a keyword rule, receives a comment webhook, posts the public reply, and sends the private message/link.

## Commands

```bash
bun install
bun dev
bun run i18n:prepare
bun --filter @commentvia/api db:generate
bun --filter @commentvia/api db:migrate
bun typecheck
bun run check
```

## Environment

All local environment variables live in the root `.env.local` file. Package-local env files should not be used; add new package env values to the root file instead.

Vite apps read the root env file through `envDir`, and API/Drizzle code loads the same file before reading `process.env`.

## Translations

The website and SPA use `react-i18next` at runtime and `i18next-cli` for extraction, sync, status, and TypeScript resource types.

```bash
bun run i18n:extract
bun run i18n:sync
bun run i18n:types
```

Run the full locale maintenance flow with:

```bash
bun run i18n:prepare
```

SPA locale resources live in `apps/spa/app/locales/<language>/translation.json`, and generated i18next types live in `apps/spa/app/types`.

Website locale resources live in `apps/website/src/locales/<language>/translation.json`, and generated i18next types live in `apps/website/src/types`.

## Packages

- `apps/website`: public landing page for creators.
- `apps/spa`: creator-facing React Router SPA dashboard.
- `apps/api`: Meta webhook and private reply skeleton.
- `apps/util`: shared rule/event types and matching helpers.

## Database

The API uses Better Auth migrations for auth tables and Drizzle ORM migrations for CommentVia app tables. Update `apps/api/src/db/schema.ts`, generate SQL with `bun --filter @commentvia/api db:generate`, then apply migrations with `bun --filter @commentvia/api db:migrate`.

`bun local-up` starts Postgres and runs the API migration command automatically.

## Release

Changesets coordinates versions across the website, SPA, API, and internal workspace packages.

```bash
bun run release:plan
bun run release:version
```

The GitHub release workflow can be triggered manually from `main` or by merging a PR with the `release` label. A release commit creates a `v*` tag. That tag triggers CI/CD:

- `@commentvia/api` triggers the Dokploy app stored in `COMMENTVIA_API_DOKPLOY_APP_ID`; Dokploy builds `apps/api/Dockerfile` from the GitHub repository.
- `@commentvia/website` builds `apps/website` and deploys to the Vercel project stored in `COMMENTVIA_WEBSITE_VERCEL_PROJECT_ID`.
- `@commentvia/spa` builds `apps/spa` and deploys to the Vercel project stored in `COMMENTVIA_APP_VERCEL_PROJECT_ID`.

Required GitHub settings:

- Secret: `DOKPLOY_API_KEY`
- Variable: `COMMENTVIA_API_DOKPLOY_APP_ID`
- Secret: `VERCEL_TOKEN`
- Variable: `VERCEL_ORG_ID`
- Variable: `COMMENTVIA_WEBSITE_VERCEL_PROJECT_ID`
- Variable: `COMMENTVIA_APP_VERCEL_PROJECT_ID`

Required Dokploy app environment:

```bash
NODE_ENV=production
PORT=41412
DATABASE_URL=
BETTER_AUTH_SECRET=
API_ORIGIN=https://api.commentvia.com
APP_ORIGIN=https://app.commentvia.com
WEBSITE_ORIGIN=https://commentvia.com
SUPPORT_EMAIL=khanhduyvt0101@gmail.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
META_APP_ID=
META_APP_SECRET=
META_GRAPH_API_VERSION=v24.0
META_REDIRECT_URI=https://api.commentvia.com/meta/oauth/callback
META_WEBHOOK_VERIFY_TOKEN=
META_PAGE_ACCESS_TOKEN=
```
