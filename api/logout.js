import { clearSessionCookie } from './_lib/auth.js';
import { handler, send, methodNotAllowed } from './_lib/http.js';

export default handler(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  clearSessionCookie(req, res);
  send(res, 200, { ok: true });
});
