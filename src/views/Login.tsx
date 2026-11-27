import { useState, type FormEvent } from 'react';
import { PawPrint } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function Login() {
  const { login } = useAuth();
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true);
    setError(null);
    const err = await login(pw);
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center px-6">
      <div className="glass-strong rounded-[32px] p-7 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/10">
          <PawPrint size={32} />
        </div>
        <h1 className="font-display text-3xl font-semibold">Labbeliv</h1>
        <p className="mt-1 text-base text-white/65">Skriv lösenordet för att komma in</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            autoComplete="current-password"
            placeholder="Lösenord"
            aria-label="Lösenord"
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center text-xl outline-none placeholder:text-white/35 focus:border-white/50"
          />
          {error && <p role="alert" className="text-base font-medium text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={busy || !pw}
            className="w-full rounded-2xl bg-white/90 py-4 text-xl font-bold text-slate-900 transition active:scale-95 disabled:opacity-50"
          >
            {busy ? 'Loggar in…' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  );
}
