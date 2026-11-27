// Gemensam hjälpkod för inloggning (filer som börjar med _ blir inte API-rutter på Vercel).
import { createHmac, timingSafeEqual } from 'node:crypto';

export type Role = 'owner' | 'mamma';
export const COOKIE = 'labbeliv_session';
export const MAX_AGE = 60 * 60 * 24 * 90; // 90 dagar

const b64 = (s: string) => Buffer.from(s).toString('base64url');

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('SESSION_SECRET saknas eller är för kort (minst 16 tecken).');
  return s;
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function makeToken(role: Role): string {
  const payload = b64(JSON.stringify({ role, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${payload}.${sign(payload)}`;
}

export function readToken(token: string | undefined): Role | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { role, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if ((role !== 'owner' && role !== 'mamma') || typeof exp !== 'number' || exp < Date.now() / 1000) return null;
    return role;
  } catch {
    return null;
  }
}

export function roleFromRequest(req: Request): Role | null {
  const cookie = req.headers.get('cookie') ?? '';
  const m = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  return readToken(m ? decodeURIComponent(m.slice(COOKIE.length + 1)) : undefined);
}

export function cookieHeader(value: string, maxAge: number): string {
  return `${COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', 'cmp').update(a).digest();
  const hb = createHmac('sha256', 'cmp').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });
