import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const commonOptions = {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  /** Transaction pooler (PgBouncer) does not support prepared statements the same way. */
  prepare: false as const,
  ssl: "require" as const
};

function createClient() {
  const host =
    process.env.SUPABASE_DB_HOST ?? process.env.POSTGRES_HOST ?? "";
  const user =
    process.env.SUPABASE_DB_USER ?? process.env.POSTGRES_USER ?? "";
  const password =
    process.env.SUPABASE_DB_PASSWORD ?? process.env.POSTGRES_PASSWORD;
  const database =
    process.env.SUPABASE_DB_NAME ??
    process.env.POSTGRES_DATABASE ??
    "postgres";
  const port = Number(
    process.env.SUPABASE_DB_PORT ?? process.env.POSTGRES_PORT ?? 6543
  );

  if (host && user && password !== undefined && password !== "") {
    return postgres({
      host,
      port,
      database,
      user,
      password,
      ...commonOptions
    });
  }

  const url =
    process.env.SUPABASE_DB_URL_POOLED ?? process.env.DATABASE_URL ?? "";
  if (!url.trim()) {
    throw new Error(
      "Database not configured: set SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD (recommended; avoids URL-encoding issues), or set SUPABASE_DB_URL_POOLED / DATABASE_URL."
    );
  }

  return postgres(url, { ...commonOptions });
}

export const sql = createClient();
export const db = drizzle(sql);
