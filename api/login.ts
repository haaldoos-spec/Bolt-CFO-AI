import { MAX_AGE, cookieHeader, json, makeToken, safeEqual, type Role } from './_session.js';

export async function POST(request: Request) {
  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return json({ error: 'Ogiltig förfrågan' }, 400);
  }

  const owner = process.env.APP_PASSWORD;
  const mamma = process.env.MAMMA_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  // Saknad serverkonfiguration ska inte se ut som ett felskrivet lösenord.
  if ((!owner && !mamma) || !secret || secret.length < 16) return json({ error: 'not_configured' }, 503);
  let role: Role | null = null;
  if (owner && safeEqual(password, owner)) role = 'owner';
  else if (mamma && safeEqual(password, mamma)) role = 'mamma';

  if (!role) {
    await new Promise((r) => setTimeout(r, 600)); // bromsar gissning
    return json({ error: 'Fel lösenord' }, 401);
  }
  return json({ role }, 200, { 'set-cookie': cookieHeader(makeToken(role), MAX_AGE) });
}
