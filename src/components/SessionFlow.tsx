import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Clock, Droplets, Flame, Moon, Pause, Play, Shuffle, SkipBack, SkipForward, Sparkles, Timer, X } from 'lucide-react';
import type { DisciplineId, DogId } from '../types';
import { useApp } from '../store/AppContext';
import { DISCIPLINES, exerciseById } from '../data/training';
import { dogsOf } from '../data/profiles';
import { buildSession, fmt, type SessionPlan, type StepKind } from '../lib/session';
import { Avatar, DogTag, ICONS, Ring, Sheet, Stars } from './ui';

const KIND_META: Record<StepKind, { label: string; icon: typeof Flame; color: string }> = {
  warmup: { label: 'Uppvärmning', icon: Flame, color: '#fdba74' },
  work: { label: 'Övningsblock', icon: Sparkles, color: 'var(--a1)' },
  rest: { label: 'Vila', icon: Droplets, color: '#67e8f9' },
  cooldown: { label: 'Nedvarvning', icon: Moon, color: '#c4b5fd' },
};

type DogChoice = 'senior' | 'puppy' | 'both';

export function SessionFlow() {
  const { generator, openGenerator, profile } = useApp();
  const [dogChoice, setDogChoice] = useState<DogChoice>(profile);
  const [discipline, setDiscipline] = useState<DisciplineId | 'mix'>('mix');
  const [minutes, setMinutes] = useState(15);
  const [seed, setSeed] = useState(0);
  const [running, setRunning] = useState<SessionPlan | null>(null);
  const [rating, setRating] = useState<SessionPlan | null>(null);

  useEffect(() => {
    if (generator) {
      setDogChoice(profile);
      if (generator.discipline) setDiscipline(generator.discipline);
      if (generator.minutes) setMinutes(generator.minutes);
    }
  }, [generator, profile]);

  const dogs = dogsOf(dogChoice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const plan = useMemo(() => buildSession(dogs, discipline, minutes), [dogChoice, discipline, minutes, seed]);

  return (
    <>
      <Sheet open={!!generator} onClose={() => openGenerator(null)} title="Jag har X minuter">
        <div className="label mb-2">Hund</div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {(['senior', 'puppy', 'both'] as DogChoice[]).map((d) => (
            <button
              key={d}
              onClick={() => setDogChoice(d)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition active:scale-95 ${dogChoice === d ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5'}`}
            >
              {d === 'both' ? (
                <div className="flex -space-x-2"><Avatar dog="senior" size={30} /><Avatar dog="puppy" size={30} /></div>
              ) : (
                <Avatar dog={d} size={30} ring={dogChoice === d} />
              )}
              <span className="text-xs font-semibold">{d === 'senior' ? 'Senior' : d === 'puppy' ? 'Valp' : 'Båda'}</span>
            </button>
          ))}
        </div>

        <div className="label mb-2">Gren</div>
        <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 no-scrollbar">
          {[{ id: 'mix' as const, name: 'Mix', icon: 'Sparkles' }, ...DISCIPLINES].map((d) => {
            const Icon = ICONS[d.icon] ?? Sparkles;
            const active = discipline === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDiscipline(d.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${active ? 'border-transparent text-ink' : 'border-white/15 bg-white/5 text-white/80'}`}
                style={active ? { background: 'linear-gradient(120deg,var(--a1),var(--a2))' } : undefined}
              >
                <Icon size={16} /> {d.name}
              </button>
            );
          })}
        </div>

        <div className="label mb-2">Tid</div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {[15, 30, 45].map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`rounded-2xl border py-4 text-center transition active:scale-95 ${minutes === m ? 'border-white/40 bg-white/15' : 'border-white/10 bg-white/5'}`}
            >
              <div className="font-display text-2xl font-semibold">{m}</div>
              <div className="text-[11px] font-semibold text-white/50">minuter</div>
            </button>
          ))}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <div className="label">Ditt pass · {plan.steps.length} block</div>
          <button onClick={() => setSeed((s) => s + 1)} className="chip active:scale-95">
            <Shuffle size={13} /> Blanda om
          </button>
        </div>
        <div key={`${seed}-${dogChoice}-${discipline}-${minutes}`} className="glass mb-5 divide-y divide-white/[0.07] overflow-hidden">
          {plan.steps.map((s, i) => {
            const meta = KIND_META[s.kind];
            const Icon = meta.icon;
            return (
              <div key={i} className="flex animate-rise items-center gap-3 px-4 py-3" style={{ animationDelay: `${i * 35}ms` }}>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10" style={{ color: meta.color }}>
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{s.title}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                    {meta.label}
                    {s.dog && s.kind === 'work' && <> · <Avatar dog={s.dog} size={14} /> jobbar</>}
                    {s.waitingDog && <> · <Avatar dog={s.waitingDog} size={14} /> passivitet</>}
                  </div>
                </div>
                <div className="text-xs font-bold tabular-nums text-white/70">{fmt(s.seconds)}</div>
              </div>
            );
          })}
        </div>
        <button
          className="btn-accent w-full text-base"
          onClick={() => {
            openGenerator(null);
            setRunning(plan);
          }}
        >
          <Timer size={20} /> Starta passet
        </button>
      </Sheet>

      {running && (
        <Runner
          plan={running}
          onClose={() => setRunning(null)}
          onFinish={() => {
            setRating(running);
            setRunning(null);
          }}
        />
      )}
      <RatingSheet plan={rating} onClose={() => setRating(null)} />
    </>
  );
}

const beep = (() => {
  let ctx: AudioContext | null = null;
  return (freq = 880) => {
    try {
      ctx ??= new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.4);
      navigator.vibrate?.(120);
    } catch {
      /* ljud ej tillgängligt */
    }
  };
})();

function Runner({ plan, onClose, onFinish }: { plan: SessionPlan; onClose: () => void; onFinish: () => void }) {
  const { state } = useApp();
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(plan.steps[0].seconds);
  const [paused, setPaused] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const deadline = useRef(Date.now() + plan.steps[0].seconds * 1000);
  const step = plan.steps[i];
  const totalSec = plan.steps.reduce((a, s) => a + s.seconds, 0);
  const elapsed = plan.steps.slice(0, i).reduce((a, s) => a + s.seconds, 0) + (step.seconds - left);

  const go = (n: number) => {
    if (n >= plan.steps.length) {
      beep(1320);
      onFinish();
      return;
    }
    const k = Math.max(0, n);
    setI(k);
    setLeft(plan.steps[k].seconds);
    deadline.current = Date.now() + plan.steps[k].seconds * 1000;
    setShowHow(false);
  };

  useEffect(() => {
    if (paused) return;
    deadline.current = Date.now() + left * 1000;
    const t = setInterval(() => {
      const rem = Math.max(0, Math.round((deadline.current - Date.now()) / 1000));
      setLeft(rem);
      if (rem === 3 || rem === 2 || rem === 1) beep(660);
      if (rem <= 0) {
        beep(990);
        go(i + 1);
      }
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, i]);

  const meta = KIND_META[step.kind];
  const ex = step.exerciseId ? exerciseById(step.exerciseId) : undefined;
  const next = plan.steps[i + 1];

  return (
    <div className="fixed inset-0 z-[1100] flex animate-fade flex-col overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-[calc(env(safe-area-inset-top)+16px)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Avbryt">
          <X size={20} />
        </button>
        <div className="text-center">
          <div className="label">Block {i + 1} av {plan.steps.length}</div>
          <div className="text-xs font-semibold text-white/60 tabular-nums">{fmt(elapsed)} / {fmt(totalSec)}</div>
        </div>
        <button onClick={onFinish} className="chip">Avsluta</button>
      </div>

      <div className="mb-6 flex gap-1">
        {plan.steps.map((s, k) => (
          <div key={k} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: k < i ? '100%' : k === i ? `${(1 - left / s.seconds) * 100}%` : '0%', background: 'linear-gradient(90deg,var(--a1),var(--a2))' }} />
          </div>
        ))}
      </div>

      <div key={i} className="flex animate-rise flex-col items-center text-center">
        <span className="chip mb-4" style={{ color: meta.color }}>
          <meta.icon size={14} /> {meta.label}
        </span>
        <Ring value={1 - left / step.seconds} size={208} stroke={11}>
          <div className="flex flex-col items-center">
            <div className="font-display text-6xl font-semibold tabular-nums">{fmt(left)}</div>
            <div className="mt-1 text-xs font-semibold text-white/50">{paused ? 'Pausad' : 'kvar'}</div>
          </div>
        </Ring>
        <h2 className="mt-6 font-display text-[28px] font-semibold leading-tight">{step.title}</h2>
        {(step.dog || step.waitingDog) && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {step.dog && step.kind === 'work' && (
              <span className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm font-semibold">
                <Avatar dog={step.dog} size={26} ring /> {state.dogs[step.dog].name} jobbar
              </span>
            )}
            {step.waitingDog && (
              <span className="flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3 text-sm text-white/70">
                <Avatar dog={step.waitingDog} size={26} /> passivitet på filten
              </span>
            )}
          </div>
        )}
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/75">{step.detail}</p>

        {ex && (
          <div className="mt-4 w-full max-w-sm text-left">
            <button onClick={() => setShowHow((v) => !v)} className="btn-ghost w-full justify-between text-sm">
              Visa 3-stegsguiden <ChevronDown size={16} className={`transition ${showHow ? 'rotate-180' : ''}`} />
            </button>
            {showHow && (
              <ol className="glass mt-2 animate-rise space-y-3 p-4 text-sm text-white/80">
                {ex.steps.map((s, k) => (
                  <li key={k} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 text-xs font-bold">{k + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-8">
        {next && (
          <div className="glass mb-4 flex items-center gap-3 px-4 py-3 text-sm">
            <Clock size={16} className="text-white/50" />
            <span className="text-white/50">Härnäst:</span>
            <span className="flex-1 truncate font-semibold">{next.title}</span>
            {next.dog && next.kind === 'work' && <Avatar dog={next.dog} size={22} />}
          </div>
        )}
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => go(i - 1)} className="grid h-14 w-14 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Föregående">
            <SkipBack size={22} />
          </button>
          <button onClick={() => setPaused((p) => !p)} className="btn-accent !h-20 !w-20 !rounded-full !p-0" aria-label={paused ? 'Starta' : 'Pausa'}>
            {paused ? <Play size={30} className="ml-1" /> : <Pause size={30} />}
          </button>
          <button onClick={() => go(i + 1)} className="grid h-14 w-14 place-items-center rounded-full bg-white/10 active:scale-90" aria-label="Nästa">
            <SkipForward size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RatingSheet({ plan, onClose }: { plan: SessionPlan | null; onClose: () => void }) {
  const { dispatch, toast, fireCelebrate } = useApp();
  const [ratings, setRatings] = useState<Partial<Record<DogId, number>>>({});
  const [note, setNote] = useState('');
  useEffect(() => {
    if (plan) {
      setRatings(Object.fromEntries(plan.dogs.map((d) => [d, 4])));
      setNote('');
    }
  }, [plan]);
  if (!plan) return null;
  const disc = plan.discipline === 'mix' ? 'Mixpass' : DISCIPLINES.find((d) => d.id === plan.discipline)!.name;
  const save = () => {
    const xp = plan.minutes * 2;
    plan.dogs.forEach((d) => dispatch({ type: 'xp', dogs: [d], amount: xp + (ratings[d] ?? 3) * 5 }));
    dispatch({
      type: 'addSession',
      session: {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        dogs: plan.dogs,
        discipline: plan.discipline,
        minutes: plan.minutes,
        intensity: plan.intensity,
        ratings,
        note: note.trim() || undefined,
        title: `${disc} ${plan.minutes} min`,
      },
    });
    fireCelebrate();
    toast('Passet sparat!', xp + 20);
    onClose();
  };
  return (
    <Sheet open onClose={onClose} title="Bra jobbat! 🎉">
      <p className="-mt-2 mb-5 text-sm text-white/60">{disc} · {plan.minutes} min. Hur gick det?</p>
      <div className="space-y-3">
        {plan.dogs.map((d) => (
          <div key={d} className="glass flex items-center justify-between gap-3 p-4">
            <DogTag dog={d} />
            <Stars value={ratings[d] ?? 0} onChange={(v) => setRatings((r) => ({ ...r, [d]: v }))} size={26} />
          </div>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Anteckning: vad satt, vad ska vi jobba på?"
        rows={3}
        className="mt-4 w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-4 text-sm outline-none placeholder:text-white/35 focus:border-white/35"
      />
      <button onClick={save} className="btn-accent mt-4 w-full">Spara & få XP</button>
    </Sheet>
  );
}
