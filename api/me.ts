import { json, roleFromRequest } from './_session';

export async function GET(request: Request) {
  const role = roleFromRequest(request);
  return role ? json({ role }) : json({ error: 'Inte inloggad' }, 401);
}
