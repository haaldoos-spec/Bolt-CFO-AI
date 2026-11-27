import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Role = 'owner' | 'mamma';
type Status = { state: 'loading' } | { state: 'anon' } | { state: 'in'; role: Role };

interface AuthCtx {
  status: Status;
  login: (password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const ROLE_CACHE = 'labbeliv.role';

// Artefakt-bygget (Claude) har ingen server och ingen inloggning.
const NO_AUTH = import.meta.env.VITE_ARTIFACT === '1';

const cached = (): Role | null => {
  try {
    const r = localStorage.getItem(ROLE_CACHE);
    return r === 'owner' || r === 'mamma' ? r : null;
  } catch {
    return null;
  }
};
const remember = (role: Role | null) => {
  try {
    if (role) localStorage.setItem(ROLE_CACHE, role);
    else localStorage.removeItem(ROLE_CACHE);
  } catch {
    /* ignorera */
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(NO_AUTH ? { state: 'in', role: 'owner' } : { state: 'loading' });

  useEffect(() => {
    if (NO_AUTH) return;
    fetch('/api/me', { credentials: 'same-origin' })
      .then(async (res) => {
        if (res.ok) {
          const { role } = (await res.json()) as { role: Role };
          remember(role);
          setStatus({ state: 'in', role });
        } else if (res.status === 404 && import.meta.env.DEV) {
          setStatus({ state: 'in', role: 'owner' }); // vanlig `vite` utan API
        } else {
          remember(null);
          setStatus({ state: 'anon' });
        }
      })
      .catch(() => {
        // Offline: använd senast kända roll (cookien kontrolleras igen när nätet är tillbaka)
        const role = cached();
        setStatus(role ? { state: 'in', role } : { state: 'anon' });
      });
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 503) return 'Servern är inte färdigkonfigurerad. Kontrollera lösenorden i Vercel och gör en ny deploy.';
      if (!res.ok) return res.status === 401 ? 'Fel lösenord – försök igen.' : 'Något gick fel. Försök igen.';
      const { role } = (await res.json()) as { role: Role };
      remember(role);
      setStatus({ state: 'in', role });
      return null;
    } catch {
      return 'Ingen kontakt med servern. Kolla internet.';
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    remember(null);
    setStatus({ state: 'anon' });
  }, []);

  const value = useMemo(() => ({ status, login, logout }), [status, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth måste användas inom AuthProvider');
  return c;
}
