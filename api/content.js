import { db, ensureSchema } from './_lib/db.js';
import { requireAuth } from './_lib/auth.js';
import { handler, readJson, send, methodNotAllowed, HttpError } from './_lib/http.js';
import { DEFAULT_CONTENT } from './_lib/defaults.js';

export default handler(async (req, res) => {
  if (req.method === 'GET') {
    await ensureSchema();
    const rows = await db()`SELECT data, updated_at FROM content WHERE id = 1`;
    const data = { ...DEFAULT_CONTENT, ...(rows[0]?.data || {}) };
    return send(res, 200, { content: data, updatedAt: rows[0]?.updated_at ?? null });
  }

  if (req.method === 'PUT') {
    if (!(await requireAuth(req, res))) return;
    const body = await readJson(req, 1_000_000);
    const content = body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      throw new HttpError(400, 'Missing content');
    }
    await ensureSchema();
    const rows = await db()`INSERT INTO content (id, data, updated_at)
      VALUES (1, ${JSON.stringify(content)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      RETURNING updated_at`;
    return send(res, 200, { ok: true, updatedAt: rows[0].updated_at });
  }

  methodNotAllowed(res, ['GET', 'PUT']);
});
