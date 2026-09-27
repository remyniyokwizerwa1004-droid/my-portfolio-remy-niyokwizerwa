import crypto from 'node:crypto';
import { getSetting, setSetting } from './db.js';
import { parseCookies, isHttps, send } from './http.js';

const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function config(name) {
  const v = process.env[name];
  if (!v) {
    const err = new Error(`${name} is not configured`);
    err.expose = true;
    throw err;
  }
  return v;
}

const sha256 = (s) => crypto.createHash('sha256').update(s).digest();

function scrypt(password, salt) {
  return new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)))
  );
}

// The password set from the editor (stored hashed in the DB) wins over the
// ADMIN_PASSWORD environment variable, which is only the initial password.
async function storedPassword() {
  return getSetting('password');
}

export async function verifyPassword(password) {
  if (typeof password !== 'string' || !password) return false;
  const stored = await storedPassword();
  if (stored) {
    const key = await scrypt(password, Buffer.from(stored.salt, 'hex'));
    return crypto.timingSafeEqual(key, Buffer.from(stored.hash, 'hex'));
  }
  return crypto.timingSafeEqual(sha256(password), sha256(config('ADMIN_PASSWORD')));
}

export async function changePassword(next) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(next, salt);
  await setSetting('password', { salt: salt.toString('hex'), hash: key.toString('hex') });
}

// Session signatures depend on the current password, so changing it signs
// out every other session.
async function signingKey() {
  const stored = await storedPassword();
  const pwMaterial = stored ? stored.hash : sha256(config('ADMIN_PASSWORD')).toString('hex');
  return crypto.createHmac('sha256', config('SESSION_SECRET')).update('session:' + pwMaterial).digest();
}

const sign = (key, payload) => crypto.createHmac('sha256', key).update(payload).digest('hex');

export async function setSessionCookie(req, res) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = `${exp}.${sign(await signingKey(), String(exp))}`;
  res.setHeader('Set-Cookie',
    `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${isHttps(req) ? '; Secure' : ''}`);
}

export function clearSessionCookie(req, res) {
  res.setHeader('Set-Cookie',
    `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isHttps(req) ? '; Secure' : ''}`);
}

export async function isAuthed(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(await signingKey(), expStr), 'hex');
  const given = Buffer.from(sig, 'hex');
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

// Sends 401 and returns false when the request has no valid session.
export async function requireAuth(req, res) {
  if (await isAuthed(req)) return true;
  send(res, 401, { error: 'Not signed in' });
  return false;
}
