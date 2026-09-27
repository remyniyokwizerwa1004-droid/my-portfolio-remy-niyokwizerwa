// Local stand-in for Vercel: serves public/ and routes /api/<name> to api/<name>.js.
// Usage: npm run dev   (reads DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET from .env.local)
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const api = url.pathname.match(/^\/api\/([\w-]+)$/);
  if (api) {
    const file = path.join(root, 'api', api[1] + '.js');
    try {
      const mod = await import(pathToFileURL(file).href);
      return await mod.default(req, res);
    } catch (err) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') { res.statusCode = 404; return res.end('Not found'); }
      console.error(err);
      res.statusCode = 500;
      return res.end('Server error');
    }
  }
  let p = url.pathname === '/' ? '/index.html' : url.pathname;
  if (!path.extname(p)) p += '.html';
  const file = path.join(root, 'public', path.normalize(p));
  if (!file.startsWith(path.join(root, 'public'))) { res.statusCode = 403; return res.end(); }
  try {
    const data = await fs.readFile(file);
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`Dev server: http://localhost:${PORT}  (editor: /admin)`));
