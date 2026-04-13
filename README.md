# Jumon MCP Ads Manager

Monorepo for the Jumon MVP:

- `apps/web`: user-facing Next.js app (Clerk auth + LinkedIn connect UX)
- `apps/gateway`: internal Next.js API gateway for MCP-server to provider calls
- `packages/domain`: business use cases and ports
- `packages/db`: Supabase Postgres schema and queries
- `packages/auth`: shared auth guards for internal routes
- `packages/linkedin`: LinkedIn OAuth and API helpers
- `packages/ui`: shared UI helpers/components

## Architecture Summary

- Clerk is the shared auth/authorization server.
- LinkedIn OAuth is initiated from `apps/web`.
- Provider tokens are encrypted before persistence.
- `apps/gateway` is the only component allowed to decrypt and use LinkedIn tokens.
- The separate LinkedIn MCP server calls `apps/gateway` through internal authenticated endpoints.

## Infra (Supabase + Clerk)

Supabase was provisioned via the Supabase MCP; the OAuth schema is applied. See [docs/infra.md](docs/infra.md) for project ref, dashboard links, and where to paste DB URLs.

**Clerk:** the Clerk MCP only provides SDK snippets—it cannot create a Clerk application. Create a Clerk app in the [dashboard](https://dashboard.clerk.com) and copy keys into `apps/web/.env.local` (see [docs/infra.md](docs/infra.md)).

## Quick Start

1. Copy `.env.example` to `apps/web/.env.local` and `apps/gateway/.env.local` (same values where needed) and fill all required values.
2. Install dependencies:

```bash
corepack pnpm install
```

3. Run apps:

```bash
corepack pnpm dev
```

- Web: `http://localhost:3000`
- Gateway: `http://localhost:3001`

## Gateway Endpoints (MVP)

- `GET /api/internal/connections/linkedin/current?userId=...`
- `POST /api/internal/linkedin/proxy/*`
- `POST /api/internal/linkedin/refresh`

All gateway internal endpoints require:

- `x-gateway-secret: <GATEWAY_INTERNAL_SECRET>`

## Supabase Notes

- Runtime traffic should use `SUPABASE_DB_URL_POOLED`.
- Migrations/admin tooling should use `SUPABASE_DB_URL_DIRECT`.
- Enable Supabase observability dashboards and alerts for pool pressure and slow token lookup queries.
