import { db, ensureSchema } from './_lib/db.js';
import { handler, send, methodNotAllowed } from './_lib/http.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default handler(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, ['GET', 'HEAD']);

  const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
  if (!UUID.test(id)) return send(res, 404, { error: 'Not found' });

  await ensureSchema();
  const rows = await db()`SELECT name, mime, data_b64 FROM files WHERE id = ${id}`;
  if (!rows.length) return send(res, 404, { error: 'Not found' });

  const { name, mime, data_b64 } = rows[0];
  const bytes = Buffer.from(data_b64, 'base64');
  res.statusCode = 200;
  res.setHeader('Content-Type', mime);
  res.setHeader('Content-Length', bytes.length);
  // Files never change once uploaded (a new upload gets a new id).
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Content-Disposition', `inline; filename="${name.replace(/"/g, '')}"`);
  res.end(req.method === 'HEAD' ? undefined : bytes);
});
