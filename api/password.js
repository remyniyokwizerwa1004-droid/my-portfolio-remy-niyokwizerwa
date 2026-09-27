import { requireAuth, verifyPassword, changePassword, setSessionCookie } from './_lib/auth.js';
import { handler, readJson, send, methodNotAllowed, HttpError } from './_lib/http.js';

export default handler(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!(await requireAuth(req, res))) return;

  const { current, next } = await readJson(req, 10_000);
  if (typeof next !== 'string' || next.length < 10) {
    throw new HttpError(400, 'New password must be at least 10 characters');
  }
  if (!(await verifyPassword(current))) throw new HttpError(403, 'Current password is wrong');

  await changePassword(next);
  // The old cookie is now invalid; issue one signed for the new password.
  await setSessionCookie(req, res);
  send(res, 200, { ok: true });
});
