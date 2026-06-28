FROM oven/bun:1-slim

ENV NODE_ENV=production

RUN apt-get update \
	&& apt-get install -y --no-install-recommends curl ca-certificates \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package.json bun.lock tsconfig.json tsconfig.base.json ./
COPY patches ./patches
COPY apps ./apps

RUN bun install --frozen-lockfile --production && bun pm cache rm

WORKDIR /workspace/apps/api

EXPOSE 41412
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD curl -f http://localhost:${PORT:-41412}/health || exit 1

CMD ["bun", "src/index.ts"]
