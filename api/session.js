import { isAuthed } from './_lib/auth.js';
import { handler, send, methodNotAllowed } from './_lib/http.js';

export default handler(async (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  send(res, 200, { authed: await isAuthed(req) });
});
