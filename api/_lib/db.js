import { neon } from '@neondatabase/serverless';

let sql;
let ready;

export function db() {
  if (!sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) {
      const err = new Error('DATABASE_URL is not configured');
      err.expose = true;
      throw err;
    }
    sql = neon(url);
  }
  return sql;
}

// Creates the tables on first use; memoized per server instance.
export function ensureSchema() {
  ready ??= (async () => {
    const q = db();
    await q`CREATE TABLE IF NOT EXISTS content (
      id int PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
    await q`CREATE TABLE IF NOT EXISTS files (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      mime text NOT NULL,
      size int NOT NULL,
      data_b64 text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await q`CREATE TABLE IF NOT EXISTS settings (
      key text PRIMARY KEY,
      value jsonb NOT NULL
    )`;
  })().catch((err) => {
    ready = undefined;
    throw err;
  });
  return ready;
}

export async function getSetting(key) {
  await ensureSchema();
  const rows = await db()`SELECT value FROM settings WHERE key = ${key}`;
  return rows[0]?.value ?? null;
}

export async function setSetting(key, value) {
  await ensureSchema();
  await db()`INSERT INTO settings (key, value) VALUES (${key}, ${JSON.stringify(value)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
}
