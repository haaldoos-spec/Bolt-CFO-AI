import { cookieHeader, json } from './_session.js';

export async function POST() {
  return json({ ok: true }, 200, { 'set-cookie': cookieHeader('', 0) });
}
