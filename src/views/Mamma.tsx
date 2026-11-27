import { useState } from 'react';
import { ChevronDown, Clock, LogOut, Sparkles } from 'lucide-react';
import type { DogId } from '../types';
import { useApp } from '../store/AppContext';
import { useAuth } from '../lib/auth';
import { Avatar } from '../components/ui';
import { MAMMA_ITEMS, MAMMA_KINDS, dailyPick, type MammaItem, type MammaKind } from '../data/mammaContent';

function ItemCard({ item, open, onToggle }: { item: MammaItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 p-5 text-left active:opacity-80">
        <div className="min-w-0 flex-1">
          <div className="text-xl font-semibold leading-snug">{item.title}</div>
          <div className="mt-1 flex items-center gap-1.5 text-base text-white/60">
            <Clock size={16} /> ca {item.minutes} min
          </div>
        </div>
        <ChevronDown size={26} className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-white/10 p-5 text-lg leading-relaxed">
          <p>{item.what}</p>
          <div>
            <div className="mb-2 text-sm font-bold uppercase tracking-wider text-white/55">Så gör du</div>
            <ol className="space-y-2.5">
              {item.how.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-base font-bold">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className="mb-1 text-sm font-bold uppercase tracking-wider text-white/55">När</div>
            <p>{item.when}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Mamma() {
  const { state } = useApp();
  const { logout } = useAuth();
  const [dog, setDog] = useState<DogId>('senior');
  const [kind, setKind] = useState<MammaKind>('promenad');
  const [openId, setOpenId] = useState<string | null>(null);

  const pick = dailyPick(dog);
  const items = MAMMA_ITEMS.filter((i) => i.kind === kind && i.dogs.includes(dog));
  const dogs: DogId[] = ['senior', 'puppy'];

  return (
    <div className="space-y-6 pb-4">
      <div className="px-1">
        <h1 className="font-display text-4xl font-semibold leading-tight">Hej Mamma!</h1>
        <p className="mt-1 text-lg text-white/65">Vem ska du göra något med idag?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dogs.map((d) => (
          <button
            key={d}
            onClick={() => { setDog(d); setOpenId(null); }}
            aria-pressed={dog === d}
            className={`flex flex-col items-center gap-2 rounded-3xl border-2 p-4 transition active:scale-95 ${dog === d ? 'border-white/70 bg-white/20' : 'border-white/10 bg-white/5 opacity-70'}`}
          >
            <Avatar dog={d} size={64} ring={dog === d} />
            <span className="text-xl font-semibold">{state.dogs[d].name}</span>
          </button>
        ))}
      </div>

      <section className="glass-strong rounded-3xl p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/60">
          <Sparkles size={16} /> Idag föreslår jag
        </div>
        <div className="text-2xl font-semibold">{pick.title}</div>
        <p className="mt-2 text-lg leading-relaxed text-white/80">{pick.what}</p>
        <button
          onClick={() => { setKind(pick.kind); setOpenId(pick.id); }}
          className="mt-4 w-full rounded-2xl bg-white/90 py-4 text-xl font-bold text-slate-900 active:scale-95"
        >
          Visa hur man gör
        </button>
      </section>

      <div className="grid grid-cols-3 gap-2 rounded-3xl bg-white/5 p-1.5">
        {MAMMA_KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => { setKind(k.id); setOpenId(null); }}
            aria-pressed={kind === k.id}
            className={`rounded-2xl py-3.5 text-lg font-semibold transition active:scale-95 ${kind === k.id ? 'bg-white/90 text-slate-900' : 'text-white/70'}`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((i) => (
          <ItemCard key={i.id} item={i} open={openId === i.id} onToggle={() => setOpenId(openId === i.id ? null : i.id)} />
        ))}
      </div>

      <button onClick={logout} className="mx-auto flex items-center gap-2 py-3 text-base text-white/45 active:opacity-70">
        <LogOut size={16} /> Logga ut
      </button>
    </div>
  );
}
