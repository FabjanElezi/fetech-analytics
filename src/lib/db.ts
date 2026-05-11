// ─── Neon serverless Postgres client (lazy initialisation) ───────────────────
// We create the sql() function on first use so a missing or placeholder
// DATABASE_URL does not crash the build.
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url || url.includes("REPLACE_ME")) {
      throw new Error("DATABASE_URL is not configured. Add it to .env.local.");
    }
    _sql = neon(url);
  }
  return _sql;
}

export async function initDb() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS user_dashboards (
      user_id      VARCHAR(255) PRIMARY KEY,
      data         JSONB        NOT NULL,
      company_name VARCHAR(255),
      file_name    VARCHAR(255),
      updated_at   TIMESTAMPTZ  DEFAULT NOW()
    )
  `;
}
