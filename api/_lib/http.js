// Small helpers so handlers work both on Vercel and in scripts/dev-server.js.

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!('Cache-Control' in headers)) res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(res, allowed) {
  send(res, 405, { error: 'Method not allowed' }, { Allow: allowed.join(', ') });
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Reads a JSON body. Vercel may have parsed it already into req.body.
export async function readJson(req, limit = 1_000_000) {
  const ct = String(req.headers['content-type'] || '');
  if (!ct.includes('application/json')) throw new HttpError(415, 'Expected JSON');

  let raw;
  const pre = req.body;
  if (pre && typeof pre === 'object' && !Buffer.isBuffer(pre)) return pre;
  if (typeof pre === 'string') raw = pre;
  else if (Buffer.isBuffer(pre)) raw = pre.toString('utf8');
  else {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > limit) throw new HttpError(413, 'Request too large');
      chunks.push(chunk);
    }
    raw = Buffer.concat(chunks).toString('utf8');
  }
  if (raw.length > limit) throw new HttpError(413, 'Request too large');
  try {
    return JSON.parse(raw || '{}');
  } catch {
    throw new HttpError(400, 'Invalid JSON');
  }
}

export function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function isHttps(req) {
  return req.headers['x-forwarded-proto'] === 'https' || !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host || '');
}

// Wraps a handler so thrown HttpErrors become JSON responses.
export function handler(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message });
      console.error(err);
      send(res, 500, { error: err.expose ? err.message : 'Server error' });
    }
  };
}
