# Jumon MCP Ads Manager

Monorepo for the Jumon MVP:

- `apps/web`: user-facing Next.js app (Clerk auth + **LinkedIn and Google** connect UX) built with **[shadcn/ui](https://ui.shadcn.com)**. Interface primitives (Radix UI + Tailwind) live as **vendored source** under `apps/web/components/ui/`, not as a traditional npm “UI kit” package. The shadcn config is in [`apps/web/components.json`](apps/web/components.json). To add or update components, from `apps/web` run: `pnpm dlx shadcn@latest add <component>`.
- `packages/domain`: business use cases and ports
- `packages/db`: Supabase Postgres schema and queries
- `packages/auth`: shared auth guards for internal routes
- `packages/linkedin`: LinkedIn OAuth and API helpers
- `packages/ui`: shared UI helpers/components

## Architecture Summary

- Clerk is the shared auth/authorization server.
- LinkedIn and Google OAuth are initiated from `apps/web`.
- Provider tokens are encrypted before persistence.
- `apps/web` backend routes are the only component allowed to decrypt and use LinkedIn tokens.
- The separate LinkedIn MCP server calls `apps/web` internal authenticated endpoints.

## Infra (Supabase + Clerk)

Supabase was provisioned via the Supabase MCP; the OAuth schema is applied. See [docs/infra.md](docs/infra.md) for project ref, dashboard links, and where to paste DB URLs.

**Clerk:** the Clerk MCP only provides SDK snippets—it cannot create a Clerk application. Create a Clerk app in the [dashboard](https://dashboard.clerk.com) and copy keys into `apps/web/.env.local` (see [docs/infra.md](docs/infra.md)).

## Quick Start

1. Copy `.env.example` to `apps/web/.env.local` and fill all required values.
2. Install dependencies:

```bash
corepack pnpm install
```

3. Run apps:

```bash
corepack pnpm dev
```

Turbo needs a `pnpm` binary on `PATH` when it starts workspace tasks. This repo adds `pnpm` as a devDependency and runs Turbo via `scripts/run-turbo.mjs`, which prepends `node_modules/.bin` to `PATH`. If you still see “cannot find binary path”, run `corepack pnpm install` again from the repo root.

- Web: `http://localhost:3000`

## Gateway Endpoints (MVP)

- `GET /api/internal/connections/linkedin/current?userId=...`
- `POST /api/internal/linkedin/proxy/*`
- `POST /api/internal/linkedin/refresh`

All gateway internal endpoints require:

- `x-gateway-secret: <GATEWAY_INTERNAL_SECRET>`

## MCP Caller Target

For the separate LinkedIn MCP server, target these internal endpoints on the same deployed app domain:

- `https://<your-web-domain>/api/internal/connections/linkedin/current`
- `https://<your-web-domain>/api/internal/linkedin/proxy/*`
- `https://<your-web-domain>/api/internal/linkedin/refresh`

## Supabase Notes

- Prefer **`SUPABASE_DB_HOST` / `SUPABASE_DB_USER` / `SUPABASE_DB_PASSWORD`** (see `.env.example`) so database passwords with `@`, `%`, or other special characters do not break the connection string parser.
- Alternatively use `SUPABASE_DB_URL_POOLED` with a **URL-encoded** password.
- Migrations/admin tooling should use `SUPABASE_DB_URL_DIRECT`.
- Enable Supabase observability dashboards and alerts for pool pressure and slow token lookup queries.
