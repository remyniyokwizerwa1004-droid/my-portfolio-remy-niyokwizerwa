import { verifyPassword, setSessionCookie } from './_lib/auth.js';
import { handler, readJson, send, methodNotAllowed } from './_lib/http.js';

export default handler(async (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const { password } = await readJson(req, 10_000);
  if (!(await verifyPassword(password))) {
    // Slow down password guessing.
    await new Promise((r) => setTimeout(r, 1000));
    return send(res, 401, { error: 'Wrong password' });
  }
  await setSessionCookie(req, res);
  send(res, 200, { ok: true });
});
