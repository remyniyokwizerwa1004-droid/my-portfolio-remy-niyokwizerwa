import crypto from 'node:crypto';
import { db, ensureSchema } from './_lib/db.js';
import { requireAuth } from './_lib/auth.js';
import { handler, readJson, send, methodNotAllowed, HttpError } from './_lib/http.js';

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);

export default handler(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!(await requireAuth(req, res))) return;

  const { name, mime, data } = await readJson(req, 4_400_000);
  if (!ALLOWED.has(mime)) throw new HttpError(415, 'Only JPG, PNG, WebP, GIF images or PDF files are allowed');
  if (typeof data !== 'string' || !data) throw new HttpError(400, 'Missing file data');

  const bytes = Buffer.from(data, 'base64');
  if (!bytes.length) throw new HttpError(400, 'Empty file');
  if (bytes.length > MAX_BYTES) throw new HttpError(413, 'File is larger than 3 MB');

  const id = crypto.randomUUID();
  const safeName = String(name || 'file').replace(/[^\w.\- ]+/g, '_').slice(0, 120);
  await ensureSchema();
  await db()`INSERT INTO files (id, name, mime, size, data_b64)
    VALUES (${id}, ${safeName}, ${mime}, ${bytes.length}, ${bytes.toString('base64')})`;

  send(res, 201, { url: `/api/file?id=${id}`, name: safeName, size: bytes.length });
});
