# Infrastructure setup (Supabase + Clerk)

## Supabase (provisioned via MCP)

A Supabase project was created for this repo:

| Field | Value |
| --- | --- |
| **Name** | `mcp-ads-manager` |
| **Project ref** | `stpkcubfjurvoxwtroyf` |
| **Region** | `us-east-1` |
| **API URL** | `https://stpkcubfjurvoxwtroyf.supabase.co` |
| **Database host (direct)** | `db.stpkcubfjurvoxwtroyf.supabase.co` |

The initial OAuth schema migration was applied (`initial_oauth_schema`). Tables:

- `oauth_connections`
- `oauth_connection_tokens`
- `oauth_connection_events`
- `oauth_state_nonces`

### What you need to copy locally

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/stpkcubfjurvoxwtroyf) → **Project Settings** → **Database**.
2. Copy the **database password** (set at project creation if you have not changed it).
3. Build connection strings:
   - **Pooled (recommended for the app):** use **Connection pooling** (Session mode or Transaction mode per your driver). For `postgres.js`, the pooled URI is usually on the **Connect** panel under **Transaction pooler** (port `6543`).
   - **Direct:** use the **URI** or host `db.stpkcubfjurvoxwtroyf.supabase.co` (port `5432`) for migrations and admin tools.

Set in `apps/web/.env.local` and `apps/gateway/.env.local` (see root `.env.example`):

- `SUPABASE_PROJECT_URL=https://stpkcubfjurvoxwtroyf.supabase.co`
- `SUPABASE_DB_URL_POOLED=<transaction pooler URL from dashboard>`
- `SUPABASE_DB_URL_DIRECT=<direct postgres URL from dashboard>`

> Never commit real passwords or full connection strings to git.

### Observability

In the dashboard: **Reports** → **Database** (and project health) to monitor query latency and pool usage. Align alerts with [Supabase observability](https://supabase.com/docs/guides/platform/performance) for your plan.

---

## Clerk (manual — MCP cannot create applications)

The **Clerk MCP** in Cursor exposes SDK snippets and docs only; it does **not** create Clerk applications or return API keys.

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) and create an application (or use an existing one).
2. Under **API Keys**, copy:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`
3. Under **Paths** / **Domains**, add local development:
   - `http://localhost:3000`
4. Add production URLs when you deploy.

### Next.js + App Router

Follow the official Clerk Next.js App Router quickstart so middleware and `<ClerkProvider>` match your Clerk version. The repo already wires `ClerkProvider` and `clerkMiddleware` in `apps/web`.

---

## LinkedIn (manual)

Create a [LinkedIn Developer](https://www.linkedin.com/developers/) app, add the **Advertising API** product as needed, and set the **OAuth 2.0** redirect URL to exactly:

`http://localhost:3000/api/linkedin/callback`

(production URL when deployed). Use the same value for `LINKEDIN_REDIRECT_URI` in `.env.local`.
